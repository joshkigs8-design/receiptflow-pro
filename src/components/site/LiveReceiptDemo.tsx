import { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2, Download, MessageCircle, QrCode, ShieldCheck, Sparkles, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { money } from "@/lib/format";

export function LiveReceiptDemo() {
  const [tenantName, setTenantName] = useState("Grace Wanjiku");
  const [propertyName, setPropertyName] = useState("Kilimani Heights");
  const [unit, setUnit] = useState("Unit 4B");
  const [amount, setAmount] = useState(35000);
  const [method, setMethod] = useState("M-Pesa (Ref: QK78923KL)");

  const receiptNo = "RCP-202608-8X92A";
  const dateStr = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <section className="relative py-20 overflow-hidden bg-muted/20 border-y border-border/60">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5 text-primary" /> Interactive Live Preview
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold sm:text-5xl">
            See how your digital receipts look
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground">
            Type details below to preview an instant, tamper-proof QR verified rent receipt generated live.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-12 items-center">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="surface-card p-6 sm:p-8 rounded-3xl border border-border/80 shadow-md space-y-4">
              <h3 className="font-display text-lg font-bold flex items-center gap-2">
                <Building2 className="size-4 text-primary" /> Customize Receipt Details
              </h3>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Tenant Full Name</label>
                  <Input
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    className="h-10 rounded-xl text-xs"
                    placeholder="e.g. Grace Wanjiku"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
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
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Unit / Room</label>
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
                    className="h-10 rounded-xl text-xs"
                    placeholder="35000"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Payment Method &amp; Reference</label>
                  <Input
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="h-10 rounded-xl text-xs"
                    placeholder="M-Pesa Ref: QK78923KL"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-border/80 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1 text-emerald-500 font-semibold">
                  <ShieldCheck className="size-4" /> Cryptographically Sealed
                </span>
                <span>Instant PDF + WhatsApp</span>
              </div>
            </div>
          </div>

          {/* Interactive Document Column */}
          <div className="lg:col-span-7">
            <motion.div
              layout
              className="relative mx-auto max-w-lg rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-2xl overflow-hidden"
            >
              {/* Top Receipt Header */}
              <div className="rounded-2xl bg-[#0B1220] text-white p-5 sm:p-6 shadow-md border-b-2 border-[#FF7A00]">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-[#FF7A00] font-bold uppercase">
                      Official Rent Receipt
                    </span>
                    <h4 className="text-lg font-bold text-white mt-0.5">{propertyName || "Property Portfolio"}</h4>
                    <p className="text-[11px] text-slate-300">Managed via RentReceiptPro Digital Registry</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 text-[10px] font-bold border border-emerald-500/40">
                      <CheckCircle2 className="size-3" /> VERIFIED
                    </span>
                    <p className="font-mono text-[11px] text-slate-300 mt-1 font-bold">{receiptNo}</p>
                  </div>
                </div>
              </div>

              {/* Body Details */}
              <div className="mt-6 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-muted/40 border border-border/60">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">Tenant Name</span>
                    <p className="font-bold text-sm text-foreground mt-0.5">{tenantName || "Tenant Name"}</p>
                    <p className="text-[11px] text-muted-foreground">+254 712 345 678</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">Premises</span>
                    <p className="font-bold text-sm text-foreground mt-0.5">{unit || "Unit"}</p>
                    <p className="text-[11px] text-muted-foreground">{propertyName || "Property"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-muted/40 border border-border/60">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">Payment Reference</span>
                    <p className="font-semibold text-foreground mt-0.5">{method || "M-Pesa"}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">Date Stamped</span>
                    <p className="font-semibold text-foreground mt-0.5">{dateStr}</p>
                  </div>
                </div>

                {/* Amount Paid Highlight & QR Box */}
                <div className="flex items-center justify-between p-5 rounded-2xl bg-primary/5 border border-primary/20">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                      Total Rent Documented
                    </span>
                    <p className="font-display text-2xl sm:text-3xl font-bold text-primary mt-0.5">
                      {money(amount)}
                    </p>
                    <span className="inline-block mt-1 text-[11px] font-semibold text-emerald-500">
                      Balance Remaining: Settled (KSh 0)
                    </span>
                  </div>

                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-background border border-border/80 shadow-sm text-center">
                    <QrCode className="size-12 text-foreground" />
                    <span className="text-[9px] font-mono font-bold text-muted-foreground mt-1">SCAN TO VERIFY</span>
                  </div>
                </div>

                {/* Simulated Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button size="sm" className="rounded-full shadow-glow text-xs gap-1.5 h-9 font-semibold">
                    <Download className="size-3.5" /> Download PDF Receipt
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-full text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10 text-xs gap-1.5 h-9 font-semibold">
                    <MessageCircle className="size-3.5" /> WhatsApp to Tenant
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

