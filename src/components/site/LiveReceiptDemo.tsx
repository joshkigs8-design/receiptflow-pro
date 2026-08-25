import { useState } from "react";
import { motion } from "motion/react";
import {
  CheckCircle2,
  Download,
  MessageCircle,
  QrCode,
  ShieldCheck,
  Sparkles,
  Building2,
  FileCheck2,
  Printer,
  Copy,
  Receipt,
  Smartphone,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { money } from "@/lib/format";
import { toast } from "sonner";

export function LiveReceiptDemo() {
  const [tenantName, setTenantName] = useState("Grace Wanjiku");
  const [propertyName, setPropertyName] = useState("Kilimani Heights");
  const [unit, setUnit] = useState("Unit 4B");
  const [amount, setAmount] = useState(35000);
  const [method, setMethod] = useState("M-Pesa Paybill 247247");
  const [refCode, setRefCode] = useState("QKH7829X1P");
  const [copied, setCopied] = useState(false);

  const receiptNo = "RCP-202608-8X92A";
  const dateStr = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`https://rentreceipt.co.ke/receipt/${receiptNo}`);
      setCopied(true);
      toast.success("Public verification link copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSimulateWhatsApp = () => {
    toast.success(`WhatsApp receipt simulated for ${tenantName} (+254 7XX XXX XXX)`, {
      duration: 3500,
    });
  };

  return (
    <section id="demo" className="relative py-24 overflow-hidden bg-muted/20 border-y border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center space-y-3">
          <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5 text-primary" /> Interactive Live Simulator
          </span>
          <h2 className="font-display text-3xl font-bold sm:text-5xl tracking-tight">
            Try issuing a live digital receipt
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Type your details on the left to see the instant, tamper-proof QR-verified PDF receipt update in real time.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-12 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="surface-card p-6 sm:p-7 rounded-3xl border border-border/80 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <h3 className="font-display text-base font-bold flex items-center gap-2">
                  <Building2 className="size-4 text-primary" /> Customize Receipt Details
                </h3>
                <span className="text-[11px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                  Live Sync
                </span>
              </div>

              <div className="space-y-3.5 pt-1">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Tenant Full Name</label>
                  <Input
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    className="h-10 rounded-xl text-xs"
                    placeholder="e.g. Grace Wanjiku"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Property Name</label>
                    <Input
                      value={propertyName}
                      onChange={(e) => setPropertyName(e.target.value)}
                      className="h-10 rounded-xl text-xs"
                      placeholder="e.g. Kilimani Heights"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Unit / Door</label>
                    <Input
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="h-10 rounded-xl text-xs"
                      placeholder="e.g. Unit 4B"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Rent Amount Paid (KSh)</label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value) || 0)}
                    className="h-10 rounded-xl text-xs font-bold font-mono"
                    placeholder="35000"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Payment Method</label>
                    <Input
                      value={method}
                      onChange={(e) => setMethod(e.target.value)}
                      className="h-10 rounded-xl text-xs"
                      placeholder="M-Pesa / Bank"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Transaction Ref</label>
                    <Input
                      value={refCode}
                      onChange={(e) => setRefCode(e.target.value.toUpperCase())}
                      className="h-10 rounded-xl text-xs font-mono uppercase"
                      placeholder="QKH7829X1P"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border/80 flex flex-col gap-2.5">
                <Button
                  onClick={handleSimulateWhatsApp}
                  className="w-full rounded-full shadow-glow text-xs font-bold gap-2"
                >
                  <MessageCircle className="size-4" /> Simulate Instant WhatsApp Send
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCopyLink}
                  className="w-full rounded-full text-xs font-semibold gap-2"
                >
                  {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                  {copied ? "Link Copied!" : "Copy Public Verification Link"}
                </Button>
              </div>
            </div>
          </div>

          {/* Interactive Live Official PDF Receipt Column */}
          <div className="lg:col-span-7">
            <div className="surface-card p-6 sm:p-8 rounded-3xl border-2 border-primary/40 bg-card shadow-float space-y-6">
              {/* Receipt Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
                <div className="flex items-center gap-3">
                  <span className="gradient-primary flex size-11 items-center justify-center rounded-2xl shadow-glow">
                    <Building2 className="size-6 text-primary-foreground" />
                  </span>
                  <div>
                    <h3 className="font-display font-black text-lg text-foreground">
                      {propertyName || "Your Estate Name"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Managed by Codevanta Real Estate Ltd · PIN: P051892401K
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    <ShieldCheck className="size-3.5" /> VERIFIED GENUINE
                  </span>
                  <p className="text-[11px] font-mono text-muted-foreground mt-1">
                    No: {receiptNo}
                  </p>
                </div>
              </div>

              {/* Receipt Grid Metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-muted/30 border border-border/60 text-xs">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">Tenant</p>
                  <p className="font-bold text-foreground truncate mt-0.5">{tenantName || "Tenant Name"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">Unit / House</p>
                  <p className="font-bold text-foreground truncate mt-0.5">{unit || "Unit 1"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">Date Paid</p>
                  <p className="font-semibold text-foreground mt-0.5">{dateStr}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">Method</p>
                  <p className="font-semibold text-foreground mt-0.5 truncate">{method || "M-Pesa"}</p>
                </div>
              </div>

              {/* Breakdown Ledger Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="text-left uppercase text-muted-foreground border-b border-border/60">
                    <tr>
                      <th className="pb-2">Description</th>
                      <th className="pb-2">Period</th>
                      <th className="pb-2 text-right">Amount (KSh)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    <tr>
                      <td className="py-2.5 font-medium">Monthly Rental Payment</td>
                      <td className="py-2.5 text-muted-foreground">Current Month</td>
                      <td className="py-2.5 font-bold font-mono text-right">{money(amount)}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-muted-foreground">Water &amp; Garbage Surcharge</td>
                      <td className="py-2.5 text-muted-foreground">Inclusive</td>
                      <td className="py-2.5 font-mono text-right text-muted-foreground">KSh 0.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Total Box */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-primary/10 border border-primary/30">
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-wider">Total Received</p>
                  <p className="text-[11px] font-mono text-muted-foreground">Ref: {refCode || "M-PESA"}</p>
                </div>
                <p className="font-display font-black text-2xl text-primary">{money(amount)}</p>
              </div>

              {/* Verification Stamp & QR Code */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs text-muted-foreground border-t border-border/60">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white text-black shadow-sm">
                    <QrCode className="size-10" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Scan QR to verify on Kenyan PropTech registry</p>
                    <p className="text-[11px] font-mono">rentreceipt.co.ke/receipt/{receiptNo}</p>
                  </div>
                </div>

                <div className="text-center sm:text-right">
                  <p className="text-[11px] font-bold text-foreground">Official Digital Stamp</p>
                  <p className="text-[10px] text-emerald-600 font-semibold">Signed &amp; Dispatched via WhatsApp</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
