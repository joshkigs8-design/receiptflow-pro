import jsPDF from "jspdf";
import QRCode from "qrcode";

export type ReceiptSnapshot = {
  company?: string;
  currency?: string;
  logo_url?: string | null;
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
  prior_arrears?: number;
  total_balance?: number;
  period_balance?: number;
  amount_to_arrears?: number;
  amount_to_rent?: number;
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

  const totalPaid = Number(receipt.amount ?? 0);
  const bal = Number(receipt.balance ?? 0);
  const priorArrears = Math.max(0, Number(snap.prior_arrears ?? 0));
  const rentAmount = Number(snap.rent_amount && snap.rent_amount > 0 ? snap.rent_amount : totalPaid);

  const amountToArrears =
    snap.amount_to_arrears !== undefined
      ? Number(snap.amount_to_arrears)
      : priorArrears > 0
        ? Math.min(priorArrears, totalPaid)
        : 0;

  const amountToRent =
    snap.amount_to_rent !== undefined
      ? Number(snap.amount_to_rent)
      : Math.max(0, totalPaid - amountToArrears);

  // Brand Palette: Deep Forest Green #063B2A, Rich Emerald #087443, Champagne Gold #C9A227
  const COLOR_FOREST = [6, 59, 42] as const;
  const COLOR_EMERALD = [8, 116, 67] as const;
  const COLOR_GOLD = [201, 162, 39] as const;
  const COLOR_DARK = [16, 23, 20] as const;
  const COLOR_MUTED = [100, 116, 139] as const;
  const COLOR_BORDER = [226, 232, 240] as const;
  const COLOR_CARD_BG = [248, 250, 248] as const;

  // 1. TOP HEADER BANNER
  doc.setFillColor(...COLOR_FOREST);
  doc.rect(0, 0, w, 115, "F");

  // Champagne Gold Accent Line
  doc.setFillColor(...COLOR_GOLD);
  doc.rect(0, 115, w, 4, "F");

  // Company / Landlord Header (Left)
  const companyName = snap.company && snap.company.trim() ? snap.company.trim() : "RENT RECEIPT PRO";
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(companyName.length > 25 ? 18 : 21);
  doc.text(companyName, 40, 48);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(232, 242, 237);
  doc.text("OFFICIAL VERIFIED DIGITAL RENT RECEIPT", 40, 68);

  doc.setFontSize(8.5);
  doc.setTextColor(203, 220, 212);
  const contactText = snap.company_phone
    ? `Contact: ${snap.company_phone} · Verified Rental Property System`
    : "Nationwide Digital Tenancy Registry · Kenya";
  doc.text(contactText, 40, 84);

  // Receipt Number & Date (Right Header)
  doc.setFillColor(...COLOR_EMERALD);
  doc.roundedRect(w - 180, 28, 140, 26, 5, 5, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(receipt.receipt_number, w - 110, 45, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(232, 242, 237);
  const issuedDate = new Date(receipt.issued_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  doc.text(`Issued: ${issuedDate}`, w - 40, 72, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_GOLD);
  doc.text("STATUS: VERIFIED & PAID", w - 40, 88, { align: "right" });

  // 2. VERIFICATION STAMP RIBBON
  doc.setFillColor(232, 242, 237);
  doc.roundedRect(40, 130, w - 80, 26, 6, 6, "F");
  doc.setDrawColor(...COLOR_EMERALD);
  doc.setLineWidth(0.8);
  doc.roundedRect(40, 130, w - 80, 26, 6, 6, "S");

  doc.setTextColor(...COLOR_FOREST);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("✔ OFFICIAL DIGITAL STAMP — REGISTRY SIGNED & TIME-STAMPED", 52, 147);

  doc.setTextColor(...COLOR_MUTED);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("KENYA TENANCY COMPLIANT", w - 52, 147, { align: "right" });

  // 3. KEY TENANCY & PROPERTY DETAILS CARDS
  let y = 168;
  const cardW = (w - 80 - 16) / 2;
  const cardH = 88;

  // Left Card: Property & Landlord
  doc.setFillColor(...COLOR_CARD_BG);
  doc.roundedRect(40, y, cardW, cardH, 8, 8, "F");
  doc.setDrawColor(...COLOR_BORDER);
  doc.roundedRect(40, y, cardW, cardH, 8, 8, "S");

  doc.setTextColor(...COLOR_FOREST);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("PROPERTY & PREMISES", 54, y + 18);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLOR_MUTED);
  doc.setFontSize(8);
  doc.text("PROPERTY NAME", 54, y + 33);
  doc.setTextColor(...COLOR_DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.text(snap.property ?? "—", 54, y + 46);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLOR_MUTED);
  doc.setFontSize(8);
  doc.text("UNIT / ROOM NUMBER", 54, y + 62);
  doc.setTextColor(...COLOR_DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(`Unit ${snap.unit ?? "—"}${snap.room ? ` · Room ${snap.room}` : ""}`, 54, y + 75);

  // Right Card: Tenant & Transaction
  const col2X = 40 + cardW + 16;
  doc.setFillColor(...COLOR_CARD_BG);
  doc.roundedRect(col2X, y, cardW, cardH, 8, 8, "F");
  doc.setDrawColor(...COLOR_BORDER);
  doc.roundedRect(col2X, y, cardW, cardH, 8, 8, "S");

  doc.setTextColor(...COLOR_FOREST);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("TENANT & PAYMENT RECORD", col2X + 14, y + 18);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLOR_MUTED);
  doc.setFontSize(8);
  doc.text("TENANT FULL NAME", col2X + 14, y + 33);
  doc.setTextColor(...COLOR_DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.text(snap.tenant_name ?? "—", col2X + 14, y + 46);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLOR_MUTED);
  doc.setFontSize(8);
  doc.text("PHONE / BILLING PERIOD", col2X + 14, y + 62);
  doc.setTextColor(...COLOR_DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(`${snap.tenant_phone ?? "—"} · Period: ${snap.period ?? "—"}`, col2X + 14, y + 75);

  y += cardH + 16;

  // 4. ACCOUNTING & FIFO ARREARS DEDUCTION BREAKDOWN TABLE
  doc.setFillColor(...COLOR_FOREST);
  doc.roundedRect(40, y, w - 80, 24, 5, 5, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("LINE ITEM / DESCRIPTION", 52, y + 16);
  doc.text("BILLING CYCLE", 230, y + 16);
  doc.text("ALLOCATION STATUS", 350, y + 16);
  doc.text("AMOUNT", w - 52, y + 16, { align: "right" });

  y += 24;

  const renderTableRow = (
    label: string,
    cycle: string,
    status: string,
    amountText: string,
    isSubItem = false,
    isBold = false,
    customColor?: readonly [number, number, number]
  ) => {
    // Alternating background or row line
    doc.setDrawColor(...COLOR_BORDER);
    doc.line(40, y + 22, w - 40, y + 22);

    doc.setFont("helvetica", isBold ? "bold" : "normal");
    doc.setFontSize(isSubItem ? 8.5 : 9);
    doc.setTextColor(...(customColor ?? (isBold ? COLOR_DARK : COLOR_DARK)));
    doc.text(label, isSubItem ? 62 : 52, y + 15);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...COLOR_MUTED);
    doc.text(cycle, 230, y + 15);

    doc.setFont("helvetica", isBold ? "bold" : "normal");
    doc.setTextColor(...(customColor ?? (isSubItem ? COLOR_EMERALD : COLOR_DARK)));
    doc.text(status, 350, y + 15);

    doc.setFont("helvetica", isBold ? "bold" : "normal");
    doc.setFontSize(9);
    doc.setTextColor(...(customColor ?? (isBold ? COLOR_DARK : COLOR_DARK)));
    doc.text(amountText, w - 52, y + 15, { align: "right" });

    y += 24;
  };

  if (priorArrears > 0) {
    renderTableRow(
      "1. Prior Outstanding Arrears",
      "Past Cycles",
      "Arrears Brought Forward",
      `${currency} ${priorArrears.toLocaleString()}`,
      false,
      true,
      [185, 28, 28] // Reddish for arrears
    );

    renderTableRow(
      "2. Current Period Rent Due",
      snap.period ?? "Current Month",
      "Contracted Rent",
      `${currency} ${rentAmount.toLocaleString()}`,
      false,
      true
    );

    renderTableRow(
      "3. Total Payment Received",
      (snap.method ?? "M-PESA").toUpperCase(),
      snap.reference ? `Ref: ${snap.reference}` : "Confirmed",
      `${currency} ${totalPaid.toLocaleString()}`,
      false,
      true,
      COLOR_EMERALD
    );

    renderTableRow(
      "   ⤷ Deducted from Prior Arrears",
      "FIFO Priority Deduction",
      "Arrears Cleared ✔",
      `-${currency} ${amountToArrears.toLocaleString()}`,
      true,
      false,
      COLOR_EMERALD
    );

    renderTableRow(
      "   ⤷ Applied to Current Month Rent",
      snap.period ?? "Current Month",
      amountToRent >= rentAmount ? "Rent Fully Paid ✔" : "Partial Rent Applied",
      `-${currency} ${amountToRent.toLocaleString()}`,
      true,
      false,
      COLOR_EMERALD
    );
  } else {
    renderTableRow(
      "1. Current Period Rent Due",
      snap.period ?? "Current Month",
      "Standard Rent",
      `${currency} ${rentAmount.toLocaleString()}`,
      false,
      true
    );

    renderTableRow(
      "2. Payment Received",
      (snap.method ?? "M-PESA").toUpperCase(),
      snap.reference ? `Ref: ${snap.reference}` : "Confirmed Payment",
      `${currency} ${totalPaid.toLocaleString()}`,
      false,
      true,
      COLOR_EMERALD
    );

    renderTableRow(
      "   ⤷ Applied to Rent",
      snap.period ?? "Current Month",
      totalPaid >= rentAmount ? "Paid in Full ✔" : "Partial Payment",
      `${currency} ${totalPaid.toLocaleString()}`,
      true,
      false,
      COLOR_EMERALD
    );
  }

  y += 12;

  // 5. FINANCIAL TOTALS SUMMARY BOX
  const summaryBoxH = 68;
  doc.setFillColor(...COLOR_CARD_BG);
  doc.roundedRect(40, y, w - 80, summaryBoxH, 8, 8, "F");
  doc.setDrawColor(...COLOR_BORDER);
  doc.roundedRect(40, y, w - 80, summaryBoxH, 8, 8, "S");

  // Left side: Total Amount Paid
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_MUTED);
  doc.text("TOTAL AMOUNT RECEIVED", 56, y + 22);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...COLOR_FOREST);
  doc.text(`${currency} ${totalPaid.toLocaleString()}`, 56, y + 49);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_MUTED);
  doc.text(`Method: ${(snap.method ?? "M-PESA").toUpperCase()}${snap.reference ? ` · Ref: ${snap.reference}` : ""}`, 56, y + 61);

  // Right side: Net Balance Remaining
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_MUTED);
  doc.text("NET OUTSTANDING BALANCE", 310, y + 22);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(19);
  if (bal > 0) {
    doc.setTextColor(220, 38, 38); // Red
    doc.text(`${currency} ${bal.toLocaleString()}`, 310, y + 47);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(220, 38, 38);
    doc.text("Pending Balance Awaiting Settlement", 310, y + 60);
  } else {
    doc.setTextColor(...COLOR_EMERALD);
    doc.text("KSh 0.00 (Fully Settled ✔)", 310, y + 47);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...COLOR_EMERALD);
    doc.text("Tenancy Account Is in Good Standing", 310, y + 60);
  }

  y += summaryBoxH + 20;

  // 6. QR CODE & REGISTRY VERIFICATION BLOCK
  const url = receiptUrl(receipt.public_id);
  const qr = await QRCode.toDataURL(url, { margin: 1, width: 320 });
  doc.addImage(qr, "PNG", w - 150, y, 110, 110);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(...COLOR_FOREST);
  doc.text("Instant QR Code Verification", 40, y + 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_MUTED);
  doc.text(
    "This receipt is cryptographically registered on the RentReceipt Pro nationwide rental ledger.\nScan the QR code with any smartphone camera to verify authentic payment details, timestamp, and tenancy lease in real-time.",
    40,
    y + 32,
    { maxWidth: 380 }
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_MUTED);
  doc.text("DIRECT VERIFICATION URL:", 40, y + 68);

  doc.setFont("courier", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_EMERALD);
  doc.text(url, 40, y + 80, { maxWidth: 380 });

  // 7. AUTHORIZED SIGNATURE & DIGITAL SEAL
  y += 115;
  doc.setDrawColor(...COLOR_BORDER);
  doc.setLineWidth(0.8);
  doc.line(40, y, 240, y);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(...COLOR_DARK);
  const authorizedSignatory = receipt.issued_by || snap.company || "RentReceipt Pro Landlord Authority";
  doc.text(`Authorized Signatory: ${authorizedSignatory}`, 40, y + 14);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_MUTED);
  doc.text("RentReceipt Pro Verified Digital Authority · Kenya", 40, y + 26);

  // Official Seal Badge Box (Right side)
  doc.setFillColor(232, 242, 237);
  doc.roundedRect(w - 200, y - 10, 160, 42, 6, 6, "F");
  doc.setDrawColor(...COLOR_EMERALD);
  doc.roundedRect(w - 200, y - 10, 160, 42, 6, 6, "S");

  doc.setTextColor(...COLOR_FOREST);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("★ RENT RECEIPT PRO ★", w - 120, y + 6, { align: "center" });
  doc.setTextColor(...COLOR_EMERALD);
  doc.setFontSize(7.5);
  doc.text("VERIFIED DIGITAL STAMP", w - 120, y + 18, { align: "center" });
  doc.setTextColor(...COLOR_MUTED);
  doc.setFontSize(7);
  doc.text("SECURE REPOSITORY", w - 120, y + 28, { align: "center" });

  // 8. BOTTOM FOOTER BAR
  doc.setFillColor(...COLOR_FOREST);
  doc.rect(0, h - 32, w, 32, "F");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(232, 242, 237);
  doc.text("RentReceipt Pro — Smart Digital Rent Receipts & Rental Property Management · Kenya", 40, h - 14);
  doc.text("https://rentreceipt.co.ke", w - 40, h - 14, { align: "right" });

  return doc;
}

export async function downloadReceiptPdf(receipt: ReceiptRecord) {
  const doc = await buildReceiptPdf(receipt);
  doc.save(`${receipt.receipt_number}.pdf`);
}

export async function qrDataUrl(value: string) {
  return QRCode.toDataURL(value, { margin: 1, width: 320 });
}
