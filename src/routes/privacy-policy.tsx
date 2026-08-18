import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";

const title = "Privacy Policy — Rent Receipt Pro";
const description =
  "Learn how Rent Receipt Pro collects, uses, and protects your personal and business information.";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://rentreceipt.co.ke/privacy-policy" },
    ],
    links: [{ rel: "canonical", href: "https://rentreceipt.co.ke/privacy-policy" }],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Privacy Policy
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
              <h2 className="text-2xl font-semibold text-foreground">1. Introduction</h2>
              <p>
                Rent Receipt Pro ("we," "us," "our," or the "Application") is committed to
                protecting your privacy. This Privacy Policy explains how we collect, use, disclose,
                and safeguard your information when you use our property management and rent receipt
                generation platform, available at rentreceipt.co.ke.
              </p>
              <p>
                This Privacy Policy applies to all information collected through the Application and
                our services. Please read this privacy policy carefully. If you do not agree with
                our policies and practices, please do not use our Application.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">2. Information We Collect</h2>

              <div className="space-y-3 pl-4">
                <div>
                  <h3 className="font-semibold text-foreground">2.1 Account Information</h3>
                  <p>
                    When you create an account with Rent Receipt Pro, we collect information you
                    provide directly, including:
                  </p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                    <li>Full name or business name</li>
                    <li>Email address</li>
                    <li>Password (encrypted and never stored in plain text)</li>
                    <li>Phone number (optional)</li>
                    <li>Company or business information</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground">2.2 Property and Business Data</h3>
                  <p>
                    To use Rent Receipt Pro's core functionality, you provide information about your
                    properties, units, and business operations:
                  </p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                    <li>Property addresses and details</li>
                    <li>Unit descriptions and rental rates</li>
                    <li>Tenant names, contact information, and lease details</li>
                    <li>Payment records and transaction history</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground">
                    2.3 Receipt and Payment Information
                  </h3>
                  <p>When you generate rent receipts or record payments, we collect and store:</p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                    <li>Payment amounts and dates</li>
                    <li>Payment methods and transaction IDs</li>
                    <li>Receipt content and metadata</li>
                    <li>QR code verification data</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground">
                    2.4 Uploaded Documents and Images
                  </h3>
                  <p>
                    You may upload documents, images, or files to support your property management:
                  </p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                    <li>Property photos and documentation</li>
                    <li>Lease agreements and contracts</li>
                    <li>Supporting documentation for tenant or payment records</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground">2.5 Authentication Information</h3>
                  <p>
                    If you use Google Sign-In, we receive authentication information from Google,
                    including:
                  </p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                    <li>Google account email address</li>
                    <li>Google account profile information</li>
                    <li>Authentication tokens (used only for session management)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground">
                    2.6 Technical and Device Information
                  </h3>
                  <p>
                    We automatically collect certain information about your device and how you
                    access the Application:
                  </p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                    <li>Device type, operating system, and browser information</li>
                    <li>IP address and device identifiers</li>
                    <li>Pages accessed, time spent, and clickstream data</li>
                    <li>Referral source and navigation patterns</li>
                    <li>Crash reports and performance diagnostics</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground">2.7 Cookies and Local Storage</h3>
                  <p>
                    We use cookies and browser storage to maintain your session and improve your
                    experience:
                  </p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                    <li>Session cookies for authentication</li>
                    <li>Authentication tokens stored in local storage</li>
                    <li>Theme preferences and user settings</li>
                    <li>Analytics and performance monitoring cookies</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                3. How We Use Your Information
              </h2>
              <p>Rent Receipt Pro uses the information we collect for the following purposes:</p>

              <div className="space-y-3 pl-4">
                <div>
                  <h3 className="font-semibold text-foreground">
                    3.1 Providing and Operating the Application
                  </h3>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                    <li>Enabling you to create, manage, and access your account</li>
                    <li>Processing and storing property, tenant, and payment data you enter</li>
                    <li>Generating and managing digital rent receipts</li>
                    <li>Providing receipt verification through QR codes</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground">3.2 Authentication and Security</h3>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                    <li>Verifying your identity and maintaining account security</li>
                    <li>Detecting and preventing fraud or unauthorized access</li>
                    <li>Managing login sessions and authentication tokens</li>
                    <li>Monitoring for suspicious account activity</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground">
                    3.3 Subscription and Payment Management
                  </h3>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                    <li>Managing your subscription plan and trial period</li>
                    <li>Processing payments and billing</li>
                    <li>Applying voucher codes and discounts</li>
                    <li>Sending invoices and billing notifications</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground">3.4 Customer Support</h3>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                    <li>Responding to your support requests and inquiries</li>
                    <li>Troubleshooting and resolving technical issues</li>
                    <li>Providing technical assistance and guidance</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground">3.5 Service Improvement</h3>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                    <li>Analyzing usage patterns to improve features and functionality</li>
                    <li>Conducting research and development</li>
                    <li>Personalizing your experience based on your preferences</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground">3.6 Legal Compliance</h3>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                    <li>Complying with applicable laws and regulations in Kenya and elsewhere</li>
                    <li>Responding to legal requests from authorities</li>
                    <li>Enforcing our Terms of Service and other agreements</li>
                    <li>Protecting against legal liability</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                4. How We Store and Protect Your Information
              </h2>

              <div className="space-y-3 pl-4">
                <div>
                  <h3 className="font-semibold text-foreground">4.1 Data Storage Infrastructure</h3>
                  <p>
                    Your information is stored using Supabase, a secure cloud database platform, and
                    is hosted on cloud infrastructure. This includes:
                  </p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                    <li>
                      Supabase for authentication, user profiles, and application data storage
                    </li>
                    <li>Secure, encrypted connections (HTTPS/TLS) for all data transmission</li>
                    <li>
                      Database encryption at rest where available through our service providers
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground">4.2 Security Measures</h3>
                  <p>
                    We implement industry-standard security measures to protect your information:
                  </p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                    <li>End-to-end encryption for sensitive data</li>
                    <li>Secure password hashing and encryption</li>
                    <li>Regular security monitoring and vulnerability assessments</li>
                    <li>Access controls and role-based permissions</li>
                    <li>Audit logs for data access and modifications</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground">
                    4.3 Third-Party Service Providers
                  </h3>
                  <p>
                    We may share your information with trusted third-party service providers who
                    assist in operating the Application and providing services:
                  </p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                    <li>Supabase (authentication and database hosting)</li>
                    <li>Vercel (application hosting and deployment)</li>
                    <li>Google (for Google OAuth authentication)</li>
                    <li>Payment processors (for subscription and payment handling)</li>
                  </ul>
                  <p className="mt-2 text-sm">
                    These service providers are contractually obligated to use your information only
                    as necessary to provide services to us and are required to maintain the
                    confidentiality of your information.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">5. Data Retention</h2>
              <p>
                We retain your information for as long as your account is active and as necessary to
                provide you with the Application's services. The retention period may vary depending
                on the type of information:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                <li>
                  Account information is retained while your account is active and for a reasonable
                  period afterward for legal and operational purposes.
                </li>
                <li>
                  Property, tenant, and payment data is retained for the duration of your
                  subscription and for the period required by applicable law.
                </li>
                <li>
                  Technical and analytics data is typically retained for 12 months or as required by
                  law.
                </li>
                <li>
                  Backup and archived data may be retained longer for disaster recovery and
                  compliance purposes.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">6. Account Deletion</h2>
              <p>
                If you wish to delete your Rent Receipt Pro account and associated data, you may
                request account deletion by contacting our support team. Upon deletion:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                <li>
                  Your account and personal information will be permanently removed from active
                  systems.
                </li>
                <li>
                  Some data may be retained for backup, legal compliance, or operational purposes
                  for a limited time.
                </li>
                <li>
                  Legally required records may be retained as required by applicable regulations.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">7. Your Rights and Choices</h2>
              <p>
                Depending on your location, you may have certain rights regarding your personal
                information:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                <li>
                  <strong>Access:</strong> You can access and review your personal information
                  through your account settings.
                </li>
                <li>
                  <strong>Correction:</strong> You can update or correct your account information at
                  any time.
                </li>
                <li>
                  <strong>Deletion:</strong> You can request deletion of your account and associated
                  data.
                </li>
                <li>
                  <strong>Cookie Control:</strong> You can manage cookie preferences through your
                  browser settings.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                8. International Data Transfers
              </h2>
              <p>
                Your information may be transferred to, stored in, and processed in countries other
                than your country of residence, which may have different data protection laws. By
                using Rent Receipt Pro, you consent to such transfers. We take reasonable steps to
                ensure that international transfers are conducted in accordance with applicable data
                protection laws.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">9. Children's Privacy</h2>
              <p>
                Rent Receipt Pro is not intended for use by individuals under the age of 18. We do
                not knowingly collect personal information from children under 18. If we become
                aware that we have collected information from a child under 18, we will take steps
                to delete such information and terminate the child's account.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                10. Changes to This Privacy Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our
                practices or applicable law. We will notify you of any material changes by updating
                the "Last Updated" date at the top of this policy. Your continued use of the
                Application following the posting of revised Privacy Policy means that you accept
                and agree to the changes.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">11. Contact Information</h2>
              <p>
                If you have questions, concerns, or requests regarding this Privacy Policy or our
                privacy practices, please contact us:
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
                <strong>Disclaimer:</strong> This Privacy Policy is provided for informational
                purposes and is not a substitute for professional legal advice. If you have legal
                concerns regarding privacy or data protection, please consult with a qualified
                attorney in Kenya or your jurisdiction.
              </p>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
