import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Link2,
  LogIn,
  Megaphone,
  Share2,
  Smartphone,
  TrendingUp,
  UserPlus,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";

const title = "Affiliate Program — RentReceiptPro";
const description =
  "Earn KSh 50 for every landlord you refer who becomes a paying RentReceiptPro customer. Free to join, real-time tracking, fast M-Pesa payouts.";

export const Route = createFileRoute("/affiliate-program")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://rentreceipt.co.ke/affiliate-program" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "https://rentreceipt.co.ke/affiliate-program" }],
  }),
  component: AffiliateProgramPage,
});

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
};

const highlights = [
  { icon: Wallet, value: "KSh 50", label: "per paying referral" },
  { icon: TrendingUp, value: "Unlimited", label: "referrals you can make" },
  { icon: Smartphone, value: "M-Pesa", label: "payout method" },
  { icon: BadgeCheck, value: "24 hours", label: "withdrawal processing" },
];

const steps = [
  {
    icon: UserPlus,
    title: "1. Create your account",
    body: "Create a free affiliate account in less than a minute. No fees, no approval queue required.",
  },
  {
    icon: Link2,
    title: "2. Get your referral link",
    body: "The system generates a unique referral code and personal link, ready to share immediately.",
  },
  {
    icon: Megaphone,
    title: "3. Share it",
    body: "Share through WhatsApp, Facebook, X, friends, landlord groups, property forums, and your network.",
  },
  {
    icon: Wallet,
    title: "4. Earn",
    body: "Earn KSh 50 every time a referred landlord becomes a paying RentReceiptPro customer, paid straight to M-Pesa.",
  },
];

const details = [
  {
    item: "Commission",
    detail: "KSh 50 flat rate per successful paying referral",
  },
  {
    item: "Minimum withdrawal",
    detail: "KSh 300 available balance",
  },
  {
    item: "Payout method",
    detail: "M-Pesa mobile money transfer",
  },
  {
    item: "Processing time",
    detail: "Within 24 hours, subject to admin approval",
  },
  {
    item: "Referral tracking",
    detail: "Unique link locks referral attribution at signup permanently in your account",
  },
  {
    item: "Affiliate dashboard",
    detail: "Live metrics for earnings, referrals, available balance, and withdrawal requests",
  },
];

const benefits = [
  {
    icon: BadgeCheck,
    title: "100% Free to join",
    body: "No signup fees, subscriptions, or hidden charges. If you know landlords, you can start earning immediately.",
  },
  {
    icon: BarChart3,
    title: "Real-time tracking",
    body: "Watch your referrals, commissions, and withdrawals update live on your personal dashboard.",
  },
  {
    icon: Share2,
    title: "One-tap sharing",
    body: "Copy your custom link or share directly to WhatsApp and social media in a single tap.",
  },
  {
    icon: Smartphone,
    title: "Fast M-Pesa payouts",
    body: "Request withdrawals directly to your M-Pesa phone number and receive funds promptly within 24 hours.",
  },
  {
    icon: TrendingUp,
    title: "Unlimited earnings",
    body: "There is no limit to how many landlords you can refer. The more you share, the more you earn.",
  },
  {
    icon: ClipboardList,
    title: "Transparent history",
    body: "Every single referral, commission, and withdrawal is securely recorded in your ledger.",
  },
];

const terms = [
  "Commission (KSh 50) is credited when a referred landlord completes a qualifying subscription payment.",
  "One commission is paid per referred customer — attribution is locked at signup via your referral code.",
  "A minimum available balance of KSh 300 is required before submitting a withdrawal request.",
  "Payouts are sent via M-Pesa to the phone number specified in your withdrawal request.",
  "Withdrawal requests are reviewed and processed within 24 hours.",
  "Self-referrals are strictly prohibited and automatically rejected by the platform.",
];

function AffiliateProgramPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden px-6 pb-20 pt-36">
          <div className="pointer-events-none absolute inset-0 animate-aurora bg-[radial-gradient(circle_at_20%_10%,oklch(0.70_0.215_48_/_0.22),transparent_55%),radial-gradient(circle_at_80%_80%,oklch(0.79_0.17_65_/_0.20),transparent_60%)]" />
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto max-w-4xl text-center"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold bg-primary/15 text-primary">
              <Wallet className="size-3.5" />
              RentReceiptPro Affiliate Program
            </span>
            <h1 className="mt-6 font-display text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
              Become a RentReceiptPro Affiliate
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Earn <strong className="text-foreground">KSh 50</strong> for every landlord you refer
              who becomes a paying RentReceiptPro customer. Free to join, unique tracking links, and fast M-Pesa payouts.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="rounded-full shadow-glow">
                <Link to="/affiliate/auth" search={{ mode: "signup" }}>
                  Become an Affiliate <ArrowRight className="ml-1.5 size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link to="/affiliate/auth" search={{ mode: "login" }}>
                  <LogIn className="mr-1.5 size-4" /> Affiliate Login
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Highlights Cards */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative mx-auto mt-16 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {highlights.map((h) => (
              <div key={h.label} className="glass-strong rounded-3xl p-6 text-center shadow-sm">
                <h.icon className="mx-auto size-6 text-primary" />
                <p className="mt-3 font-display text-2xl font-bold">{h.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{h.label}</p>
              </div>
            ))}
          </motion.div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="scroll-mt-24 px-6 py-20">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="font-display text-3xl font-bold sm:text-4xl">How It Works</h2>
            <p className="mt-4 text-muted-foreground">
              Four simple steps to start earning passive income with RentReceiptPro.
            </p>
          </motion.div>
          <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="surface-card relative p-6 flex flex-col justify-between"
              >
                <div>
                  <span className="font-display absolute right-5 top-4 text-4xl font-bold text-primary/15">
                    {i + 1}
                  </span>
                  <span className="gradient-primary flex size-11 items-center justify-center rounded-xl shadow-glow">
                    <step.icon className="size-5 text-primary-foreground" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Program Details Table */}
        <section className="px-6 py-20 bg-muted/30">
          <div className="mx-auto max-w-5xl">
            <motion.div {...fadeUp} transition={{ duration: 0.7 }} className="max-w-2xl">
              <h2 className="font-display text-3xl font-bold sm:text-4xl">Program Details</h2>
              <p className="mt-4 text-muted-foreground">
                Clear and transparent guidelines for commissions, payouts, and rules.
              </p>
            </motion.div>
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="surface-card mt-10 overflow-hidden shadow-sm"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-accent/50">
                      <th className="px-6 py-4 font-semibold text-foreground">Program Feature</th>
                      <th className="px-6 py-4 font-semibold text-foreground">Specification</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.map((d) => (
                      <tr key={d.item} className="border-b border-border last:border-0 hover:bg-muted/20">
                        <td className="px-6 py-4 font-medium whitespace-nowrap text-foreground">{d.item}</td>
                        <td className="px-6 py-4 text-muted-foreground">{d.detail}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Why Join Benefits */}
        <section className="px-6 py-20">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Why Join Our Program?</h2>
            <p className="mt-4 text-muted-foreground">
              Designed to be rewarding, simple, and transparent for our partners.
            </p>
          </motion.div>
          <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="surface-card p-6 shadow-sm"
              >
                <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <b.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Terms & Conditions */}
        <section className="px-6 py-20 bg-muted/20">
          <div className="mx-auto max-w-3xl">
            <motion.h2
              {...fadeUp}
              transition={{ duration: 0.7 }}
              className="text-center font-display text-3xl font-bold sm:text-4xl"
            >
              Terms &amp; Conditions
            </motion.h2>
            <motion.ul
              {...fadeUp}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="surface-card mt-10 space-y-4 p-8 shadow-sm"
            >
              {terms.map((t) => (
                <li key={t} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>{t}</span>
                </li>
              ))}
            </motion.ul>
          </div>
        </section>

        {/* Final CTA Band */}
        <section className="px-6 pb-24 pt-12">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.8 }}
            className="gradient-primary relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] px-8 py-16 text-center shadow-glow"
          >
            <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(110deg,transparent,oklch(1_0_0_/_0.25),transparent)] bg-[length:200%_100%]" />
            <h2 className="relative font-display text-3xl font-bold text-primary-foreground sm:text-4xl">
              Ready to start earning KSh 50 per referral?
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-primary-foreground/85">
              Create your free affiliate account now and share your referral link with landlords across Kenya.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="rounded-full bg-white text-[#0B1220] hover:bg-slate-100 font-bold shadow-xl border border-white/40 transition-all hover:scale-105">
                <Link to="/affiliate/auth" search={{ mode: "signup" }}>
                  Join the Affiliate Program <ArrowRight className="ml-1.5 size-4 text-[#FF7A00]" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="rounded-full bg-[#0B1220] text-white hover:bg-[#111C2E] font-semibold border border-white/20 shadow-lg"
              >
                <Link to="/affiliate/auth" search={{ mode: "login" }}>Affiliate Login</Link>
              </Button>
            </div>
          </motion.div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
