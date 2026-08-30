import jsPDF from "jspdf";

/**
 * RentReceipt Pro — Official Comprehensive Landlord & Operations Manual PDF Generator (2026 Edition)
 * Formatted with strict ASCII character safety (no raw unicode/emojis) for 100% crisp jsPDF rendering.
 */
export async function downloadLandlordManualPdf(): Promise<void> {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const w = doc.internal.pageSize.getWidth(); // 595.28 pt
  const h = doc.internal.pageSize.getHeight(); // 841.89 pt
  const margin = 40;
  const contentWidth = w - margin * 2;

  let currentPage = 1;
  const totalPages = 6;

  // Strict tuple types for jsPDF RGB color arguments
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
    doc.text("OFFICIAL LANDLORD OPERATIONS MANUAL", margin, 42);

    if (title) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
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
    doc.text("RentReceipt Pro (c) 2026 Codevanta Ventures | www.rentreceipt.co.ke", margin, h - 22);
    doc.text(`Page ${page} of ${total}`, w - margin, h - 22, { align: "right" });
  }

  function addSectionHeader(y: number, sectionNumber: string, title: string): number {
    doc.setFillColor(BG_LIGHT[0], BG_LIGHT[1], BG_LIGHT[2]);
    doc.roundedRect(margin, y, contentWidth, 25, 4, 4, "F");

    doc.setDrawColor(PRIMARY_DARK[0], PRIMARY_DARK[1], PRIMARY_DARK[2]);
    doc.setLineWidth(2.5);
    doc.line(margin, y, margin, y + 25);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(PRIMARY_DARK[0], PRIMARY_DARK[1], PRIMARY_DARK[2]);
    doc.text(sectionNumber.toUpperCase(), margin + 10, y + 16);

    doc.setTextColor(TEXT_MAIN[0], TEXT_MAIN[1], TEXT_MAIN[2]);
    doc.setFontSize(10.5);
    doc.text(title, margin + 85, y + 16);

    return y + 34;
  }

  function addParagraph(y: number, text: string, fontSize = 8.5, isBold = false): number {
    doc.setFont("helvetica", isBold ? "bold" : "normal");
    doc.setFontSize(fontSize);
    doc.setTextColor(isBold ? TEXT_MAIN[0] : TEXT_MUTED[0], isBold ? TEXT_MAIN[1] : TEXT_MUTED[1], isBold ? TEXT_MAIN[2] : TEXT_MUTED[2]);
    const lines = doc.splitTextToSize(text, contentWidth);
    doc.text(lines, margin, y);
    return y + lines.length * (fontSize + 3.5);
  }

  function addBullet(y: number, title: string, description: string): number {
    doc.setFillColor(PRIMARY_DARK[0], PRIMARY_DARK[1], PRIMARY_DARK[2]);
    doc.circle(margin + 5, y - 3, 2, "F");

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
      return y + 13;
    } else {
      const fullLines = doc.splitTextToSize(description, contentWidth - 14);
      doc.text(fullLines, margin + 14, y + 11);
      return y + 11 + fullLines.length * 11;
    }
  }

  function addCalloutBox(y: number, tag: string, calloutText: string): number {
    doc.setFillColor(236, 253, 245); // Emerald 50
    doc.setDrawColor(167, 243, 208); // Emerald 200
    doc.setLineWidth(1);

    const splitText = doc.splitTextToSize(calloutText, contentWidth - 85);
    const boxHeight = Math.max(splitText.length * 10.5 + 14, 28);
    doc.roundedRect(margin, y, contentWidth, boxHeight, 4, 4, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(PRIMARY_DARK[0], PRIMARY_DARK[1], PRIMARY_DARK[2]);
    doc.text(tag.toUpperCase(), margin + 10, y + 13);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(4, 120, 87);
    doc.text(splitText, margin + 80, y + 13);

    return y + boxHeight + 10;
  }

  // ==========================================
  // PAGE 1: COVER & CORE PLATFORM SETUP
  // ==========================================
  // Hero Cover Background Banner
  doc.setFillColor(SECONDARY_DARK[0], SECONDARY_DARK[1], SECONDARY_DARK[2]);
  doc.rect(0, 0, w, 185, "F");
  doc.setFillColor(PRIMARY_DARK[0], PRIMARY_DARK[1], PRIMARY_DARK[2]);
  doc.rect(0, 185, w, 4, "F");

  // Cover Titles
  doc.setFont("helvetica", "bold");
  doc.setFontSize(23);
  doc.setTextColor(255, 255, 255);
  doc.text("RENTRECEIPT PRO", margin, 65);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12.5);
  doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
  doc.text("Landlord & Property Manager Operations Guide", margin, 88);

  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225);
  doc.text("Complete operational handbook for managing properties, units, tenants, automated M-Pesa collections, and digital receipts.", margin, 110);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text("Release: 2026 Production Edition | Applicable to Landlords, Property Managers & Caretakers", margin, 150);

  let y = 210;

  y = addSectionHeader(y, "Section 1", "Getting Started & System Overview");
  y = addParagraph(y, "RentReceipt Pro is an institutional-grade property management software designed for Kenyan real estate. The platform streamlines tenant records, automated Lipa Na M-Pesa Daraja STK Push collections, digital QR-verified receipts, caretaker delegations, maintenance requests, and KRA 7.5% Monthly Rental Income (MRI) tax compliance.");

  y = addBullet(y, "Supported Properties:", "Apartment complexes, commercial buildings, single-family residential units, hostels, bedsitters, and gated estates.");
  y = addBullet(y, "Role-Based Access:", "Landlord (Full owner control over finances & settings), Caretaker (On-site collection & maintenance), and Tenant (Self-service billing & receipts). Note: The Admin Portal (/admin) is strictly the platform operator's master console.");
  y = addBullet(y, "Zero App Downloads:", "Landlords and tenants access full web portals instantly with responsive PWA support on smartphones, tablets, and laptops.");

  y += 4;
  y = addSectionHeader(y, "Section 2", "Setting Up Properties & Units");
  y = addParagraph(y, "Before adding tenants or payments, organize your real estate portfolio into Properties and Units:");
  y = addBullet(y, "1. Create Property:", "Navigate to Properties -> Click '+ New Property'. Enter the property name, address, and a unique 4 to 8 character Property Code (e.g. 'KILIMA1' or 'HAVEN01').");
  y = addBullet(y, "2. Add Individual Units:", "Click into the property -> Add Units. Specify Unit Number (e.g., 'A1', 'Flat 4'), Room Number, Floor, Bedrooms, and default monthly Rent Amount.");
  y = addBullet(y, "3. Set Deposit Requirements:", "Configure standard security deposit terms and utility deposits per unit.");

  y += 4;
  y = addCalloutBox(y, "PRO TIP:", "Property codes should be short, memorable, and unique (e.g. 'KILIMA1'). Tenants enter this code along with their room number to view their portal without remembering passwords.");

  drawFooter(currentPage, totalPages);

  // ==========================================
  // PAGE 2: TENANT ONBOARDING & SELF-SERVICE PORTAL
  // ==========================================
  doc.addPage();
  currentPage = 2;
  drawHeader("Tenant Onboarding & Self-Service Portal");
  y = 75;

  y = addSectionHeader(y, "Section 3", "Tenant Onboarding & Management");
  y = addParagraph(y, "Tenants are enrolled in the landlord portal with contact details, unit assignment, and financial terms:");
  y = addBullet(y, "1. Add Tenant:", "Go to Tenants -> Click '+ Add Tenant'. Select the property and unit, then enter tenant full name, Kenyan mobile phone number (e.g. 07XXXXXXXX or 01XXXXXXXX), email, and lease start date.");
  y = addBullet(y, "2. Rent & Deposit Setup:", "Set the agreed monthly rent amount and record any initial security deposit already paid. The system automatically tracks deposit balances.");
  y = addBullet(y, "3. Lease Expiry Tracking:", "Set lease duration to receive automated renewal reminders 30 days prior to contract expiration.");

  y += 6;
  y = addSectionHeader(y, "Section 4", "Tenant Self-Service Portal Access");
  y = addParagraph(y, "Tenants enjoy a passwordless, frictionless self-service portal accessible 24/7 at www.rentreceipt.co.ke/tenant:");
  y = addBullet(y, "How Tenants Sign In:", "1. Enter Property Code (e.g. 'KILIMA1') -> 2. Enter Unit/Room Number (e.g. 'A1') -> 3. Enter Phone Number.");
  y = addBullet(y, "Live Balance Status:", "Tenants see their active month's rent status: PAID IN FULL (green), PARTIAL BALANCE DUE (amber), or UNPAID / DUE (rose).");
  y = addBullet(y, "Instant M-Pesa Payment:", "Tenants can click 'Pay with M-Pesa' to trigger an instant STK Push prompt on their phone (when enabled by the landlord).");
  y = addBullet(y, "Digital Receipt Vault:", "Tenants can view and download all past official QR-verified PDF receipts anytime.");
  y = addBullet(y, "Maintenance Requests:", "Tenants can report property issues (plumbing, electrical, structural) directly to the landlord or caretaker.");

  y += 4;
  y = addCalloutBox(y, "NOTE:", "Tenants do not need to register separate user accounts or remember complex passwords. The combination of Property Code, Unit/Room, and Mobile Phone provides instant, secure access.");

  drawFooter(currentPage, totalPages);

  // ==========================================
  // PAGE 3: AUTOMATED M-PESA DARAJA STK PUSH
  // ==========================================
  doc.addPage();
  currentPage = 3;
  drawHeader("Automated M-Pesa Daraja STK Push Setup");
  y = 75;

  y = addSectionHeader(y, "Section 5", "Lipa Na M-Pesa Daraja STK Push Integration");
  y = addParagraph(y, "RentReceipt Pro supports direct multi-landlord M-Pesa Daraja STK Push integration. Payments triggered by tenants go directly into the landlord's own Paybill or Buy Goods Till number without intermediary delays.");

  y = addBullet(y, "1. Obtain Daraja API Credentials:", "Visit developer.safaricom.co.ke -> Register a free developer account -> Create an App -> Enable 'Lipa Na M-Pesa'. Safaricom will generate your Consumer Key and Consumer Secret.");
  y = addBullet(y, "2. Configure in Landlord Settings:", "In the Landlord Portal, navigate to Settings -> 'M-Pesa Online Collection (Daraja STK Push)'. Input your Business Shortcode (Paybill or Till), Consumer Key, Consumer Secret, and Passkey.");
  y = addBullet(y, "3. Environment Selection:", "Choose 'Sandbox' for development testing, or 'Production' for live real-money collections.");
  y = addBullet(y, "4. 1-Click Sandbox Defaults:", "For instant testing, click 'Auto-fill Sandbox Defaults'. This pre-populates Safaricom's official test shortcode (174379) and test passkey.");
  y = addBullet(y, "5. Test Connection:", "Click 'Test Daraja Connection'. The system executes a secure OAuth handshake with Safaricom to verify that your API credentials are valid.");

  y += 6;
  y = addSectionHeader(y, "Section 6", "Landlord Active Toggle & Payment Lifecycle");
  y = addBullet(y, "Landlord Master Switch:", "Landlords can turn the M-Pesa STK Push feature ON or OFF at any time in Settings. When turned OFF, the M-Pesa payment banner is completely hidden from the tenant portal.");
  y = addBullet(y, "Step 1 (Tenant Request):", "Tenant opens portal, enters amount and phone number, and clicks 'Pay with M-Pesa'.");
  y = addBullet(y, "Step 2 (PIN Prompt):", "Safaricom sends an instant STK Push popup directly to the tenant's handset asking for their M-Pesa PIN.");
  y = addBullet(y, "Step 3 (Settlement):", "Tenant enters PIN. Funds transfer to the landlord's account. Daraja sends a signed webhook callback to RentReceipt Pro.");
  y = addBullet(y, "Step 4 (Instant Receipt):", "The tenant balance updates in real time, an official QR-verified PDF receipt is generated, and the payment is recorded in the ledger.");

  y += 4;
  y = addCalloutBox(y, "SECURITY:", "All Daraja secrets (Consumer Secret and Passkey) are stored with AES-256-GCM encryption at rest. Direct client database access is revoked; credentials are only decrypted in server memory during payment execution.");

  drawFooter(currentPage, totalPages);

  // ==========================================
  // PAGE 4: RECEIPTS, INVOICING & CARETAKERS
  // ==========================================
  doc.addPage();
  currentPage = 4;
  drawHeader("Digital Receipts, Invoicing & Caretakers");
  y = 75;

  y = addSectionHeader(y, "Section 7", "Official QR-Verified Digital Receipts");
  y = addParagraph(y, "Every payment recorded (automated M-Pesa STK Push or manual cash/bank entry) generates an institutional digital receipt:");
  y = addBullet(y, "Tamper-Proof QR Verification:", "Every receipt includes a unique public verification URL (e.g. rentreceipt.co.ke/receipt/RCP-XXXXXX). Scanning the QR code shows instant authentic proof of payment.");
  y = addBullet(y, "PDF Downloads & Thermal Printing:", "Download receipts as full-color high-resolution A4 PDFs or print directly using Bluetooth/USB 58mm & 80mm ESC/POS thermal receipt printers.");
  y = addBullet(y, "Multi-Channel Sharing:", "Send receipts to tenants in one click via SMS, WhatsApp, or Email directly from the landlord portal.");

  y += 6;
  y = addSectionHeader(y, "Section 8", "Caretaker & Staff Role Delegation");
  y = addParagraph(y, "Empower on-site property caretakers, building managers, or agents without compromising landlord account control:");
  y = addBullet(y, "Adding a Caretaker:", "Navigate to Caretakers -> Click '+ Invite Caretaker'. Assign them to specific properties.");
  y = addBullet(y, "Caretaker Permissions:", "Caretakers can log cash collections, record manual payments, inspect tenant room lists, and resolve maintenance tickets via the Caretaker Terminal (/caretaker).");
  y = addBullet(y, "Protected Boundary:", "Caretakers CANNOT edit landlord banking/M-Pesa API credentials, alter subscription billing, or delete property structures.");

  y += 6;
  y = addSectionHeader(y, "Section 9", "Maintenance & Repairs Workflow");
  y = addParagraph(y, "Tenants report property issues directly from their portal (Plumbing, Electrical, Structural, Security, etc.):");
  y = addBullet(y, "Priority Categorization:", "Tickets are assigned priority levels (Urgent, High, Medium, Low) and tracked from Open -> In Progress -> Resolved.");
  y = addBullet(y, "Expense Tracking:", "Log repair costs directly against the property to automatically reflect them in net profit and loss reports.");

  drawFooter(currentPage, totalPages);

  // ==========================================
  // PAGE 5: FINANCIAL ANALYTICS & TAX COMPLIANCE
  // ==========================================
  doc.addPage();
  currentPage = 5;
  drawHeader("Financial Analytics & KRA Tax Reports");
  y = 75;

  y = addSectionHeader(y, "Section 10", "Financial Reports & Revenue Ledgers");
  y = addParagraph(y, "Gain 100% visibility into your rental revenue, occupancy rates, and cash collection efficiency:");
  y = addBullet(y, "Monthly Revenue Breakdown:", "View total rent billed, total collected, outstanding arrears, and collection efficiency percentages.");
  y = addBullet(y, "Occupancy Analytics:", "Monitor occupied vs. vacant units across individual buildings or your overall portfolio.");
  y = addBullet(y, "Exportable Ledgers:", "Download complete payment logs, tenant statement summaries, and expense ledgers in CSV and PDF formats for your accountant.");

  y += 6;
  y = addSectionHeader(y, "Section 11", "KRA 7.5% Monthly Rental Income (MRI) Tax");
  y = addParagraph(y, "Under Kenyan tax law (Section 6A of the Income Tax Act), residential rental income between KSh 288,000 and KSh 15,000,000 per annum is subject to 7.5% Monthly Rental Income (MRI) tax:");
  y = addBullet(y, "Automated Calculation:", "RentReceipt Pro automatically aggregates gross rent collected per calendar month and calculates the exact 7.5% KRA liability.");
  y = addBullet(y, "KRA Filing Readiness:", "Export the monthly tax report showing Gross Rent, Allowable Thresholds, and Calculated MRI Tax ready for submission on the KRA iTax portal by the 20th of every month.");

  y += 6;
  y = addSectionHeader(y, "Section 12", "Affiliate Partner Program");
  y = addParagraph(y, "Earn recurring passive income by referring other landlords, property managers, and SACCOs:");
  y = addBullet(y, "Join Free:", "Click 'Affiliate Program' in the portal footer or visit www.rentreceipt.co.ke/affiliate-program.");
  y = addBullet(y, "Commission:", "Earn up to 20% commission on all subscription payments made by landlords who sign up using your referral link.");
  y = addBullet(y, "Instant M-Pesa Payouts:", "Request withdrawals directly to your Safaricom M-Pesa number upon reaching the minimum payout threshold.");

  drawFooter(currentPage, totalPages);

  // ==========================================
  // PAGE 6: SUBSCRIPTION PLANS & SUPPORT CONTACT
  // ==========================================
  doc.addPage();
  currentPage = 6;
  drawHeader("Subscription Plans & Support Desk");
  y = 75;

  y = addSectionHeader(y, "Section 13", "Landlord Subscription Plans & Pricing");
  y = addParagraph(y, "RentReceipt Pro offers simple, transparent subscription plans with full access to all features:");
  y = addBullet(y, "14-Day Free Trial:", "All new landlord accounts start with a full-featured 14-day free trial. No credit card required.");
  y = addBullet(y, "Monthly Plan:", "KSh 400 per month (Billed monthly via M-Pesa).");
  y = addBullet(y, "Quarterly Plan:", "KSh 1,100 for 3 months (Save 8%).");
  y = addBullet(y, "Semi-Annual Plan:", "KSh 2,100 for 6 months (Save 12%).");
  y = addBullet(y, "Annual Plan:", "KSh 4,000 per year (Save 17% - Best value).");
  y = addBullet(y, "Voucher Redemption:", "Have a promo voucher? Enter the voucher code in Billing to instantly unlock subscription time.");

  y += 8;
  y = addSectionHeader(y, "Section 14", "Customer Support & Concierge Assistance");
  y = addParagraph(y, "Need help setting up your properties or configuring custom Daraja Paybill shortcodes? Our dedicated support team is available 24/7:");

  // Contact Info Box
  doc.setFillColor(BG_LIGHT[0], BG_LIGHT[1], BG_LIGHT[2]);
  doc.setDrawColor(BORDER_COLOR[0], BORDER_COLOR[1], BORDER_COLOR[2]);
  doc.roundedRect(margin, y, contentWidth, 85, 6, 6, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(PRIMARY_DARK[0], PRIMARY_DARK[1], PRIMARY_DARK[2]);
  doc.text("RENTRECEIPT PRO HELP & SUPPORT DESK", margin + 15, y + 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(TEXT_MAIN[0], TEXT_MAIN[1], TEXT_MAIN[2]);
  doc.text("Official Website: https://www.rentreceipt.co.ke", margin + 15, y + 36);
  doc.text("WhatsApp Helpline: +254 742 868 209 (Nairobi, Kenya)", margin + 15, y + 50);
  doc.text("Technical Support: support@rentreceipt.co.ke", margin + 15, y + 64);
  doc.text("Operating Hours: 24/7 Dedicated Kenyan PropTech Support", margin + 15, y + 78);

  y += 100;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(SECONDARY_DARK[0], SECONDARY_DARK[1], SECONDARY_DARK[2]);
  doc.text("Thank you for choosing RentReceipt Pro.", margin, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
  doc.text("Managing rentals. Tracking every payment. Sending professional receipts.", margin, y + 13);

  drawFooter(currentPage, totalPages);

  // Save / Trigger Download
  doc.save("RentReceipt_Pro_Landlord_Operations_Manual_2026.pdf");
}

