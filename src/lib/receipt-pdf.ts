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
  receipt_number: string;
  public_id: string;
  amount: number | string;
  balance: number | string;
  issued_by?: string | null;
  issued_at: string;
  snapshot: ReceiptSnapshot;
};

export function receiptUrl(publicId: string) {
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  return `${origin}/receipt/${publicId}`;
}

export async function buildReceiptPdf(receipt: ReceiptRecord) {
  const snap = receipt.snapshot ?? {};
  const currency = snap.currency ?? "KSh";
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const w = doc.internal.pageSize.getWidth();

  doc.setFillColor(255, 107, 0);
  doc.rect(0, 0, w, 96, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text(snap.company ?? "Codevanta Ventures", 40, 46);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Official Rent Receipt", 40, 68);
  doc.text(`Receipt No: ${receipt.receipt_number}`, w - 40, 46, { align: "right" });
  doc.text(new Date(receipt.issued_at).toLocaleDateString("en-GB"), w - 40, 68, {
    align: "right",
  });

  doc.setTextColor(30, 30, 30);
  let y = 140;
  const row = (label: string, value: string) => {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120, 120, 120);
    doc.setFontSize(10);
    doc.text(label.toUpperCase(), 40, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(25, 25, 25);
    doc.setFontSize(12);
    doc.text(value || "—", 40, y + 16);
    y += 44;
  };

  row("Tenant", `${snap.tenant_name ?? ""}  ·  ${snap.tenant_phone ?? ""}`);
  row(
    "Property / Unit",
    `${snap.property ?? "—"}  ·  Unit ${snap.unit ?? "—"}${snap.room ? ` · Room ${snap.room}` : ""}`,
  );
  row("Period", snap.period ?? "—");
  row("Payment method", `${(snap.method ?? "cash").toUpperCase()}  ${snap.reference ? `· Ref ${snap.reference}` : ""}`);

  doc.setDrawColor(230, 230, 230);
  doc.line(40, y - 12, w - 40, y - 12);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 120, 120);
  doc.setFontSize(10);
  doc.text("AMOUNT PAID", 40, y + 16);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(255, 107, 0);
  doc.text(`${currency} ${Number(receipt.amount).toLocaleString()}`, 40, y + 46);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 120, 120);
  doc.text("BALANCE", 300, y + 16);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(25, 25, 25);
  doc.text(`${currency} ${Number(receipt.balance).toLocaleString()}`, 300, y + 42);

  const url = receiptUrl(receipt.public_id);
  const qr = await QRCode.toDataURL(url, { margin: 1, width: 320 });
  doc.addImage(qr, "PNG", w - 150, y + 4, 110, 110);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text("Scan to verify authenticity", w - 150, y + 128);
  doc.text(url, 40, y + 128, { maxWidth: 240 });

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text(`Issued by: ${receipt.issued_by ?? snap.company ?? "Codevanta Ventures"}`, 40, y + 190);
  doc.setDrawColor(180, 180, 180);
  doc.line(40, y + 210, 220, y + 210);
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text("Authorised digital signature", 40, y + 226);

  return doc;
}

export async function downloadReceiptPdf(receipt: ReceiptRecord) {
  const doc = await buildReceiptPdf(receipt);
  doc.save(`${receipt.receipt_number}.pdf`);
}

export async function qrDataUrl(value: string) {
  return QRCode.toDataURL(value, { margin: 1, width: 320 });
}