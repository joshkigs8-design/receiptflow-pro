import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Features } from "@/components/site/Features";
import { DashboardPreview } from "@/components/site/DashboardPreview";
import { CtaBand } from "@/components/site/CtaBand";
import { SiteFooter } from "@/components/site/SiteFooter";

const title = "Rent Receipt Pro — Digital Rent Receipts & Property Management";
const description =
  "Manage properties smarter and generate QR-verified digital rent receipts instantly. Codevanta Ventures Rent Receipt Pro for landlords and tenants in Kenya.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main>
        <Hero />
        <About />
        <Features />
        <DashboardPreview />
        <CtaBand />
      </main>
      <SiteFooter />
    </div>
  );
}
