import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { Hero } from "@/components/site/Hero";
import { LiveReceiptDemo } from "@/components/site/LiveReceiptDemo";
import { HowItWorks } from "@/components/site/HowItWorks";
import { Features } from "@/components/site/Features";
import { DashboardPreview } from "@/components/site/DashboardPreview";
import { RoiCalculator } from "@/components/site/RoiCalculator";
import { Testimonials } from "@/components/site/Testimonials";
import { Pricing } from "@/components/site/Pricing";
import { FaqSection } from "@/components/site/FaqSection";
import { CtaBand } from "@/components/site/CtaBand";
import { SiteFooter } from "@/components/site/SiteFooter";

const title = "RentReceiptPro — #1 Digital Rent Receipts & Rental Property Management Kenya";
const description =
  "Generate verified PDF rent receipts with QR codes, track M-Pesa payments, manage tenant leases, and monitor rental property portfolios in Kenya.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      {
        name: "keywords",
        content:
          "digital rent receipts, rent receipt kenya, mpesa rent receipt, rental property management nairobi, landlord software kenya, generate rent receipt pdf",
      },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://rentreceipt.co.ke/" },
      { property: "og:image", content: "https://rentreceipt.co.ke/favicon.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: "https://rentreceipt.co.ke/favicon.png" },
    ],
    links: [{ rel: "canonical", href: "https://rentreceipt.co.ke/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main>
        <Hero />
        <LiveReceiptDemo />
        <HowItWorks />
        <Features />
        <DashboardPreview />
        <RoiCalculator />
        <Testimonials />
        <Pricing />
        <FaqSection />
        <CtaBand />
      </main>
      <SiteFooter />
    </div>
  );
}

