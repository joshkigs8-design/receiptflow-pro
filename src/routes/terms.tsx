import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";

const title = "Terms of Service — Rent Receipt Pro";
const description =
  "Review the terms and conditions for using Rent Receipt Pro property management and receipt generation platform.";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://rentreceipt.co.ke/terms" },
    ],
    links: [{ rel: "canonical", href: "https://rentreceipt.co.ke/terms" }],
  }),
  component: TermsOfServicePage,
});

function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Terms of Service
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Rent Receipt Pro ("Application," "we," "us," or "our"), you
                accept and agree to be bound by these Terms of Service. If you do not agree to abide
                by the above, please do not use this service.
              </p>
              <p>
                We reserve the right to modify these Terms of Service at any time. Changes become
                effective immediately upon posting to the Application. Your continued use of the
                Application following the posting of revised Terms of Service means that you accept
                and agree to the changes.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">2. Description of Service</h2>
              <p>
                Rent Receipt Pro is a cloud-based property management and digital rent receipt
                generation platform designed for landlords and property managers in Kenya. The
                Application provides tools to:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                <li>Manage properties, units, and tenant information</li>
                <li>Record and track rental payments</li>
                <li>Generate professional digital rent receipts with QR code verification</li>
                <li>Manage subscriptions and billing</li>
                <li>Store and organize lease agreements and property documentation</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                3. Account Registration and Eligibility
              </h2>

              <div className="space-y-3 pl-4">
                <div>
                  <h3 className="font-semibold text-foreground">3.1 Eligibility</h3>
                  <p>
                    You must be at least 18 years of age and legally capable of entering into
                    contracts to use Rent Receipt Pro. By registering, you represent and warrant
                    that you are legally authorized to enter into this agreement.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground">3.2 Account Information</h3>
                  <p>
                    When creating an account, you must provide accurate, complete, and current
                    information. You are solely responsible for maintaining the confidentiality of
                    your password and account credentials. You agree to accept responsibility for
                    all activities that occur under your account.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground">3.3 Google Sign-In</h3>
                  <p>
                    If you choose to register or log in using Google Sign-In, you authorize us to
                    access your Google account information as provided by Google's authentication
                    system. Your use of Google Sign-In is subject to Google's Terms of Service and
                    Privacy Policy. We are not responsible for Google's handling of your
                    information.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">4. User Responsibilities</h2>

              <div className="space-y-3 pl-4">
                <div>
                  <h3 className="font-semibold text-foreground">4.1 Accurate Information</h3>
                  <p>
                    You are responsible for providing accurate, complete, and current information
                    about your properties, tenants, leases, and payment records. You acknowledge
                    that inaccurate information may result in errors in generated receipts and
                    reports.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground">4.2 Account Security</h3>
                  <p>
                    You are responsible for maintaining the confidentiality of your account
                    credentials and password. You agree to notify us immediately of any unauthorized
                    use of your account. We are not liable for any loss or damage arising from your
                    failure to protect your password or account information.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground">4.3 Property and Tenant Data</h3>
                  <p>You are solely responsible for:</p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                    <li>
                      The legality and accuracy of all property and tenant information you enter
                    </li>
                    <li>
                      Obtaining necessary consents from tenants for storing and processing their
                      information
                    </li>
                    <li>Complying with all applicable data protection and privacy laws</li>
                    <li>
                      Ensuring that you have the right to manage and collect data about your
                      properties
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground">4.4 Receipt Generation</h3>
                  <p>
                    When generating receipts, you are responsible for ensuring that all information
                    is accurate and reflects the actual transaction. You agree to use the
                    Application only to generate receipts for legitimate rental payments received by
                    you.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground">4.5 User-Generated Content</h3>
                  <p>
                    You retain all rights to content you create and upload (documents, images,
                    property descriptions, tenant information, etc.). However, you grant Rent
                    Receipt Pro a worldwide, royalty-free license to use, store, and process this
                    content solely to provide the services you have contracted for.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                5. Subscription Plans and Payment
              </h2>

              <div className="space-y-3 pl-4">
                <div>
                  <h3 className="font-semibold text-foreground">5.1 Trial Period</h3>
                  <p>
                    New users receive a trial period (where applicable) to use Rent Receipt Pro at
                    no charge. The trial period begins on the date your account is created. At the
                    end of the trial period, you must select a paid subscription plan to continue
                    using the Application, or your account may be suspended.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground">5.2 Paid Subscriptions</h3>
                  <p>
                    If you purchase a paid subscription plan, you agree to pay the subscription fee
                    according to the pricing displayed at the time of purchase. Subscription fees
                    are billed according to the billing cycle you select (monthly, annually, etc.).
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground">5.3 Voucher Codes</h3>
                  <p>
                    Voucher codes and promotional offers are subject to specific terms and
                    conditions. Vouchers are valid only during the specified period and for the
                    services or subscription plans they apply to. Unused vouchers expire at the end
                    of their validity period. Vouchers are non-transferable and non-refundable.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground">5.4 Payment Processing</h3>
                  <p>
                    Payment processing is handled by third-party payment processors. Your payment
                    information is processed in accordance with their payment processing agreement
                    and privacy practices. We do not store your full payment card details.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground">5.5 Cancellation and Refunds</h3>
                  <p>
                    You may cancel your subscription at any time through your account settings. Your
                    cancellation will take effect at the end of your current billing cycle. You will
                    not receive a refund for the remainder of your current billing period. No
                    refunds are issued for partial months of service or for cancellations after the
                    billing cycle has begun. Refund requests must be made within 7 days of the
                    charge date and are subject to review.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">6. Prohibited Use</h2>
              <p>You agree not to use Rent Receipt Pro for any of the following purposes:</p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                <li>
                  Generating false or fraudulent receipts, including receipts for payments you have
                  not actually received
                </li>
                <li>
                  Using the Application to commit fraud, forgery, or any other illegal activity
                </li>
                <li>Storing or transmitting malware, viruses, or harmful code</li>
                <li>Attempting to gain unauthorized access to the Application or its systems</li>
                <li>Disrupting or interfering with the normal operation of the Application</li>
                <li>
                  Reverse-engineering, decompiling, or attempting to discover the Application's
                  source code
                </li>
                <li>
                  Violating any applicable laws or regulations in Kenya or any other jurisdiction
                </li>
                <li>Harassing, abusing, or threatening other users or our staff</li>
                <li>
                  Uploading or transmitting content that infringes third-party intellectual property
                  rights
                </li>
                <li>Sharing or using another person's account without authorization</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                7. Service Availability and Technical Issues
              </h2>
              <p>
                Rent Receipt Pro is provided on an "as-is" basis. While we strive to maintain high
                availability, we make no guarantees regarding uptime or continuous operation. The
                Application may be subject to:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                <li>Scheduled maintenance and updates</li>
                <li>Unplanned outages or downtime</li>
                <li>Performance issues or slow response times</li>
                <li>Temporary suspension due to security threats</li>
              </ul>
              <p className="mt-3">
                We will use reasonable efforts to notify you of scheduled maintenance in advance,
                but we are not liable for any loss of data or service interruptions resulting from
                maintenance or technical issues.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">8. Third-Party Services</h2>
              <p>Rent Receipt Pro integrates with and relies on third-party services, including:</p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                <li>Supabase for authentication and database hosting</li>
                <li>Vercel for application hosting and deployment</li>
                <li>Google for Google OAuth authentication</li>
                <li>Payment processors for subscription billing</li>
              </ul>
              <p className="mt-3">
                We are not responsible for the performance, availability, or practices of these
                third-party services. Your use of these services is subject to their respective
                terms of service and privacy policies.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">9. Intellectual Property</h2>

              <div className="space-y-3 pl-4">
                <div>
                  <h3 className="font-semibold text-foreground">9.1 Application Ownership</h3>
                  <p>
                    Rent Receipt Pro, including all code, design, features, and functionality, is
                    owned by or licensed to Codevanta Ventures. You may not copy, modify,
                    distribute, or create derivative works of the Application without our express
                    written permission.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground">9.2 Your Content</h3>
                  <p>
                    You retain all ownership rights to the content you create and upload to Rent
                    Receipt Pro (property data, tenant information, documents, etc.). By uploading
                    content, you grant us a limited license to store, display, and process that
                    content solely to provide the services you have contracted for.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground">9.3 Trademarks and Branding</h3>
                  <p>
                    "Rent Receipt Pro," "RentReceipt," and related logos and marks are trademarks of
                    Codevanta Ventures. You may not use these trademarks without our express written
                    permission.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                10. Accuracy of Generated Receipts
              </h2>
              <p>
                Rent Receipt Pro generates receipts based on the information you provide. While we
                employ safeguards to help ensure accuracy:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                <li>
                  You are solely responsible for the accuracy of all information entered into the
                  Application
                </li>
                <li>
                  We are not responsible for errors resulting from inaccurate, incomplete, or false
                  information you provide
                </li>
                <li>
                  Rent Receipt Pro is a tool for generating and storing receipts; it is not a
                  substitute for proper accounting and record-keeping practices
                </li>
                <li>
                  You should maintain independent records and backups of all rental transactions and
                  agreements
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                11. No Legal, Financial, or Tax Advice
              </h2>
              <p>
                Rent Receipt Pro is a property management and receipt generation tool. We do not
                provide legal, financial, tax, or accounting advice. The Application should not be
                relied upon as a substitute for professional consultation. We strongly recommend
                that you:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                <li>
                  Consult with a qualified accountant or tax professional regarding tax obligations
                </li>
                <li>Consult with a lawyer regarding legal compliance and rental agreements</li>
                <li>
                  Maintain comprehensive business records and backups independent of the Application
                </li>
              </ul>
              <p className="mt-3">
                Rent Receipt Pro is not a financial institution, bank, or lender. We do not
                facilitate payments between you and tenants, though we may integrate with payment
                processors for subscription management.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                12. Limitation of Liability
              </h2>
              <p>
                To the fullest extent permitted by law, Rent Receipt Pro and Codevanta Ventures
                shall not be liable for:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                <li>
                  Any indirect, incidental, special, consequential, or punitive damages arising from
                  your use of the Application
                </li>
                <li>Loss of data, profits, revenue, or business opportunities</li>
                <li>Errors or omissions in generated receipts or reports</li>
                <li>Service interruptions, downtime, or unavailability</li>
                <li>Third-party services or integrations</li>
                <li>Actions or inactions by third-party payment processors</li>
              </ul>
              <p className="mt-3">
                Our total liability to you for any claim related to the Application shall not exceed
                the amount you have paid us in the 12 months preceding the claim.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">13. Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless Rent Receipt Pro and Codevanta
                Ventures, their affiliates, officers, employees, and agents from and against any and
                all claims, damages, losses, costs, and expenses (including reasonable attorney
                fees) arising from or related to:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                <li>Your use of the Application in violation of these Terms of Service</li>
                <li>Your violation of any applicable law or regulation</li>
                <li>Your infringement of any third-party intellectual property rights</li>
                <li>The accuracy or legality of content you upload or information you provide</li>
                <li>Your disputes with tenants or other third parties</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                14. Suspension and Termination
              </h2>

              <div className="space-y-3 pl-4">
                <div>
                  <h3 className="font-semibold text-foreground">14.1 Termination by You</h3>
                  <p>
                    You may terminate your account at any time by contacting our support team. Upon
                    termination, your access to the Application will be disabled, though we may
                    retain data for backup and compliance purposes.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground">
                    14.2 Suspension or Termination by Us
                  </h3>
                  <p>
                    We may suspend or terminate your account or access to the Application at any
                    time if we believe you have:
                  </p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                    <li>Violated these Terms of Service</li>
                    <li>Engaged in fraudulent, illegal, or abusive activity</li>
                    <li>Failed to pay applicable subscription fees</li>
                    <li>Threatened or harassed our staff or other users</li>
                    <li>Created a security risk to the Application</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground">14.3 Effect of Termination</h3>
                  <p>
                    Upon termination, you will lose access to your account and all data stored in
                    the Application. Sections regarding limitation of liability, indemnification,
                    and governing law shall survive termination.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">15. Changes to the Service</h2>
              <p>
                We reserve the right to modify, add, or remove features and functionality of Rent
                Receipt Pro at any time. We will endeavor to notify you of significant changes, but
                we are not obligated to do so. Your continued use of the Application following any
                changes constitutes acceptance of those changes.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                16. Governing Law and Jurisdiction
              </h2>
              <p>
                These Terms of Service are governed by and construed in accordance with the laws of
                Kenya, without regard to its conflict of law provisions. Any legal action or
                proceeding arising under or related to these Terms of Service shall be brought
                exclusively in the courts located in Nairobi, Kenya, and you hereby consent to the
                exclusive jurisdiction of such courts.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">17. Contact Information</h2>
              <p>
                If you have questions, concerns, or requests regarding these Terms of Service,
                please contact us:
              </p>
              <div className="mt-4 rounded-lg bg-card p-4 text-sm">
                <p className="font-semibold">Rent Receipt Pro Support</p>
                <p className="mt-1">WhatsApp: 0742868209</p>
                <p>Nairobi, Kenya</p>
                <p className="mt-2 text-xs">A Codevanta Ventures product</p>
              </div>
            </section>

            <section className="mt-8 rounded-lg border border-border bg-card/30 p-4 text-sm italic">
              <p>
                <strong>Disclaimer:</strong> These Terms of Service are provided for informational
                purposes and are not a substitute for professional legal advice. If you have legal
                concerns regarding these terms or your obligations under Kenyan law, please consult
                with a qualified attorney in Kenya.
              </p>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
