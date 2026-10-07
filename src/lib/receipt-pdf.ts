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

  // Official Brand Palette: Deep Forest Green, Rich Emerald, Champagne Gold, Dark Slate
  const COLOR_FOREST = [6, 59, 42] as const;
  const COLOR_EMERALD = [8, 116, 67] as const;
  const COLOR_GOLD = [201, 162, 39] as const;
  const COLOR_DARK = [16, 23, 20] as const;
  const COLOR_MUTED = [100, 116, 139] as const;
  const COLOR_BORDER = [226, 232, 240] as const;
  const COLOR_CARD_BG = [248, 250, 248] as const;

  // 1. TOP HEADER BANNER (h: 115pt)
  doc.setFillColor(...COLOR_FOREST);
  doc.rect(0, 0, w, 115, "F");

  // Champagne Gold Accent Line (h: 4pt)
  doc.setFillColor(...COLOR_GOLD);
  doc.rect(0, 115, w, 4, "F");

  // Company Name - Dynamic Font Scaling to guarantee no overlap with right badge
  const companyName = snap.company && snap.company.trim() ? snap.company.trim() : "RENT RECEIPT PRO";
  const maxCompanyW = w - 215; // leaves 175pt margin for right badge
  let compSize = 18;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(compSize);
  while (doc.getTextWidth(companyName) > maxCompanyW && compSize > 11) {
    compSize -= 1;
    doc.setFontSize(compSize);
  }
  doc.setTextColor(255, 255, 255);
  doc.text(companyName, 40, 46, { maxWidth: maxCompanyW });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(232, 242, 237);
  doc.text("OFFICIAL VERIFIED DIGITAL RENT RECEIPT", 40, 66, { maxWidth: maxCompanyW });

  doc.setFontSize(8);
  doc.setTextColor(203, 220, 212);
  const contactText = snap.company_phone
    ? `Tel: ${snap.company_phone} | Verified Property System`
    : "Nationwide Digital Tenancy Registry | Kenya";
  doc.text(contactText, 40, 82, { maxWidth: maxCompanyW });

  // Right Header: Receipt Number Badge & Date
  const badgeW = 140;
  const badgeX = w - 40 - badgeW;
  doc.setFillColor(...COLOR_EMERALD);
  doc.roundedRect(badgeX, 26, badgeW, 26, 5, 5, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.text(receipt.receipt_number, badgeX + badgeW / 2, 43, { align: "center", maxWidth: badgeW - 10 });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(232, 242, 237);
  const issuedDate = new Date(receipt.issued_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  doc.text(`Issued: ${issuedDate}`, w - 40, 70, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_GOLD);
  doc.text("STATUS: VERIFIED & PAID", w - 40, 86, { align: "right" });

  // 2. VERIFICATION STAMP RIBBON (Clean ASCII, balanced spacing)
  doc.setFillColor(232, 242, 237);
  doc.roundedRect(40, 130, w - 80, 24, 5, 5, "F");
  doc.setDrawColor(...COLOR_EMERALD);
  doc.setLineWidth(0.8);
  doc.roundedRect(40, 130, w - 80, 24, 5, 5, "S");

  doc.setTextColor(...COLOR_FOREST);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("[VERIFIED] OFFICIAL DIGITAL STAMP | REGISTRY SIGNED & SECURED", 52, 145);

  doc.setTextColor(...COLOR_MUTED);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("KENYA TENANCY COMPLIANT", w - 52, 145, { align: "right" });

  // 3. KEY TENANCY & PROPERTY DETAILS CARDS (Two Columns)
  let y = 166;
  const cardW = (w - 80 - 16) / 2;
  const cardH = 88;
  const col2X = 40 + cardW + 16;
  const innerCardW = cardW - 24;

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
  doc.setFontSize(7.5);
  doc.text("PROPERTY NAME", 54, y + 33);
  doc.setTextColor(...COLOR_DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(snap.property ?? "-", 54, y + 46, { maxWidth: innerCardW });

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLOR_MUTED);
  doc.setFontSize(7.5);
  doc.text("UNIT / ROOM NUMBER", 54, y + 62);
  doc.setTextColor(...COLOR_DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  const unitText = `Unit ${snap.unit ?? "-"}${snap.room ? ` | Room ${snap.room}` : ""}`;
  doc.text(unitText, 54, y + 75, { maxWidth: innerCardW });

  // Right Card: Tenant & Payment Record
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
  doc.setFontSize(7.5);
  doc.text("TENANT FULL NAME", col2X + 14, y + 33);
  doc.setTextColor(...COLOR_DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(snap.tenant_name ?? "-", col2X + 14, y + 46, { maxWidth: innerCardW });

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLOR_MUTED);
  doc.setFontSize(7.5);
  doc.text("PHONE / BILLING PERIOD", col2X + 14, y + 62);
  doc.setTextColor(...COLOR_DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  const tenantPhoneAndPeriod = `${snap.tenant_phone ?? "-"} | Period: ${snap.period ?? "-"}`;
  doc.text(tenantPhoneAndPeriod, col2X + 14, y + 75, { maxWidth: innerCardW });

  y += cardH + 16;

  // 4. ACCOUNTING & FIFO ARREARS BREAKDOWN TABLE (Clean 3-Column Layout)
  // Column 1: Description (x=52, width ~265pt)
  // Column 2: Allocation Category / Status (x=330, width ~120pt)
  // Column 3: Amount (Right aligned at w - 52)
  doc.setFillColor(...COLOR_FOREST);
  doc.roundedRect(40, y, w - 80, 24, 5, 5, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("LINE ITEM / DESCRIPTION", 52, y + 16);
  doc.text("ALLOCATION / STATUS", 330, y + 16);
  doc.text("AMOUNT", w - 52, y + 16, { align: "right" });

  y += 24;

  const renderTableRow = (
    label: string,
    statusText: string,
    amountText: string,
    isSubItem = false,
    isBold = false,
    customColor?: readonly [number, number, number]
  ) => {
    doc.setDrawColor(...COLOR_BORDER);
    doc.line(40, y + 22, w - 40, y + 22);

    doc.setFont("helvetica", isBold ? "bold" : "normal");
    doc.setFontSize(isSubItem ? 8.5 : 9);
    doc.setTextColor(...(customColor ?? (isBold ? COLOR_DARK : COLOR_DARK)));
    doc.text(label, isSubItem ? 62 : 52, y + 15, { maxWidth: isSubItem ? 255 : 265 });

    doc.setFont("helvetica", isBold ? "bold" : "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...(customColor ?? (isSubItem ? COLOR_EMERALD : COLOR_MUTED)));
    doc.text(statusText, 330, y + 15, { maxWidth: 125 });

    doc.setFont("helvetica", isBold ? "bold" : "normal");
    doc.setFontSize(9);
    doc.setTextColor(...(customColor ?? (isBold ? COLOR_DARK : COLOR_DARK)));
    doc.text(amountText, w - 52, y + 15, { align: "right" });

    y += 24;
  };

  if (priorArrears > 0) {
    renderTableRow(
      "1. Prior Outstanding Arrears",
      "Arrears Brought Forward",
      `${currency} ${priorArrears.toLocaleString()}`,
      false,
      true,
      [185, 28, 28]
    );

    renderTableRow(
      `2. Current Month Rent Due (${snap.period ?? "Current"})`,
      "Contracted Rent",
      `${currency} ${rentAmount.toLocaleString()}`,
      false,
      true
    );

    renderTableRow(
      `3. Payment Received (${(snap.method ?? "M-PESA").toUpperCase()}${snap.reference ? ` Ref: ${snap.reference}` : ""})`,
      "Confirmed Payment",
      `${currency} ${totalPaid.toLocaleString()}`,
      false,
      true,
      COLOR_EMERALD
    );

    renderTableRow(
      "   - Deducted to Clear Prior Arrears",
      "Arrears Cleared [PAID]",
      `-${currency} ${amountToArrears.toLocaleString()}`,
      true,
      false,
      COLOR_EMERALD
    );

    renderTableRow(
      "   - Applied to Current Month Rent",
      amountToRent >= rentAmount ? "Rent Settled [PAID]" : "Partial Rent Applied",
      `-${currency} ${amountToRent.toLocaleString()}`,
      true,
      false,
      COLOR_EMERALD
    );
  } else {
    renderTableRow(
      `1. Current Month Rent Due (${snap.period ?? "Current"})`,
      "Contracted Rent",
      `${currency} ${rentAmount.toLocaleString()}`,
      false,
      true
    );

    renderTableRow(
      `2. Payment Received (${(snap.method ?? "M-PESA").toUpperCase()}${snap.reference ? ` Ref: ${snap.reference}` : ""})`,
      "Confirmed Payment",
      `${currency} ${totalPaid.toLocaleString()}`,
      false,
      true,
      COLOR_EMERALD
    );

    renderTableRow(
      "   - Applied Directly to Rent",
      totalPaid >= rentAmount ? "Paid in Full [PAID]" : "Partial Payment Applied",
      `${currency} ${totalPaid.toLocaleString()}`,
      true,
      false,
      COLOR_EMERALD
    );
  }

  y += 12;

  // 5. FINANCIAL TOTALS SUMMARY BOX (Spacious 2-column layout)
  const summaryBoxH = 68;
  doc.setFillColor(...COLOR_CARD_BG);
  doc.roundedRect(40, y, w - 80, summaryBoxH, 8, 8, "F");
  doc.setDrawColor(...COLOR_BORDER);
  doc.roundedRect(40, y, w - 80, summaryBoxH, 8, 8, "S");

  // Left Column: Total Amount Received
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_MUTED);
  doc.text("TOTAL AMOUNT RECEIVED", 56, y + 20);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...COLOR_FOREST);
  doc.text(`${currency} ${totalPaid.toLocaleString()}`, 56, y + 45, { maxWidth: 230 });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_MUTED);
  doc.text(`Method: ${(snap.method ?? "M-PESA").toUpperCase()}${snap.reference ? ` | Ref: ${snap.reference}` : ""}`, 56, y + 59, { maxWidth: 230 });

  // Right Column: Net Outstanding Balance
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_MUTED);
  doc.text("NET OUTSTANDING BALANCE", 320, y + 20);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  if (bal > 0) {
    doc.setTextColor(220, 38, 38);
    doc.text(`${currency} ${bal.toLocaleString()}`, 320, y + 45, { maxWidth: 230 });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(220, 38, 38);
    doc.text("Pending Balance Awaiting Settlement", 320, y + 59, { maxWidth: 230 });
  } else {
    doc.setTextColor(...COLOR_EMERALD);
    doc.text("KSh 0.00 (Settled)", 320, y + 45, { maxWidth: 230 });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...COLOR_EMERALD);
    doc.text("Account is in Good Standing", 320, y + 59, { maxWidth: 230 });
  }

  y += summaryBoxH + 18;

  // 6. QR CODE & VERIFICATION BLOCK
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
    "This receipt is digitally signed and cryptographically registered on the RentReceipt Pro nationwide rental ledger.\nScan with any camera to verify payment details, timestamp, and tenancy lease in real-time.",
    40,
    y + 32,
    { maxWidth: 360 }
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_MUTED);
  doc.text("DIRECT VERIFICATION URL:", 40, y + 68);

  doc.setFont("courier", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_EMERALD);
  doc.text(url, 40, y + 80, { maxWidth: 360 });

  // 7. AUTHORIZED SIGNATURE & DIGITAL SEAL
  y += 115;
  doc.setDrawColor(...COLOR_BORDER);
  doc.setLineWidth(0.8);
  doc.line(40, y, 240, y);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...COLOR_DARK);
  const authorizedSignatory = receipt.issued_by || snap.company || "RentReceipt Pro Landlord Authority";
  doc.text(`Authorized Signatory: ${authorizedSignatory}`, 40, y + 14, { maxWidth: 240 });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_MUTED);
  doc.text("RentReceipt Pro Verified Digital Authority | Kenya", 40, y + 26, { maxWidth: 240 });

  // Official Seal Badge Box (Right side)
  doc.setFillColor(232, 242, 237);
  doc.roundedRect(w - 200, y - 10, 160, 42, 6, 6, "F");
  doc.setDrawColor(...COLOR_EMERALD);
  doc.roundedRect(w - 200, y - 10, 160, 42, 6, 6, "S");

  doc.setTextColor(...COLOR_FOREST);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("RENT RECEIPT PRO", w - 120, y + 6, { align: "center" });
  doc.setTextColor(...COLOR_EMERALD);
  doc.setFontSize(7.5);
  doc.text("OFFICIAL DIGITAL SEAL", w - 120, y + 17, { align: "center" });
  doc.setTextColor(...COLOR_MUTED);
  doc.setFontSize(7);
  doc.text("REGISTRY VERIFIED", w - 120, y + 27, { align: "center" });

  // 8. BOTTOM FOOTER BAR
  doc.setFillColor(...COLOR_FOREST);
  doc.rect(0, h - 32, w, 32, "F");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(232, 242, 237);
  doc.text("RentReceipt Pro — Smart Digital Rent Receipts & Rental Property Management | Kenya", 40, h - 14);
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
