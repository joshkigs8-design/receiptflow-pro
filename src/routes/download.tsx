import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Monitor,
  CheckCircle2,
  Sparkles,
  Zap,
  RefreshCw,
  Maximize2,
  ShieldCheck,
  Printer,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

const title = "Download RentReceipt Pro Desktop for Windows";
const description =
  "Download the official RentReceipt Pro Windows desktop application for Windows 10 and 11. Enjoy fullscreen workspace, auto-updates, and instant M-Pesa sync.";

export const Route = createFileRoute("/download")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://rentreceipt.co.ke/download" },
    ],
    links: [{ rel: "canonical", href: "https://rentreceipt.co.ke/download" }],
  }),
  component: DownloadPage,
});

const GITHUB_RELEASE_EXE =
  "https://github.com/joshkigs8-design/receiptflow-pro/releases/download/V1.0/RentReceipt.Pro.Setup.1.0.0.exe";
const GITHUB_RELEASES_PAGE =
  "https://github.com/joshkigs8-design/receiptflow-pro/releases/tag/V1.0";

function DownloadPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteNav />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 sm:py-24 border-b border-border/60 bg-gradient-to-b from-background via-muted/20 to-background">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold shadow-sm">
              <Sparkles className="size-3.5" /> Official Windows Desktop Edition · v1.0.0
            </div>

            <div className="space-y-4 max-w-3xl mx-auto">
              <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-foreground">
                RentReceipt Pro <span className="text-primary">for Windows</span>
              </h1>
              <p className="text-base sm:text-xl text-muted-foreground leading-relaxed">
                Manage your properties, tenants, and collections faster with the native desktop application. Enjoy uninterrupted fullscreen workflows and automatic background updates.
              </p>
            </div>

            {/* Download CTA Card */}
            <div className="max-w-md mx-auto surface-card p-6 sm:p-8 rounded-3xl border border-border shadow-xl space-y-6 bg-card">
              <div className="flex items-center justify-center size-16 rounded-2xl bg-primary/10 text-primary mx-auto">
                <Monitor className="size-8" />
              </div>

              <div className="space-y-1">
                <h3 className="font-display text-xl font-bold text-foreground">
                  RentReceipt Pro Setup
                </h3>
                <p className="text-xs text-muted-foreground">
                  Version 1.0.0 · 64-bit Installer (.exe)
                </p>
              </div>

              <div className="space-y-3">
                <a
                  href={GITHUB_RELEASE_EXE}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-sm shadow-glow hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Download className="size-4" /> Download for Windows
                </a>

                <p className="text-[11px] text-muted-foreground">
                  Compatible with Windows 10 &amp; Windows 11 (64-bit)
                </p>
              </div>

              <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                <span>Free Automatic Updates</span>
                <a
                  href={GITHUB_RELEASES_PAGE}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary flex items-center gap-1 font-medium transition-colors"
                >
                  GitHub Releases <ExternalLink className="size-3" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features Grid */}
        <section className="py-16 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              Built for Commercial Property Management
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Everything you love about RentReceipt Pro web, supercharged with native desktop convenience.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="surface-card p-6 rounded-2xl border border-border/80 space-y-3">
              <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <RefreshCw className="size-5" />
              </div>
              <h4 className="font-bold text-foreground text-sm">Silent Auto-Updates</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Never worry about manual updates. When a new version is released on GitHub, the app downloads it in the background and prompts you to restart when convenient.
              </p>
            </div>

            <div className="surface-card p-6 rounded-2xl border border-border/80 space-y-3">
              <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Maximize2 className="size-5" />
              </div>
              <h4 className="font-bold text-foreground text-sm">F11 Immersive Fullscreen</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Toggle fullscreen anytime with <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">F11</kbd> to remove all distraction, or press <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">Esc</kbd> to return to normal windowed mode.
              </p>
            </div>

            <div className="surface-card p-6 rounded-2xl border border-border/80 space-y-3">
              <div className="size-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <Zap className="size-5" />
              </div>
              <h4 className="font-bold text-foreground text-sm">Unified Supabase Cloud Sync</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your desktop app communicates directly with the exact same Supabase database as your mobile phone and web dashboard in real time.
              </p>
            </div>

            <div className="surface-card p-6 rounded-2xl border border-border/80 space-y-3">
              <div className="size-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Printer className="size-5" />
              </div>
              <h4 className="font-bold text-foreground text-sm">Instant Printing</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Print rent receipts, tenant statements, and financial audit reports directly to your local receipt or A4 printer with <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">Ctrl+P</kbd>.
              </p>
            </div>

            <div className="surface-card p-6 rounded-2xl border border-border/80 space-y-3">
              <div className="size-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <ShieldCheck className="size-5" />
              </div>
              <h4 className="font-bold text-foreground text-sm">Sandboxed &amp; Secure</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Protected by strict context isolation and sandboxing. Sensitive credentials like M-Pesa passkeys and KCB BUNI client keys remain securely encrypted on the server.
              </p>
            </div>

            <div className="surface-card p-6 rounded-2xl border border-border/80 space-y-3">
              <div className="size-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
                <Monitor className="size-5" />
              </div>
              <h4 className="font-bold text-foreground text-sm">Dedicated Workspace</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                No accidental tab closes or browser crashes. Pin RentReceipt Pro to your Windows taskbar or Start Menu for instant access every morning.
              </p>
            </div>
          </div>
        </section>

        {/* System Requirements */}
        <section className="py-12 border-t border-border/60 bg-muted/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="font-display text-lg font-bold text-foreground mb-4">
              System Requirements
            </h3>
            <div className="grid gap-4 sm:grid-cols-3 text-xs">
              <div className="p-4 rounded-xl bg-card border border-border/60 space-y-1">
                <p className="font-bold text-foreground">Operating System</p>
                <p className="text-muted-foreground">Windows 10 or Windows 11 (64-bit)</p>
              </div>
              <div className="p-4 rounded-xl bg-card border border-border/60 space-y-1">
                <p className="font-bold text-foreground">Hardware</p>
                <p className="text-muted-foreground">4 GB RAM · 300 MB free disk space</p>
              </div>
              <div className="p-4 rounded-xl bg-card border border-border/60 space-y-1">
                <p className="font-bold text-foreground">Connectivity</p>
                <p className="text-muted-foreground">Internet connection required for real-time sync</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
