import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  getKcbConfigByPaybill,
  parseKcbPaymentReference,
} from "@/lib/payments/kcb.server";
import type { KcbIpnPayload } from "@/lib/payments/types";

export const Route = createFileRoute("/api/public/kcb/ipn")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const rawText = await request.text();
          if (!rawText) {
            return new Response(
              JSON.stringify({
                StatusCode: "1",
                StatusMessage: "Empty IPN payload received",
              }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              },
            );
          }

          let ipnData: KcbIpnPayload;
          try {
            ipnData = JSON.parse(rawText);
          } catch {
            return new Response(
              JSON.stringify({
                StatusCode: "1",
                StatusMessage: "Malformed JSON payload",
              }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              },
            );
          }

          // 1. Normalize Payload Fields
          const transactionId = (
            ipnData.transactionId ||
            ipnData.transaction_id ||
            ipnData.externalReference ||
            ipnData.external_reference ||
            ""
          )
            .toString()
            .trim();

          const rawAmount = ipnData.amount ?? 0;
          const amount = typeof rawAmount === "string" ? parseFloat(rawAmount) : Number(rawAmount);

          const paybillNumber = (
            ipnData.paybillNumber ||
            ipnData.billNumber ||
            ipnData.bill_number ||
            ""
          )
            .toString()
            .trim();

          const accountNumber = (
            ipnData.accountNumber ||
            ipnData.account_number ||
            ipnData.merchantId ||
            ipnData.merchant_id ||
            ""
          )
            .toString()
            .trim();

          const accountReference = (
            ipnData.accountReference ||
            ipnData.account_reference ||
            ipnData.externalReference ||
            ipnData.external_reference ||
            ""
          )
            .toString()
            .trim();

          const phoneNumber = (
            ipnData.phoneNumber ||
            ipnData.phone_number ||
            ""
          )
            .toString()
            .trim();

          const customerName = (
            ipnData.customerName ||
            ipnData.customer_name ||
            ""
          )
            .toString()
            .trim();

          if (!transactionId || amount <= 0) {
            return new Response(
              JSON.stringify({
                StatusCode: "1",
                StatusMessage: "Missing required fields: transactionId and valid amount are mandatory.",
              }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              },
            );
          }

          // 2. IDEMPOTENCY GUARD: Check if transaction has already been recorded
          const { data: existingTx } = await supabaseAdmin
            .from("kcb_transactions")
            .select("id, status")
            .eq("kcb_transaction_id", transactionId)
            .maybeSingle();

          if (existingTx && existingTx.status === "success") {
            return new Response(
              JSON.stringify({
                StatusCode: "0",
                StatusMessage: "Transaction already processed successfully (Idempotent)",
                TransactionID: transactionId,
              }),
              {
                status: 200,
                headers: { "Content-Type": "application/json" },
              },
            );
          }

          // 3. IDENTIFY LANDLORD VIA KCB CONFIG
          let kcbConfig = paybillNumber
            ? await getKcbConfigByPaybill(paybillNumber, accountNumber)
            : null;

          // 4. PARSE PAYMENT REFERENCE TO RESOLVE PROPERTY & UNIT
          const parsedRef = parseKcbPaymentReference(accountReference);

          let matchedProperty: { id: string; name: string; code: string; landlord_id: string } | null = null;
          let matchedTenant: any = null;
          let matchedUnit: any = null;

          // If landlord not found via paybill, attempt to match via property code in reference
          if (!kcbConfig && parsedRef.propertyCode) {
            const { data: prop } = await supabaseAdmin
              .from("properties")
              .select("id, name, code, landlord_id")
              .eq("code", parsedRef.propertyCode.toUpperCase())
              .maybeSingle();

            if (prop) {
              matchedProperty = prop;
              const { getLandlordKcbConfig } = await import("@/lib/payments/kcb.server");
              kcbConfig = await getLandlordKcbConfig(prop.landlord_id);
            }
          }

          // If we have a landlord, locate the property
          if (kcbConfig) {
            if (!matchedProperty && parsedRef.propertyCode) {
              const { data: prop } = await supabaseAdmin
                .from("properties")
                .select("id, name, code, landlord_id")
                .eq("landlord_id", kcbConfig.landlord_id)
                .eq("code", parsedRef.propertyCode.toUpperCase())
                .maybeSingle();
              if (prop) matchedProperty = prop;
            }

            // Fallback: If only 1 property exists for this landlord, use it
            if (!matchedProperty) {
              const { data: props } = await supabaseAdmin
                .from("properties")
                .select("id, name, code, landlord_id")
                .eq("landlord_id", kcbConfig.landlord_id);
              if (props && props.length === 1) {
                matchedProperty = props[0];
              }
            }
          }

          // 5. RESOLVE TENANT & UNIT
          if (matchedProperty) {
            const { data: tenants } = await supabaseAdmin
              .from("tenants")
              .select("*, units(id, unit_number, room_number, rent)")
              .eq("property_id", matchedProperty.id);

            const targetUnitStr = (parsedRef.unitOrRoom || "").toUpperCase().replace(/[^A-Z0-9]/g, "");

            if (tenants && targetUnitStr) {
              matchedTenant = tenants.find((t) => {
                const uNum = (t.units?.unit_number || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
                const rNum = (t.units?.room_number || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
                return (uNum && uNum === targetUnitStr) || (rNum && rNum === targetUnitStr);
              });
            }

            // Fallback: match by phone number if provided
            if (!matchedTenant && phoneNumber && tenants) {
              const digits = phoneNumber.replace(/\D/g, "").slice(-9);
              matchedTenant = tenants.find((t) => t.phone && t.phone.replace(/\D/g, "").endsWith(digits));
            }

            if (matchedTenant) {
              matchedUnit = matchedTenant.units;
            }
          }

          const landlordId = kcbConfig?.landlord_id || matchedProperty?.landlord_id;
          const status = matchedTenant && landlordId ? "success" : "pending_reconciliation";
          const paidAtIso = ipnData.paymentDate || ipnData.payment_date || new Date().toISOString();
          const period = paidAtIso.slice(0, 7);

          // 6. UPSERT / INSERT KCB TRANSACTION RECORD
          const txPayload = {
            landlord_id: landlordId || "00000000-0000-0000-0000-000000000000",
            property_id: matchedProperty?.id || null,
            unit_id: matchedUnit?.id || null,
            tenant_id: matchedTenant?.id || null,
            amount,
            phone_number: phoneNumber || null,
            customer_name: customerName || null,
            account_reference: accountReference || "KCB_PAYMENT",
            kcb_transaction_id: transactionId,
            merchant_id: accountNumber || paybillNumber || null,
            channel: ipnData.channel || "KCB_BUNI",
            status,
            result_code: "0",
            result_desc: status === "success" ? "Payment received and reconciled" : "Pending manual unit reconciliation",
            paid_at: paidAtIso,
            raw_ipn: ipnData as never,
            updated_at: new Date().toISOString(),
          };

          let txId: string;
          if (existingTx) {
            await supabaseAdmin.from("kcb_transactions").update(txPayload).eq("id", existingTx.id);
            txId = existingTx.id;
          } else if (landlordId) {
            const { data: newTx } = await supabaseAdmin
              .from("kcb_transactions")
              .insert(txPayload)
              .select("id")
              .single();
            txId = newTx?.id || "";
          }

          // 7. FINANCIAL ATOMIC SETTLEMENT (IF FULLY RECONCILED)
          if (status === "success" && landlordId && matchedTenant) {
            // Check if payment with this reference already exists
            const { data: existingPayment } = await supabaseAdmin
              .from("payments")
              .select("id")
              .eq("reference", transactionId)
              .maybeSingle();

            if (!existingPayment) {
              // Fetch landlord profile for receipt branding
              const { data: profile } = await supabaseAdmin
                .from("profiles")
                .select("company_name,currency,logo_url,phone")
                .eq("id", landlordId)
                .maybeSingle();

              // Calculate tenant outstanding balance for this period
              const { data: priorPayments } = await supabaseAdmin
                .from("payments")
                .select("amount")
                .eq("tenant_id", matchedTenant.id)
                .eq("landlord_id", landlordId)
                .eq("period_label", period);

              const priorTotal = (priorPayments ?? []).reduce((s, p) => s + Number(p.amount), 0);
              const monthlyRent = Number(matchedTenant.rent_amount || amount);
              const newBalance = Math.max(monthlyRent - (priorTotal + amount), 0);

              // Insert payment record
              const { data: newPayment } = await supabaseAdmin
                .from("payments")
                .insert({
                  landlord_id: landlordId,
                  tenant_id: matchedTenant.id,
                  property_id: matchedProperty?.id || null,
                  unit_id: matchedUnit?.id || null,
                  amount,
                  method: "kcb",
                  reference: transactionId,
                  paid_at: paidAtIso.slice(0, 10),
                  period_label: period,
                  status: newBalance > 0 ? "partial" : "paid",
                  notes: `Automated KCB BUNI IPN (${transactionId})`,
                })
                .select("id")
                .single();

              // Generate official QR-verified digital receipt
              if (newPayment) {
                const receiptNumber = `KCB-${paidAtIso.replaceAll("-", "").slice(0, 6)}-${Math.random()
                  .toString(36)
                  .slice(2, 7)
                  .toUpperCase()}`;

                await supabaseAdmin.from("receipts").insert({
                  landlord_id: landlordId,
                  payment_id: newPayment.id,
                  tenant_id: matchedTenant.id,
                  receipt_number: receiptNumber,
                  amount,
                  balance: newBalance,
                  issued_by: profile?.company_name || "RentReceipt Pro",
                  snapshot: {
                    company: profile?.company_name || "RentReceipt Pro",
                    currency: profile?.currency || "KSh",
                    logo_url: profile?.logo_url || null,
                    company_phone: profile?.phone || null,
                    tenant_name: matchedTenant.full_name,
                    tenant_phone: matchedTenant.phone,
                    property: matchedProperty?.name || null,
                    property_code: matchedProperty?.code || null,
                    unit: matchedUnit?.unit_number || null,
                    room: matchedUnit?.room_number || null,
                    method: "KCB BUNI",
                    reference: transactionId,
                    period,
                    paid_at: paidAtIso,
                    rent_amount: monthlyRent,
                  },
                });

                // Create Landlord Notification
                await supabaseAdmin.from("notifications").insert({
                  landlord_id: landlordId,
                  title: `KCB Rent Payment Received: KSh ${amount.toLocaleString("en-KE")}`,
                  message: `${matchedTenant.full_name} paid KSh ${amount.toLocaleString("en-KE")} for Unit ${matchedUnit?.unit_number || matchedUnit?.room_number || "—"} (${matchedProperty?.name}) via KCB BUNI (Ref: ${transactionId}).`,
                  category: "payment",
                  link: "/payments",
                });
              }
            }
          }

          // 8. Return Standard KCB BUNI Acknowledgment
          return new Response(
            JSON.stringify({
              StatusCode: "0",
              StatusMessage:
                status === "success"
                  ? "Payment Received and Reconciled Successfully"
                  : "Payment Received (Pending Unit Match)",
              TransactionID: transactionId,
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            },
          );
        } catch (err: any) {
          console.error("KCB IPN Webhook Exception:", err);
          return new Response(
            JSON.stringify({
              StatusCode: "1",
              StatusMessage: "Internal server processing error",
              ErrorDetails: err?.message || "Unknown error",
            }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
      },
    },
  },
});

