import jsPDF from "jspdf";
import QRCode from "qrcode";
import { PLANS, type PlanKey } from "./plans";

export type SubscriptionPaymentRecord = {
  id: string;
  reference: string;
  plan: string;
  amount: number;
  currency?: string;
  status: string;
  paid_at?: string | null;
  created_at: string;
};

export type LandlordProfileInfo = {
  company_name?: string | null;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
};

export async function buildSubscriptionReceiptPdf(
  payment: SubscriptionPaymentRecord,
  landlord?: LandlordProfileInfo,
) {
  const planKey = (payment.plan in PLANS ? payment.plan : "monthly") as PlanKey;
  const planDetails = PLANS[planKey] ?? { label: payment.plan.toUpperCase(), periodLabel: "month" };
  const currency = payment.currency ?? "KES";
  const amountStr = `KSh ${Number(payment.amount).toLocaleString()}`;
  const receiptNo = `RRP-SUB-${payment.reference.replace(/[^a-zA-Z0-9]/g, "").slice(-8).toUpperCase()}`;

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  // Header Background - Deep Midnight Navy #0B1220
  doc.setFillColor(11, 18, 32);
  doc.rect(0, 0, w, 115, "F");

  // Accent Line - Electric Orange #FF7A00
  doc.setFillColor(255, 122, 0);
  doc.rect(0, 115, w, 4, "F");

  // Issuer Info (Left)
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("RentReceiptPro", 40, 48);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(203, 213, 225);
  doc.text("Codevanta Ventures · Property Management Systems", 40, 68);
  doc.text("Nairobi, Kenya · support@rentreceipt.co.ke · www.rentreceipt.co.ke", 40, 84);

  // Receipt Number & Date (Right)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(255, 122, 0);
  doc.text("PLATFORM TAX RECEIPT", w - 40, 44, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text(`Receipt #: ${receiptNo}`, w - 40, 64, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225);
  const dateStr = new Date(payment.paid_at || payment.created_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  doc.text(`Date: ${dateStr}`, w - 40, 80, { align: "right" });
  doc.text(`Status: COMPLETED (PAID)`, w - 40, 94, { align: "right" });

  // Verification Badge Pill
  doc.setFillColor(16, 185, 129, 0.15);
  doc.roundedRect(40, 135, 230, 24, 6, 6, "F");
  doc.setTextColor(5, 150, 105);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("✔ OFFICIAL PAYMENT CONFIRMATION", 50, 151);

  // Landlord Billed-To Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(40, 175, w - 80, 85, 8, 8, "FD");

  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("BILLED TO / SUBSCRIBER DETAILS", 55, 195);

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(landlord?.company_name || landlord?.full_name || "Valued Property Manager", 55, 215);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  if (landlord?.email) doc.text(`Email: ${landlord.email}`, 55, 232);
  if (landlord?.phone) doc.text(`Phone: ${landlord.phone}`, 55, 247);

  // Payment Metadata (Right side of Billed-To Box)
  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("TRANSACTION REFERENCE", w - 240, 195);

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(payment.reference, w - 240, 215);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text("Payment Gateway: Paystack Secure Checkout", w - 240, 232);
  doc.text(`Method: Card / M-Pesa / Bank`, w - 240, 247);

  // Line Item Table
  let tableY = 285;
  doc.setFillColor(11, 18, 32);
  doc.rect(40, tableY, w - 80, 26, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text("DESCRIPTION / SERVICE", 55, tableY + 17);
  doc.text("BILLING CYCLE", 340, tableY + 17);
  doc.text("AMOUNT", w - 55, tableY + 17, { align: "right" });

  // Row 1
  tableY += 26;
  doc.setFillColor(255, 255, 255);
  doc.rect(40, tableY, w - 80, 50, "F");
  doc.setDrawColor(226, 232, 240);
  doc.line(40, tableY + 50, w - 40, tableY + 50);

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`RentReceiptPro ${planDetails.label} Plan`, 55, tableY + 22);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Cloud Property & Tenant Management, QR Verified Receipts & Portals", 55, tableY + 38);

  doc.setTextColor(71, 85, 105);
  doc.setFontSize(10);
  doc.text(`1 x ${planDetails.periodLabel}`, 340, tableY + 26);

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(amountStr, w - 55, tableY + 26, { align: "right" });

  // Financial Totals Box
  const totalsY = tableY + 70;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(w - 260, totalsY, 220, 95, 8, 8, "F");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Subtotal:", w - 240, totalsY + 22);
  doc.setTextColor(15, 23, 42);
  doc.text(amountStr, w - 55, totalsY + 22, { align: "right" });

  doc.setTextColor(100, 116, 139);
  doc.text("Tax / VAT (0%):", w - 240, totalsY + 42);
  doc.setTextColor(15, 23, 42);
  doc.text("KSh 0.00", w - 55, totalsY + 42, { align: "right" });

  doc.setDrawColor(226, 232, 240);
  doc.line(w - 245, totalsY + 55, w - 50, totalsY + 55);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(255, 122, 0);
  doc.text("Total Paid:", w - 240, totalsY + 77);
  doc.text(amountStr, w - 55, totalsY + 77, { align: "right" });

  // Generate Verification QR Code
  try {
    const verifyUrl = `https://rentreceipt.co.ke/billing?ref=${encodeURIComponent(payment.reference)}`;
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, { margin: 1, width: 140 });
    doc.addImage(qrDataUrl, "PNG", 45, totalsY - 10, 85, 85);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text("SCAN TO VERIFY RECEIPT", 140, totalsY + 22);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("Official cryptographically recorded subscription receipt.", 140, totalsY + 36);
    doc.text("Retain this document for accounting & tax deductions.", 140, totalsY + 48);
  } catch (err) {
    console.error("QR Code generation error:", err);
  }

  // Footer Disclaimer
  doc.setFillColor(241, 245, 249);
  doc.rect(0, h - 60, w, 60, "F");

  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(
    "Thank you for choosing RentReceiptPro! This is an official digital payment receipt issued by Codevanta Ventures.",
    w / 2,
    h - 38,
    { align: "center" },
  );
  doc.text(
    "For inquiries, billing adjustments, or corporate invoices, contact info@rentreceipt.co.ke or WhatsApp 0742868209.",
    w / 2,
    h - 24,
    { align: "center" },
  );

  return doc;
}

