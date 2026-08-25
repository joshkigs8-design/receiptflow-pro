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
  const [method, setMethod] = useState("M-PESA Paybill 247247");
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
      navigator.clipboard.writeText(`https://www.rentreceipt.co.ke/receipt/${receiptNo}`);
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
    <section id="demo" className="relative py-28 overflow-hidden bg-[#FFFFFF] dark:bg-[#0A261D] border-y border-[#E2E8E4] dark:border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center space-y-3 mb-16">
          <span className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold text-[#063B2A] dark:text-[#52B788] bg-[#E8F2ED] dark:bg-[#0D3528] border border-[#063B2A]/10 dark:border-white/10">
            <Sparkles className="size-3.5 text-[#C9A227]" /> Interactive Live Simulator
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-[#101714] dark:text-[#F7F8F5]">
            TRY ISSUING A LIVE DIGITAL RECEIPT.
          </h2>
          <p className="text-base sm:text-lg text-[#4A5B53] dark:text-[#94A89E]">
            Type your rental details on the left to see the instant, tamper-proof QR-verified receipt update in real time.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 items-start max-w-6xl mx-auto">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 sm:p-7 rounded-3xl bg-[#F7F8F5] dark:bg-[#061A13] border border-[#E2E8E4] dark:border-white/10 shadow-sm space-y-4 text-left">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E8E4] dark:border-white/10">
                <h3 className="font-display text-sm font-bold flex items-center gap-2 text-[#101714] dark:text-[#F7F8F5]">
                  <Building2 className="size-4 text-[#087443]" /> Receipt Parameters
                </h3>
                <span className="text-[10px] font-mono text-[#087443] bg-[#E8F2ED] dark:bg-[#0D3528] px-2 py-0.5 rounded-md font-bold">
                  Live Preview
                </span>
              </div>

              <div className="space-y-3.5 pt-1">
                <div>
                  <label className="text-xs font-semibold text-[#4A5B53] dark:text-[#94A89E] block mb-1">Tenant Full Name</label>
                  <Input
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    className="h-10 rounded-xl text-xs bg-white dark:bg-[#0A261D]"
                    placeholder="e.g. Grace Wanjiku"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-xs font-semibold text-[#4A5B53] dark:text-[#94A89E] block mb-1">Property Name</label>
                    <Input
                      value={propertyName}
                      onChange={(e) => setPropertyName(e.target.value)}
                      className="h-10 rounded-xl text-xs bg-white dark:bg-[#0A261D]"
                      placeholder="e.g. Kilimani Heights"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#4A5B53] dark:text-[#94A89E] block mb-1">Unit / Door</label>
                    <Input
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="h-10 rounded-xl text-xs bg-white dark:bg-[#0A261D]"
                      placeholder="e.g. Unit 4B"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#4A5B53] dark:text-[#94A89E] block mb-1">Rent Amount Paid (KES)</label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value) || 0)}
                    className="h-10 rounded-xl text-xs font-bold font-mono bg-white dark:bg-[#0A261D]"
                    placeholder="35000"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-xs font-semibold text-[#4A5B53] dark:text-[#94A89E] block mb-1">Payment Method</label>
                    <Input
                      value={method}
                      onChange={(e) => setMethod(e.target.value)}
                      className="h-10 rounded-xl text-xs bg-white dark:bg-[#0A261D]"
                      placeholder="M-PESA / Bank"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#4A5B53] dark:text-[#94A89E] block mb-1">Transaction Ref</label>
                    <Input
                      value={refCode}
                      onChange={(e) => setRefCode(e.target.value.toUpperCase())}
                      className="h-10 rounded-xl text-xs font-mono uppercase bg-white dark:bg-[#0A261D]"
                      placeholder="QKH7829X1P"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E2E8E4] dark:border-white/10 flex flex-col gap-2.5">
                <Button
                  onClick={handleSimulateWhatsApp}
                  className="w-full rounded-full bg-[#087443] hover:bg-[#063B2A] text-white text-xs font-bold gap-2 h-10 shadow-sm border border-[#C9A227]/30"
                >
                  <MessageCircle className="size-4 text-[#C9A227]" /> Simulate WhatsApp Dispatch
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCopyLink}
                  className="w-full rounded-full text-xs font-semibold gap-2 h-10 bg-white dark:bg-[#0A261D]"
                >
                  {copied ? <Check className="size-3.5 text-[#087443]" /> : <Copy className="size-3.5" />}
                  {copied ? "Link Copied!" : "Copy Public Verification Link"}
                </Button>
              </div>
            </div>
          </div>

          {/* Interactive Live Official PDF Receipt Column */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl border-2 border-[#063B2A] bg-[#FFFFFF] dark:bg-[#0A261D] shadow-[0_20px_50px_rgba(6,59,42,0.15)] space-y-6 text-left">
              {/* Receipt Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8E4] dark:border-white/10 pb-5">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-[#063B2A] text-white shadow-sm">
                    <Building2 className="size-6 text-[#C9A227]" />
                  </span>
                  <div>
                    <h3 className="font-display font-black text-lg text-[#101714] dark:text-[#F7F8F5]">
                      {propertyName || "Estate Name"}
                    </h3>
                    <p className="text-xs text-[#4A5B53] dark:text-[#94A89E]">
                      Managed via RentReceipt Pro · Official Digital Ledger
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#087443] dark:text-[#52B788] bg-[#E8F2ED] dark:bg-[#0D3528] px-3 py-1 rounded-full border border-[#087443]/20">
                    <ShieldCheck className="size-3.5 text-[#C9A227]" /> QR VERIFIED GENUINE
                  </span>
                  <p className="text-[11px] font-mono text-[#4A5B53] dark:text-[#94A89E] mt-1">
                    No: {receiptNo}
                  </p>
                </div>
              </div>

              {/* Receipt Grid Metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#F7F8F5] dark:bg-[#061A13] border border-[#E2E8E4] dark:border-white/10 text-xs">
                <div>
                  <p className="text-[10px] text-[#4A5B53] dark:text-[#94A89E] uppercase font-bold">Tenant</p>
                  <p className="font-bold text-[#101714] dark:text-[#F7F8F5] truncate mt-0.5">{tenantName || "Tenant Name"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#4A5B53] dark:text-[#94A89E] uppercase font-bold">Unit / House</p>
                  <p className="font-bold text-[#101714] dark:text-[#F7F8F5] truncate mt-0.5">{unit || "Unit 1"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#4A5B53] dark:text-[#94A89E] uppercase font-bold">Date Paid</p>
                  <p className="font-semibold text-[#101714] dark:text-[#F7F8F5] mt-0.5">{dateStr}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#4A5B53] dark:text-[#94A89E] uppercase font-bold">Method</p>
                  <p className="font-semibold text-[#087443] dark:text-[#52B788] mt-0.5 truncate">{method || "M-PESA"}</p>
                </div>
              </div>

              {/* Breakdown Ledger Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="text-left uppercase text-[#4A5B53] dark:text-[#94A89E] border-b border-[#E2E8E4] dark:border-white/10">
                    <tr>
                      <th className="pb-2">Description</th>
                      <th className="pb-2">Period</th>
                      <th className="pb-2 text-right">Amount (KES)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8E4] dark:divide-white/10">
                    <tr>
                      <td className="py-2.5 font-medium">Monthly Rental Payment</td>
                      <td className="py-2.5 text-[#4A5B53] dark:text-[#94A89E]">Current Month</td>
                      <td className="py-2.5 font-bold font-mono text-right">{money(amount)}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-[#4A5B53] dark:text-[#94A89E]">Service Charge &amp; Water</td>
                      <td className="py-2.5 text-[#4A5B53] dark:text-[#94A89E]">Inclusive</td>
                      <td className="py-2.5 font-mono text-right text-[#4A5B53] dark:text-[#94A89E]">KES 0.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Total Box */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#063B2A] text-white">
                <div>
                  <p className="text-xs font-bold text-[#C9A227] uppercase tracking-wider">Total Received</p>
                  <p className="text-[11px] font-mono text-white/70">Ref: {refCode || "M-PESA"}</p>
                </div>
                <p className="font-display font-black text-2xl text-white">{money(amount)}</p>
              </div>

              {/* Verification Stamp & QR Code */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs text-[#4A5B53] dark:text-[#94A89E] border-t border-[#E2E8E4] dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white text-[#101714] shadow-sm border border-[#E2E8E4]">
                    <QrCode className="size-9" />
                  </div>
                  <div>
                    <p className="font-bold text-[#101714] dark:text-[#F7F8F5]">Scan QR for public validation</p>
                    <p className="text-[11px] font-mono text-[#087443]">www.rentreceipt.co.ke/receipt/{receiptNo}</p>
                  </div>
                </div>

                <div className="text-center sm:text-right">
                  <p className="text-[11px] font-bold text-[#101714] dark:text-[#F7F8F5]">Official Digital Stamp</p>
                  <p className="text-[10px] text-[#087443] dark:text-[#52B788] font-semibold">Signed &amp; Dispatched via WhatsApp</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
