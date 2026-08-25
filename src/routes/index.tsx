import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { Hero } from "@/components/site/Hero";
import { SocialProof } from "@/components/site/SocialProof";
import { ProblemSection } from "@/components/site/ProblemSection";
import { Features } from "@/components/site/Features";
import { ProductSection } from "@/components/site/ProductSection";
import { HowItWorks } from "@/components/site/HowItWorks";
import { KenyanContext } from "@/components/site/KenyanContext";
import { BenefitsSection } from "@/components/site/BenefitsSection";
import { LiveReceiptDemo } from "@/components/site/LiveReceiptDemo";
import { Testimonials } from "@/components/site/Testimonials";
import { Pricing } from "@/components/site/Pricing";
import { FaqSection } from "@/components/site/FaqSection";
import { CtaBand } from "@/components/site/CtaBand";
import { SiteFooter } from "@/components/site/SiteFooter";

const title = "RentReceipt Pro | Smart Rental Management for Landlords in Kenya";
const description =
  "RentReceipt Pro helps landlords and property managers in Kenya manage properties, track rent payments, manage tenants and send professional rental receipts.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      {
        name: "keywords",
        content:
          "smart rental management kenya, rent receipt pro, rental property management nairobi, mpesa rent receipt, landlord software kenya, digital rent receipt pdf",
      },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.rentreceipt.co.ke/" },
      { property: "og:image", content: "https://www.rentreceipt.co.ke/favicon.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: "https://www.rentreceipt.co.ke/favicon.png" },
    ],
    links: [{ rel: "canonical", href: "https://www.rentreceipt.co.ke/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-[#F7F8F5] dark:bg-[#061A13] text-[#101714] dark:text-[#F7F8F5]">
      <SiteNav />
      <main>
        <Hero />
        <SocialProof />
        <ProblemSection />
        <Features />
        <ProductSection />
        <HowItWorks />
        <KenyanContext />
        <BenefitsSection />
        <LiveReceiptDemo />
        <Testimonials />
        <Pricing />
        <FaqSection />
        <CtaBand />
      </main>
      <SiteFooter />
    </div>
  );
}
