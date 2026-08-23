import jsPDF from "jspdf";
import QRCode from "qrcode";

export type ReceiptSnapshot = {
  company?: string;
  currency?: string;
  company_phone?: string | null;
  tenant_name?: string;
  tenant_phone?: string;
  property?: string | null;
  property_code?: string | null;
  unit?: string | null;
  room?: string | null;
  method?: string;
  reference?: string | null;
  period?: string;
  paid_at?: string;
  rent_amount?: number;
};

export type ReceiptRecord = {
  id?: string;
  receipt_number: string;
  public_id: string;
  amount: number | string;
  balance: number | string;
  issued_by?: string | null;
  issued_at: string;
  snapshot: ReceiptSnapshot;
};

export function receiptUrl(publicId: string) {
  const origin = typeof window === "undefined" ? "https://rentreceipt.co.ke" : window.location.origin;
  return `${origin}/receipt/${publicId}`;
}

export async function buildReceiptPdf(receipt: ReceiptRecord) {
  const snap = receipt.snapshot ?? {};
  const currency = snap.currency ?? "KSh";
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  // Background Header - Deep Midnight Navy #0B1220
  doc.setFillColor(11, 18, 32);
  doc.rect(0, 0, w, 110, "F");

  // Accent Line - Electric Orange #FF7A00
  doc.setFillColor(255, 122, 0);
  doc.rect(0, 110, w, 4, "F");

  // Company / Landlord Header
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(snap.company ?? "Rent Receipt Pro", 40, 48);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(203, 213, 225);
  doc.text("Official Verified Digital Rent Receipt", 40, 68);
  if (snap.company_phone) {
    doc.text(`Contact: ${snap.company_phone}`, 40, 84);
  }

  // Receipt Number & Date (Right Header)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text(receipt.receipt_number, w - 40, 46, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(203, 213, 225);
  const issuedDate = new Date(receipt.issued_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  doc.text(`Date Issued: ${issuedDate}`, w - 40, 68, { align: "right" });
  doc.text("Status: VERIFIED & PAID", w - 40, 84, { align: "right" });

  // Verification Badge Pill
  doc.setFillColor(16, 185, 129, 0.15);
  doc.roundedRect(40, 130, 180, 24, 6, 6, "F");
  doc.setTextColor(5, 150, 105);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("✔ OFFICIAL DIGITAL STAMP", 50, 146);

  // Key Details Table Grid
  let y = 185;
  const col1 = 40;
  const col2 = 300;

  const renderField = (x: number, yPos: number, label: string, val: string) => {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(9);
    doc.text(label.toUpperCase(), x, yPos);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(12);
    doc.text(val || "—", x, yPos + 16);
  };

  // Row 1
  renderField(col1, y, "Tenant Full Name", snap.tenant_name ?? "—");
  renderField(col2, y, "Tenant Phone Number", snap.tenant_phone ?? "—");
  y += 48;

  // Row 2
  renderField(col1, y, "Property Name", snap.property ?? "—");
  renderField(
    col2,
    y,
    "Unit / Room Number",
    `Unit ${snap.unit ?? "—"}${snap.room ? ` · Room ${snap.room}` : ""}`
  );
  y += 48;

  // Row 3
  renderField(col1, y, "Rental Billing Period", snap.period ?? "—");
  renderField(
    col2,
    y,
    "Payment Method & Reference",
    `${(snap.method ?? "M-PESA").toUpperCase()}${snap.reference ? ` · Ref: ${snap.reference}` : ""}`
  );
  y += 48;

  // Divider Line
  doc.setDrawColor(226, 232, 240);
  doc.line(40, y, w - 40, y);
  y += 24;

  // Financial Breakdown Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(40, y, w - 80, 80, 10, 10, "F");
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(40, y, w - 80, 80, 10, 10, "S");

  // Amount Paid Highlight
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text("TOTAL AMOUNT PAID", 60, y + 26);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(255, 122, 0); // Electric Orange
  doc.text(`${currency} ${Number(receipt.amount).toLocaleString()}`, 60, y + 56);

  // Balance Remaining
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text("OUTSTANDING BALANCE", 280, y + 26);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  const bal = Number(receipt.balance ?? 0);
  doc.setTextColor(bal > 0 ? 225 : 16, bal > 0 ? 29 : 185, bal > 0 ? 72 : 129);
  doc.text(bal > 0 ? `${currency} ${bal.toLocaleString()}` : "KSh 0 (Settled)", 280, y + 54);

  y += 110;

  // QR Code & Verification Block
  const url = receiptUrl(receipt.public_id);
  const qr = await QRCode.toDataURL(url, { margin: 1, width: 320 });
  doc.addImage(qr, "PNG", w - 160, y, 120, 120);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("Scan QR Code to Verify Authenticity", 40, y + 25);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(
    "This receipt is digitally signed and cryptographically stored on the RentReceiptPro nationwide registry.\nTo verify independently, scan the QR code with any smartphone camera or visit the URL below:",
    40,
    y + 44,
    { maxWidth: 360 }
  );

  doc.setFont("courier", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(255, 122, 0);
  doc.text(url, 40, y + 84, { maxWidth: 360 });

  // Signature Line
  y += 140;
  doc.setDrawColor(203, 213, 225);
  doc.line(40, y, 220, y);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  doc.text(`Authorized by: ${receipt.issued_by ?? snap.company ?? "Codevanta Ventures"}`, 40, y + 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184);
  doc.text("RentReceiptPro Verified Digital Authority · Kenya", 40, y + 30);

  // Bottom Footer Bar
  doc.setFillColor(241, 245, 249);
  doc.rect(0, h - 35, w, 35, "F");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("RentReceiptPro — Automated Digital Rent Invoicing & Receipts · Kenya", 40, h - 16);
  doc.text("Support: info@rentreceipt.co.ke", w - 40, h - 16, { align: "right" });

  return doc;
}

export async function downloadReceiptPdf(receipt: ReceiptRecord) {
  const doc = await buildReceiptPdf(receipt);
  doc.save(`${receipt.receipt_number}.pdf`);
}

export async function qrDataUrl(value: string) {
  return QRCode.toDataURL(value, { margin: 1, width: 320 });
}
