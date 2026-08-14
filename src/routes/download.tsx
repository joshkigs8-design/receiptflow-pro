import { createFileRoute, Link } from "@tanstack/react-router";
import { Apple, Download, Smartphone, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";

const APK_URL = "https://github.com/joshkigs8-design/receiptflow-pro/releases/latest";

export const Route = createFileRoute("/download")({
  head: () => ({
    meta: [
      { title: "Download the Android App — Rent Receipt Pro" },
      {
        name: "description",
        content:
          "Install Rent Receipt Pro on Android: manage properties, record rent and issue QR-verified receipts from your phone.",
      },
      { property: "og:title", content: "Download Rent Receipt Pro for Android" },
      {
        property: "og:description",
        content: "Get the Rent Receipt Pro Android app for landlords in Kenya.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DownloadPage,
});

function DownloadPage() {
  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-3xl px-6 pb-20 pt-32">
        <span className="gradient-primary inline-flex size-12 items-center justify-center rounded-2xl shadow-glow">
          <Smartphone className="size-6 text-primary-foreground" />
        </span>
        <h1 className="mt-6 font-display text-4xl font-bold sm:text-5xl">
          Rent Receipt Pro for Android
        </h1>
        <p className="mt-4 text-muted-foreground">
          The same dashboard, tenants, payments and QR receipts — in a native Android app. Sign in
          with the account you already use on the web.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg" className="rounded-full shadow-glow">
            <a href={APK_URL} target="_blank" rel="noopener noreferrer">
              <Download className="size-4" /> Download APK
            </a>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <Link to="/auth">Use the web app</Link>
          </Button>
        </div>

        <div className="surface-card mt-10 space-y-4 p-6 text-sm">
          <h2 className="font-display text-lg font-bold">Installing the APK</h2>
          <ol className="list-decimal space-y-2 pl-5 text-muted-foreground">
            <li>Tap <strong>Download APK</strong> and grab the newest release file.</li>
            <li>
              When Android warns about unknown sources, allow installs from your browser in
              <strong> Settings → Apps → Special access</strong>.
            </li>
            <li>Open the downloaded file and tap <strong>Install</strong>.</li>
            <li>Launch Rent Receipt Pro and sign in — your data syncs instantly.</li>
          </ol>
          <p className="flex items-center gap-2 text-muted-foreground">
            <ShieldCheck className="size-4 text-primary" /> Package: com.rentreceiptpro.app —
            published by Codevanta Ventures.
          </p>
        </div>

        <div className="surface-card mt-6 flex items-start gap-3 p-6 text-sm text-muted-foreground">
          <Apple className="mt-0.5 size-4" />
          <p>
            iPhone or iPad? Open Rent Receipt Pro in Safari and tap Share → Add to Home Screen for
            an app-like experience.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
