import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { Hero } from "@/components/site/Hero";
import { Features } from "@/components/site/Features";
import { Pricing } from "@/components/site/Pricing";
import { CtaBand } from "@/components/site/CtaBand";
import { SiteFooter } from "@/components/site/SiteFooter";

const title = "RentReceiptPro — Rent Receipts & Property Management";
const description =
  "RentReceiptPro is a rental property management platform that helps landlords and property managers manage properties, tenants, rent payments, leases and professional rent receipts.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: "RentReceiptPro – Rent Receipts & Property Management" },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://rentreceipt.co.ke/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "RentReceiptPro – Rent Receipts & Property Management" },
      { name: "twitter:description", content: description },
      { property: "og:image", content: "https://rentreceipt.co.ke/favicon.png" },
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
        <Features />
        <Pricing />
        <CtaBand />
      </main>
      <SiteFooter />
    </div>
  );
}
