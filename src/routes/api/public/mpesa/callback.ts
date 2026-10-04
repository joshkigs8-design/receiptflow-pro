import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

interface StkCallbackItem {
  Name: string;
  Value?: string | number;
}

interface DarajaCallbackBody {
  Body?: {
    stkCallback?: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: StkCallbackItem[];
      };
    };
  };
}

export const Route = createFileRoute("/api/public/mpesa/callback")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const rawText = await request.text();
          if (!rawText) {
            return new Response(JSON.stringify({ ResultCode: 1, ResultDesc: "Empty payload" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const callbackData = JSON.parse(rawText) as DarajaCallbackBody;
          const stk = callbackData?.Body?.stkCallback;

          if (!stk) {
            return new Response(JSON.stringify({ ResultCode: 1, ResultDesc: "Malformed callback" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = stk;

          // 1. Locate the matching pending transaction
          const { data: transaction, error: findError } = await supabaseAdmin
            .from("mpesa_transactions")
            .select("*")
            .eq("checkout_request_id", CheckoutRequestID)
            .maybeSingle();

          if (findError || !transaction) {
            return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Transaction not found" }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          // 2. IDEMPOTENCY & STATE GUARD: Do not re-process completed transactions
          if (transaction.status === "success") {
            return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Already processed" }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          // 3. CORRELATION GUARD: Verify MerchantRequestID if present
          if (
            transaction.merchant_request_id &&
            MerchantRequestID &&
            transaction.merchant_request_id !== MerchantRequestID
          ) {
            return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Merchant ID mismatch" }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          // 4. Handle Failed / Cancelled STK Push
          if (ResultCode !== 0) {
            const status = ResultCode === 1032 ? "cancelled" : ResultCode === 1037 ? "timeout" : "failed";

            await supabaseAdmin
              .from("mpesa_transactions")
              .update({
                status,
                result_code: ResultCode,
                result_desc: ResultDesc || "Payment cancelled or failed",
                raw_callback: callbackData as never,
                updated_at: new Date().toISOString(),
              })
              .eq("id", transaction.id);

            return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Failure recorded" }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          // 5. Handle Successful Payment (ResultCode === 0)
          const items = CallbackMetadata?.Item || [];
          let mpesaReceiptNumber = "";
          let callbackAmount = transaction.amount;
          let phoneNumber = transaction.phone_number;

          for (const item of items) {
            if (item.Name === "MpesaReceiptNumber" && item.Value) {
              mpesaReceiptNumber = String(item.Value).trim().toUpperCase();
            }
            if (item.Name === "Amount" && item.Value) {
              const parsed = Number(item.Value);
              if (!isNaN(parsed) && parsed > 0) {
                callbackAmount = parsed;
              }
            }
            if (item.Name === "PhoneNumber" && item.Value) {
              phoneNumber = String(item.Value).trim();
            }
          }

          if (!mpesaReceiptNumber) {
            mpesaReceiptNumber = `MPESA_${Date.now()}`;
          }

          const paidAtIso = new Date().toISOString();
          const period = paidAtIso.slice(0, 7);

          // 6. ATOMIC CONCURRENCY LOCK: Transition status from pending/initiated -> success
          const { data: lockedTx, error: lockErr } = await supabaseAdmin
            .from("mpesa_transactions")
            .update({
              status: "success",
              result_code: 0,
              result_desc: ResultDesc || "Payment processed successfully",
              mpesa_receipt_number: mpesaReceiptNumber,
              amount: callbackAmount,
              phone_number: phoneNumber,
              paid_at: paidAtIso,
              raw_callback: callbackData as never,
              updated_at: new Date().toISOString(),
            })
            .eq("id", transaction.id)
            .in("status", ["pending", "initiated"])
            .select("id")
            .maybeSingle();

          if (lockErr || !lockedTx) {
            // Transaction was already claimed and processed concurrently
            return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Concurrent update ignored" }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          // 7. FINANCIAL ATOMIC SETTLEMENT & RECOVERY
          try {
            // Check if payment with this M-Pesa receipt already exists
            const { data: existingPayment } = await supabaseAdmin
              .from("payments")
              .select("id")
              .eq("reference", mpesaReceiptNumber)
              .maybeSingle();

            if (!existingPayment && transaction.tenant_id) {
              // Fetch Tenant and Property details
              const { data: tenant } = await supabaseAdmin
                .from("tenants")
                .select("*, properties(name,code), units(unit_number,room_number)")
                .eq("id", transaction.tenant_id)
                .maybeSingle();

              const { data: profile } = await supabaseAdmin
                .from("profiles")
                .select("company_name,currency,logo_url,phone")
                .eq("id", transaction.landlord_id)
                .maybeSingle();

              // Calculate updated balance using FIFO allocation (arrears first)
              const { data: allTenantPayments } = await supabaseAdmin
                .from("payments")
                .select("amount, status")
                .eq("tenant_id", transaction.tenant_id)
                .eq("landlord_id", transaction.landlord_id);

              const validPriorPays = (allTenantPayments ?? []).filter(
                (p: any) => p.status !== "failed" && p.status !== "cancelled"
              );
              const paidBeforeAll = validPriorPays.reduce((s: number, p: any) => s + Number(p.amount ?? 0), 0);
              const monthlyRent = Number(tenant?.rent_amount || callbackAmount);

              const startPeriod = (tenant?.lease_start || tenant?.created_at || period).slice(0, 7);
              let monthsElapsed = 1;
              try {
                const sY = parseInt(startPeriod.slice(0, 4));
                const sM = parseInt(startPeriod.slice(5, 7));
                const pY = parseInt(period.slice(0, 4));
                const pM = parseInt(period.slice(5, 7));
                monthsElapsed = Math.max((pY - sY) * 12 + (pM - sM) + 1, 1);
              } catch {}

              const priorMonthsCount = Math.max(monthsElapsed - 1, 0);
              const priorAccrued = priorMonthsCount * monthlyRent;
              const priorArrearsBefore = Math.max(priorAccrued - paidBeforeAll, 0);

              const amountToArrears = Math.min(callbackAmount, priorArrearsBefore);
              const remainingPriorArrears = priorArrearsBefore - amountToArrears;

              const amountToCurrentMonth = callbackAmount - amountToArrears;
              const currentMonthPaidBefore = Math.max(paidBeforeAll - priorAccrued, 0);
              const totalPaidCurrentMonth = currentMonthPaidBefore + amountToCurrentMonth;
              const currentMonthRemainingBalance = Math.max(monthlyRent - totalPaidCurrentMonth, 0);

              const totalRemainingBalance = remainingPriorArrears + currentMonthRemainingBalance;

              let mpesaNotes = `Instant M-Pesa STK (${mpesaReceiptNumber})`;
              if (amountToArrears > 0) {
                mpesaNotes += ` • KSh ${amountToArrears.toLocaleString()} allocated to prior arrears${remainingPriorArrears === 0 ? " (cleared)" : ""}`;
              }

              // Insert payment record
              const { data: newPayment, error: paymentInsertErr } = await supabaseAdmin
                .from("payments")
                .insert({
                  landlord_id: transaction.landlord_id,
                  tenant_id: transaction.tenant_id,
                  property_id: transaction.property_id,
                  unit_id: transaction.unit_id,
                  amount: callbackAmount,
                  method: "mpesa",
                  reference: mpesaReceiptNumber,
                  paid_at: paidAtIso,
                  period_label: period,
                  status: totalRemainingBalance > 0 ? "partial" : "paid",
                  notes: mpesaNotes,
                })
                .select("id")
                .single();

              if (paymentInsertErr) {
                throw new Error(`Payment record insertion failed: ${paymentInsertErr.message}`);
              }

              // Generate official digital receipt
              if (newPayment && tenant) {
                const receiptNumber = `RCP-${paidAtIso.replaceAll("-", "").slice(0, 6)}-${Math.random()
                  .toString(36)
                  .slice(2, 7)
                  .toUpperCase()}`;

                await supabaseAdmin.from("receipts").insert({
                  landlord_id: transaction.landlord_id,
                  payment_id: newPayment.id,
                  tenant_id: tenant.id,
                  receipt_number: receiptNumber,
                  amount: callbackAmount,
                  balance: totalRemainingBalance,
                  issued_by: profile?.company_name || "RentReceipt Pro",
                  snapshot: {
                    company: profile?.company_name || "RentReceipt Pro",
                    currency: profile?.currency || "KSh",
                    logo_url: profile?.logo_url || null,
                    company_phone: profile?.phone || null,
                    tenant_name: tenant.full_name,
                    tenant_phone: tenant.phone,
                    property: tenant.properties?.name || null,
                    property_code: tenant.properties?.code || null,
                    unit: tenant.units?.unit_number || null,
                    room: tenant.units?.room_number || null,
                    method: "mpesa",
                    reference: mpesaReceiptNumber,
                    period,
                    paid_at: paidAtIso,
                    rent_amount: monthlyRent,
                    prior_arrears: remainingPriorArrears,
                    total_balance: totalRemainingBalance,
                    period_balance: currentMonthRemainingBalance,
                    amount_to_arrears: amountToArrears,
                    amount_to_rent: amountToCurrentMonth,
                  },
                });

                // Notify Landlord
                await supabaseAdmin.from("notifications").insert({
                  landlord_id: transaction.landlord_id,
                  title: "M-Pesa Rent Payment Received",
                  body: `KSh ${callbackAmount.toLocaleString()} received from ${tenant.full_name} (${mpesaReceiptNumber}) for Unit ${tenant.units?.unit_number || tenant.units?.room_number || ""}`,
                  type: "payment",
                });
              }
            }
          } catch (settlementError) {
            // Failure recovery: mark transaction as pending_reconciliation so it's not lost
            await supabaseAdmin
              .from("mpesa_transactions")
              .update({
                status: "pending_reconciliation",
                result_desc: `M-Pesa success (${mpesaReceiptNumber}) but financial settlement error: ${settlementError instanceof Error ? settlementError.message : "Unknown error"}`,
                updated_at: new Date().toISOString(),
              })
              .eq("id", transaction.id);
          }

          return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Payment processed successfully" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch {
          return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Callback accepted" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
