import jsPDF from "jspdf";

/**
 * RentReceipt Pro — Official Comprehensive Landlord & Operations Manual PDF Generator
 */
export async function downloadLandlordManualPdf(): Promise<void> {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const w = doc.internal.pageSize.getWidth(); // 595.28 pt
  const h = doc.internal.pageSize.getHeight(); // 841.89 pt
  const margin = 40;
  const contentWidth = w - margin * 2;

  let currentPage = 1;
  const totalPages = 6;

  // Colors
  const PRIMARY_DARK: [number, number, number] = [8, 116, 67]; // #087443 Deep Emerald
  const SECONDARY_DARK: [number, number, number] = [11, 18, 32]; // #0B1220 Deep Navy
  const GOLD: [number, number, number] = [201, 162, 39]; // #C9A227 Gold
  const TEXT_MAIN: [number, number, number] = [30, 41, 59]; // Slate 800
  const TEXT_MUTED: [number, number, number] = [100, 116, 139]; // Slate 500
  const BG_LIGHT: [number, number, number] = [248, 250, 252]; // Slate 50
  const BORDER_COLOR: [number, number, number] = [226, 232, 240];

  function drawHeader(title: string) {
    // Header Bar
    doc.setFillColor(SECONDARY_DARK[0], SECONDARY_DARK[1], SECONDARY_DARK[2]);
    doc.rect(0, 0, w, 55, "F");

    // Emerald accent line
    doc.setFillColor(PRIMARY_DARK[0], PRIMARY_DARK[1], PRIMARY_DARK[2]);
    doc.rect(0, 55, w, 3, "F");

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("RENTRECEIPT PRO", margin, 28);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
    doc.text("OFFICIAL LANDLORD & OPERATIONS MANUAL", margin, 42);

    if (title) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text(title.toUpperCase(), w - margin, 35, { align: "right" });
    }
  }

  function drawFooter(page: number, total: number) {
    // Footer line
    doc.setDrawColor(BORDER_COLOR[0], BORDER_COLOR[1], BORDER_COLOR[2]);
    doc.setLineWidth(1);
    doc.line(margin, h - 35, w - margin, h - 35);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.text("© 2026 RentReceipt Pro · Codevanta Ventures · www.rentreceipt.co.ke", margin, h - 22);
    doc.text(`Page ${page} of ${total}`, w - margin, h - 22, { align: "right" });
  }

  function addSectionHeader(y: number, chapter: string, title: string): number {
    doc.setFillColor(BG_LIGHT[0], BG_LIGHT[1], BG_LIGHT[2]);
    doc.roundedRect(margin, y, contentWidth, 26, 4, 4, "F");

    doc.setDrawColor(PRIMARY_DARK[0], PRIMARY_DARK[1], PRIMARY_DARK[2]);
    doc.setLineWidth(2.5);
    doc.line(margin, y, margin, y + 26);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(PRIMARY_DARK[0], PRIMARY_DARK[1], PRIMARY_DARK[2]);
    doc.text(chapter.toUpperCase(), margin + 10, y + 16);

    doc.setTextColor(TEXT_MAIN[0], TEXT_MAIN[1], TEXT_MAIN[2]);
    doc.setFontSize(11);
    doc.text(title, margin + 85, y + 16);

    return y + 36;
  }

  function addParagraph(y: number, text: string, fontSize = 9, isBold = false): number {
    doc.setFont("helvetica", isBold ? "bold" : "normal");
    doc.setFontSize(fontSize);
    doc.setTextColor(isBold ? TEXT_MAIN[0] : TEXT_MUTED[0], isBold ? TEXT_MAIN[1] : TEXT_MUTED[1], isBold ? TEXT_MAIN[2] : TEXT_MUTED[2]);
    const lines = doc.splitTextToSize(text, contentWidth);
    doc.text(lines, margin, y);
    return y + lines.length * (fontSize + 3.5);
  }

  function addBullet(y: number, title: string, description: string): number {
    doc.setFillColor(PRIMARY_DARK[0], PRIMARY_DARK[1], PRIMARY_DARK[2]);
    doc.circle(margin + 5, y - 3, 2.5, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(TEXT_MAIN[0], TEXT_MAIN[1], TEXT_MAIN[2]);
    doc.text(title, margin + 14, y);

    const titleWidth = doc.getTextWidth(title);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);

    const lines = doc.splitTextToSize(description, contentWidth - 14 - titleWidth - 6);
    if (lines.length === 1) {
      doc.text(description, margin + 14 + titleWidth + 6, y);
      return y + 14;
    } else {
      const fullLines = doc.splitTextToSize(description, contentWidth - 14);
      doc.text(fullLines, margin + 14, y + 11);
      return y + 11 + fullLines.length * 11;
    }
  }

  function addTipBox(y: number, tipText: string): number {
    doc.setFillColor(236, 253, 245); // Emerald 50
    doc.setDrawColor(167, 243, 208); // Emerald 200
    doc.setLineWidth(1);

    const splitTip = doc.splitTextToSize(tipText, contentWidth - 24);
    const boxHeight = splitTip.length * 11 + 16;
    doc.roundedRect(margin, y, contentWidth, boxHeight, 4, 4, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(PRIMARY_DARK[0], PRIMARY_DARK[1], PRIMARY_DARK[2]);
    doc.text("💡 PRO TIP:", margin + 10, y + 13);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(4, 120, 87);
    doc.text(splitTip, margin + 65, y + 13);

    return y + boxHeight + 12;
  }

  // ==========================================
  // PAGE 1: COVER & SYSTEM OVERVIEW
  // ==========================================
  // Hero Cover Background Banner
  doc.setFillColor(SECONDARY_DARK[0], SECONDARY_DARK[1], SECONDARY_DARK[2]);
  doc.rect(0, 0, w, 190, "F");
  doc.setFillColor(PRIMARY_DARK[0], PRIMARY_DARK[1], PRIMARY_DARK[2]);
  doc.rect(0, 190, w, 5, "F");

  // Cover Titles
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text("RENTRECEIPT PRO", margin, 70);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
  doc.text("Comprehensive Landlord & Operations Manual", margin, 95);

  doc.setFontSize(9.5);
  doc.setTextColor(203, 213, 225);
  doc.text("Complete guide to managing rentals, automating M-Pesa payments, issuing QR receipts, and filing KRA taxes.", margin, 120);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text("Edition: 2026 Production Release · For Landlords, Property Managers & Caretakers", margin, 160);

  let y = 220;

  y = addSectionHeader(y, "Section 1", "Getting Started & Core Architecture");
  y = addParagraph(y, "RentReceipt Pro is an institutional-grade property management SaaS designed for Kenyan real estate. The platform streamlines tenant onboarding, automated Lipa Na M-Pesa Daraja STK Push collections, digital QR-verified receipts, caretaker delegations, and KRA 7.5% Monthly Rental Income (MRI) tax compliance.");

  y = addBullet(y, "Supported Property Types:", "Apartments, commercial complexes, single-family units, hostels, bedsitters, and mixed-use estates.");
  y = addBullet(y, "Role-Based Access:", "Landlord (Full owner control), Caretaker (Staff collection/receipting), Tenant (Self-service billing & receipts), and Admin.");
  y = addBullet(y, "Zero App Downloads Required:", "Tenants and landlords access full web and mobile interfaces instantly with responsive PWA support.");

  y += 6;
  y = addSectionHeader(y, "Section 2", "Setting Up Properties & Units");
  y = addParagraph(y, "Before adding tenants or payments, organize your real estate portfolio into Properties and Units:");
  y = addBullet(y, "1. Create Property:", "Navigate to Properties -> Click '+ New Property'. Enter the property name, location, and a unique 4-8 character Property Code (e.g. 'HAVEN01'). This code is used by tenants for instant portal access.");
  y = addBullet(y, "2. Add Individual Units:", "Click into the property -> Add Units. Specify Unit Number (e.g., 'A1', 'Flat 4'), Floor, Number of Bedrooms, and default monthly Rent Amount.");
  y = addBullet(y, "3. Set Deposit Requirements:", "Configure standard security deposit terms and utility deposits per unit.");

  y += 4;
  y = addTipBox(y, "Property codes should be short, memorable, and unique (e.g. 'KILIMA1'). Tenants enter this code along with their room number to view their portal without remembering passwords.");

  drawFooter(currentPage, totalPages);

  // ==========================================
  // PAGE 2: AI BULK IMPORTER & TENANT ONBOARDING
  // ==========================================
  doc.addPage();
  currentPage = 2;
  drawHeader("Property Setup & Tenant Management");
  y = 75;

  y = addSectionHeader(y, "Section 3", "AI Bulk Unit Importer (Instant Onboarding)");
  y = addParagraph(y, "If you manage multiple properties or have an existing rent roll in Excel, WhatsApp messages, or handwritten notes, the AI Bulk Importer parses and imports your entire inventory in seconds:");
  y = addBullet(y, "How to use:", "Navigate to Admin Portal -> AI Bulk Importer tab (or click '✨ AI Bulk Import' in your portfolio).");
  y = addBullet(y, "Paste Any Format:", "Paste raw text like 'House 1: John Doe 0712345678 rent 15000, House 2: Mary 0722000000 rent 20000'.");
  y = addBullet(y, "Deterministic Matching:", "The AI parses names, phone numbers, room labels, and rent amounts. You review the structured preview table before committing changes to the database.");

  y += 8;
  y = addSectionHeader(y, "Section 4", "Tenant Onboarding & Management");
  y = addParagraph(y, "Tenants can be assigned to vacant units with full contact, occupation, and financial history:");
  y = addBullet(y, "Adding a Tenant:", "Go to Tenants -> Click '+ Add Tenant'. Select the property and unit, then input tenant full name, Kenyan mobile phone number (e.g. 07XXXXXXXX), email, and lease start date.");
  y = addBullet(y, "Rent & Deposit Setup:", "Set the agreed monthly rent and record any security deposit already paid. The system automatically tracks deposit balances.");
  y = addBullet(y, "Lease Expiry Tracking:", "Set lease duration to receive automated renewal reminders 30 days prior to contract termination.");

  y += 8;
  y = addSectionHeader(y, "Section 5", "Tenant Self-Service Portal Access");
  y = addParagraph(y, "Tenants enjoy a passwordless, frictionless self-service portal accessible 24/7 at www.rentreceipt.co.ke/tenant:");
  y = addBullet(y, "How Tenants Sign In:", "1. Enter Property Code (e.g. 'HAVEN01') -> 2. Enter Unit/Room Number -> 3. Enter Phone Number.");
  y = addBullet(y, "Portal Features:", "View current monthly balance, click '⚡ Pay with M-Pesa' for instant PIN prompts, download official PDF receipts, and submit maintenance tickets.");

  drawFooter(currentPage, totalPages);

  // ==========================================
  // PAGE 3: AUTOMATED M-PESA DARAJA STK PUSH
  // ==========================================
  doc.addPage();
  currentPage = 3;
  drawHeader("M-Pesa Daraja STK Push System");
  y = 75;

  y = addSectionHeader(y, "Section 6", "Lipa Na M-Pesa Online STK Push Setup");
  y = addParagraph(y, "RentReceipt Pro supports direct multi-landlord M-Pesa Daraja integration. Payments triggered by tenants go directly into the landlord's own Paybill or Till number without intermediary escrow delays.");

  y = addBullet(y, "1. Obtain Daraja API Credentials:", "Visit developer.safaricom.co.ke -> Create a Free Developer Account -> Create an App -> Select 'Lipa Na M-Pesa'. Safaricom will grant you a Consumer Key and Consumer Secret.");
  y = addBullet(y, "2. Configure in Landlord Settings:", "Navigate to Settings -> 'M-Pesa Online Collection (Daraja STK Push)'. Input your Business Shortcode (Paybill or Till), Consumer Key, Consumer Secret, and Passkey.");
  y = addBullet(y, "3. Select Environment:", "Choose 'Sandbox' for development test runs, or 'Production' for live payments.");
  y = addBullet(y, "4. 1-Click Sandbox Auto-Fill:", "For instant testing, click 'Auto-fill Sandbox Defaults'. This pre-populates the official Safaricom test shortcode (174379) and sandbox passkey.");
  y = addBullet(y, "5. Test Connection:", "Click 'Test Daraja Connection'. The system executes a secure OAuth ping to verify authentication with Safaricom.");

  y += 6;
  y = addSectionHeader(y, "Section 7", "Tenant STK Push Payment Flow");
  y = addBullet(y, "Step 1 (Tenant Request):", "Tenant opens their portal, reviews their outstanding balance, and clicks 'Pay with M-Pesa'.");
  y = addBullet(y, "Step 2 (PIN Prompt):", "RentReceipt Pro sends an instant STK Push to the tenant's phone. A prompt appears asking for their M-Pesa PIN.");
  y = addBullet(y, "Step 3 (Settlement):", "Tenant enters PIN. Funds transfer to the landlord's account. Safaricom sends a verified webhook callback to RentReceipt.");
  y = addBullet(y, "Step 4 (Instant Receipt):", "The tenant's balance updates in real-time, an official QR-verified PDF receipt is generated, and the landlord receives a notification.");

  y += 4;
  y = addTipBox(y, "Landlords can turn the M-Pesa STK Push feature ON or OFF at any time in Settings. When turned OFF, the M-Pesa payment button is hidden from the tenant portal.");

  drawFooter(currentPage, totalPages);

  // ==========================================
  // PAGE 4: RECEIPTS, INVOICING & CARETAKERS
  // ==========================================
  doc.addPage();
  currentPage = 4;
  drawHeader("Receipts, Invoicing & Caretakers");
  y = 75;

  y = addSectionHeader(y, "Section 8", "Official QR-Verified Digital Receipts");
  y = addParagraph(y, "Every payment recorded (whether via automated M-Pesa STK Push or manual cash/bank entry) generates an institutional digital receipt:");
  y = addBullet(y, "Tamper-Proof QR Code:", "Each receipt has a unique public verification URL (e.g. rentreceipt.co.ke/receipt/RCP-XXXXXX). Anyone scanning the QR code sees authentic live proof of payment.");
  y = addBullet(y, "PDF Generation & Thermal Printing:", "Download receipts as full-color high-resolution PDFs or print via Bluetooth/USB 58mm & 80mm ESC/POS thermal receipt printers.");
  y = addBullet(y, "Multi-Channel Dispatch:", "Share receipts instantly with tenants via SMS, WhatsApp, or Email directly from the landlord portal.");

  y += 8;
  y = addSectionHeader(y, "Section 9", "Caretaker & Staff Delegation");
  y = addParagraph(y, "Empower on-site property caretakers, building managers, or agents without compromising full landlord account control:");
  y = addBullet(y, "Adding a Caretaker:", "Navigate to Caretakers -> Click '+ Invite Caretaker'. Assign them to specific properties.");
  y = addBullet(y, "Caretaker Permissions:", "Caretakers can log rent collections, record meter readings, inspect tenant lists, and mark maintenance tickets as resolved.");
  y = addBullet(y, "Restricted Visibility:", "Caretakers CANNOT edit landlord banking/M-Pesa API credentials, alter subscription plans, or delete property records.");

  y += 8;
  y = addSectionHeader(y, "Section 10", "Maintenance & Repairs Workflow");
  y = addParagraph(y, "Tenants can report property issues directly from their portal (e.g., plumbing leaks, electrical faults, roof damage):");
  y = addBullet(y, "Real-time Tracking:", "Tickets are categorized by priority (Urgent, Medium, Low) and assigned to maintenance staff.");
  y = addBullet(y, "Cost Logging:", "Log repair expenses directly against the property to factor them into your net profit and loss statements.");

  drawFooter(currentPage, totalPages);

  // ==========================================
  // PAGE 5: FINANCIAL ANALYTICS & TAX COMPLIANCE
  // ==========================================
  doc.addPage();
  currentPage = 5;
  drawHeader("Financial Analytics & KRA Tax Reports");
  y = 75;

  y = addSectionHeader(y, "Section 11", "Financial Reports & P&L Statements");
  y = addParagraph(y, "Gain 100% visibility into your rental revenue, occupancy rates, and cash collection efficiency:");
  y = addBullet(y, "Monthly Revenue Breakdown:", "View total rent billed, total collected, outstanding arrears, and collection efficiency percentages.");
  y = addBullet(y, "Occupancy & Vacancy Rates:", "Monitor occupied vs. vacant units across individual buildings or your overall portfolio.");
  y = addBullet(y, "Exportable Ledgers:", "Download complete payment logs, tenant statement summaries, and expense ledgers in CSV and PDF formats for your accountant.");

  y += 8;
  y = addSectionHeader(y, "Section 12", "KRA 7.5% Monthly Rental Income (MRI) Tax");
  y = addParagraph(y, "Under Kenyan tax law (Section 6A of the Income Tax Act), residential rental income between KSh 288,000 and KSh 15,000,000 per annum is subject to 7.5% Monthly Rental Income (MRI) tax:");
  y = addBullet(y, "Automated Calculation:", "RentReceipt Pro automatically aggregates gross rent collected per calendar month and computes the exact 7.5% KRA liability.");
  y = addBullet(y, "KRA Filing Readiness:", "Export the monthly tax report showing Gross Rent, Allowable Thresholds, and Calculated MRI Tax ready for submission on the KRA iTax portal by the 20th of every month.");

  y += 8;
  y = addSectionHeader(y, "Section 13", "Affiliate Partner Program");
  y = addParagraph(y, "Earn recurring passive income by referring other landlords, property managers, and SACCOs:");
  y = addBullet(y, "Join Free:", "Click 'Affiliate Program' in the portal footer or visit www.rentreceipt.co.ke/affiliate.");
  y = addBullet(y, "Commission:", "Earn up to 20% commission on all subscription payments made by landlords who sign up using your referral link.");
  y = addBullet(y, "Instant M-Pesa Payouts:", "Request withdrawals directly to your Safaricom M-Pesa number upon reaching the minimum payout threshold.");

  drawFooter(currentPage, totalPages);

  // ==========================================
  // PAGE 6: SECURITY, VAULT & SUPPORT CONTACT
  // ==========================================
  doc.addPage();
  currentPage = 6;
  drawHeader("Security Architecture & Support");
  y = 75;

  y = addSectionHeader(y, "Section 14", "Security Architecture & Data Vault");
  y = addParagraph(y, "RentReceipt Pro employs banking-grade security and strict data isolation across every layer:");
  y = addBullet(y, "AES-256-GCM Encryption:", "All Safaricom Daraja credentials (Consumer Secrets and Passkeys) are encrypted at rest using military-grade AES-256-GCM.");
  y = addBullet(y, "Least-Privilege Database Access:", "Direct client PostgREST access to credentials is completely revoked. Secrets can only be decrypted in server memory during live payment execution.");
  y = addBullet(y, "Idempotent Webhooks:", "Safaricom callback processing is protected by database concurrency locks to eliminate duplicate payment crediting.");
  y = addBullet(y, "Automated Cloud Backups:", "All rental ledgers and receipt snapshots are replicated across multiple geographic cloud zones.");

  y += 10;
  y = addSectionHeader(y, "Section 15", "Customer Support & Concierge Assistance");
  y = addParagraph(y, "Need help onboarding a large property portfolio or setting up custom Daraja Paybill shortcodes? Our dedicated support team is available 24/7:");

  // Contact Info Box
  doc.setFillColor(BG_LIGHT[0], BG_LIGHT[1], BG_LIGHT[2]);
  doc.setDrawColor(BORDER_COLOR[0], BORDER_COLOR[1], BORDER_COLOR[2]);
  doc.roundedRect(margin, y, contentWidth, 90, 6, 6, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(PRIMARY_DARK[0], PRIMARY_DARK[1], PRIMARY_DARK[2]);
  doc.text("RENTRECEIPT PRO HELP & CONCIERGE DESK", margin + 15, y + 22);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(TEXT_MAIN[0], TEXT_MAIN[1], TEXT_MAIN[2]);
  doc.text("• Official Website: https://www.rentreceipt.co.ke", margin + 15, y + 40);
  doc.text("• Technical Support Email: support@rentreceipt.co.ke", margin + 15, y + 54);
  doc.text("• Direct Helpline & WhatsApp: +254 700 000 000 / +254 711 000 000", margin + 15, y + 68);
  doc.text("• Operating Hours: 24/7 Dedicated Kenyan PropTech Support", margin + 15, y + 82);

  y += 105;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(SECONDARY_DARK[0], SECONDARY_DARK[1], SECONDARY_DARK[2]);
  doc.text("Thank you for choosing RentReceipt Pro.", margin, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
  doc.text("Managing rentals. Tracking every payment. Sending professional receipts.", margin, y + 14);

  drawFooter(currentPage, totalPages);

  // Save / Trigger Download
  doc.save("RentReceipt_Pro_Landlord_Operations_Manual_2026.pdf");
}
