"use client";

import {
  CheckCircle,
  Loader2,
  Building2,
  Copy,
  Download,
  FileCheck2,
  MessageCircle,
  Printer,
  QrCode,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  type ComponentPropsWithoutRef,
  createContext,
  type ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import { cn } from "@/lib/utils";
import { money, shortDate } from "@/lib/format";
import { PLANS, type PlanKey } from "@/lib/plans";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  buildSubscriptionReceiptPdf,
  type SubscriptionPaymentRecord,
  type LandlordProfileInfo,
} from "@/lib/subscription-receipt-pdf";

export type ReceiptPrinterStage = "processing" | "printing" | "complete";
export type ReceiptFeedMotion = "smooth" | "stepped";

export type ReceiptPrinterRootProps = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  animate?: boolean;
  children: ReactNode;
  feedMotion?: ReceiptFeedMotion;
  stage: ReceiptPrinterStage;
};

export type ReceiptPrinterMachineProps = ComponentPropsWithoutRef<"div">;
export type ReceiptPrinterHeaderProps = ComponentPropsWithoutRef<"div">;
export type ReceiptPrinterScreenProps = ComponentPropsWithoutRef<"div">;
export type ReceiptPrinterOutputProps = ComponentPropsWithoutRef<"div">;
export type ReceiptPrinterPaperProps = ComponentPropsWithoutRef<"article">;

export type ReceiptPrinterStatusProps = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  children?: ReactNode;
};

type ReceiptPrinterContextValue = {
  animate: boolean;
  feedMotion: ReceiptFeedMotion;
  shouldMove: boolean;
  stage: ReceiptPrinterStage;
};

const ReceiptPrinterContext = createContext<ReceiptPrinterContextValue | null>(null);

const easeOut = [0.23, 1, 0.32, 1] as const;
const easeInOut = [0.77, 0, 0.175, 1] as const;

const receiptToothCount = 40;
const receiptToothDepth = 4;
const receiptToothPoints = Array.from(
  { length: receiptToothCount * 2 },
  (_, index) => {
    const x = 100 - ((index + 1) * 100) / (receiptToothCount * 2);
    const y = index % 2 === 0 ? "100%" : `calc(100% - ${receiptToothDepth}px)`;
    return `${x}% ${y}`;
  },
).join(", ");
const receiptClipPath = `polygon(0 0, 100% 0, 100% calc(100% - ${receiptToothDepth}px), ${receiptToothPoints})`;

const printingTransformKeyframes = [
  "translateY(calc(-100% + 2px))",
  "translateY(-91%)",
  "translateY(-91%)",
  "translateY(-81%)",
  "translateY(-81%)",
  "translateY(-70%)",
  "translateY(-70%)",
  "translateY(-58%)",
  "translateY(-58%)",
  "translateY(-45%)",
  "translateY(-45%)",
  "translateY(-32%)",
  "translateY(-32%)",
  "translateY(-20%)",
  "translateY(-20%)",
  "translateY(-10%)",
  "translateY(-10%)",
  "translateY(-3%)",
  "translateY(-3%)",
  "translateY(0%)",
];

const printingKeyframeTimes = [
  0, 0.075, 0.105, 0.18, 0.21, 0.285, 0.315, 0.39, 0.42, 0.495, 0.525, 0.6,
  0.63, 0.705, 0.735, 0.81, 0.84, 0.915, 0.945, 1,
];

const statusLabels: Record<ReceiptPrinterStage, ReactNode> = {
  processing: "Processing payment confirmation",
  printing: "Printing digital tax receipt",
  complete: "Receipt verified & ready",
};

const machineClassName =
  "relative isolate w-full overflow-hidden rounded-[1.5rem] border border-slate-700 bg-gradient-to-b from-[#0F172A] to-[#0B1220] p-3 pb-8 shadow-2xl before:pointer-events-none before:absolute before:inset-0 before:z-0 before:rounded-[inherit] before:opacity-30 before:mix-blend-multiply before:content-['']";

function useReceiptPrinter(component: string) {
  const context = useContext(ReceiptPrinterContext);
  if (!context) {
    throw new Error(`${component} must be used inside ReceiptPrinter.Root.`);
  }
  return context;
}

export function ReceiptPrinterRoot({
  "aria-label": ariaLabel = "Receipt printer",
  animate = true,
  children,
  className,
  feedMotion = "stepped",
  stage,
  ...props
}: ReceiptPrinterRootProps) {
  const shouldReduceMotion = useReducedMotion();
  const context = {
    animate,
    feedMotion,
    shouldMove: animate && !shouldReduceMotion,
    stage,
  };

  return (
    <ReceiptPrinterContext.Provider value={context}>
      <section
        aria-label={ariaLabel}
        className={cn(
          "relative isolate flex w-full max-w-md flex-col items-center mx-auto",
          className,
        )}
        data-stage={stage}
        {...props}
      >
        {children}
      </section>
    </ReceiptPrinterContext.Provider>
  );
}

export function ReceiptPrinterMachine({
  children,
  className,
  ...props
}: ReceiptPrinterMachineProps) {
  return (
    <div className={cn(machineClassName, className)} {...props}>
      {children}
      <div
        aria-hidden="true"
        className="absolute inset-x-6 bottom-3 z-40 h-2 rounded-[0.25rem] border border-slate-800 bg-slate-950 shadow-inner"
      />
    </div>
  );
}

export function ReceiptPrinterHeader({
  children,
  className,
  ...props
}: ReceiptPrinterHeaderProps) {
  return (
    <div
      className={cn(
        "relative z-10 flex h-10 items-center justify-between px-1 mb-2",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function ReceiptPrinterScreen({
  children,
  className,
  ...props
}: ReceiptPrinterScreenProps) {
  return (
    <div
      className={cn(
        "relative z-10 isolate overflow-hidden rounded-xl border border-slate-800 bg-slate-950/90 p-4 text-slate-100 shadow-inner font-sans",
        className,
      )}
      {...props}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function StatusIndicator({
  animate,
  stage,
}: {
  animate: boolean;
  move: boolean;
  stage: ReceiptPrinterStage;
}) {
  const isComplete = stage === "complete";

  return (
    <span
      aria-hidden="true"
      className="relative grid size-5 shrink-0 place-items-center"
    >
      <AnimatePresence initial={false} mode="sync">
        {isComplete ? (
          <motion.span
            animate={{ opacity: 1, transform: "scale(1)" }}
            className="col-start-1 row-start-1 grid place-items-center text-emerald-400"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0, transform: "scale(0.9)" }}
            key="complete"
            transition={{ duration: 0.16, ease: easeOut }}
          >
            <CheckCircle size={18} className="fill-emerald-500/20 text-emerald-400" />
          </motion.span>
        ) : (
          <motion.span
            animate={{ opacity: 1, transform: "scale(1)" }}
            className="col-start-1 row-start-1 grid place-items-center text-amber-400"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0, transform: "scale(0.9)" }}
            key="working"
            transition={{ duration: 0.16, ease: easeOut }}
          >
            <Loader2
              className={cn("size-4 animate-spin")}
            />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

export function ReceiptPrinterStatus({
  children,
  className,
  ...props
}: ReceiptPrinterStatusProps) {
  const { animate, shouldMove, stage } = useReceiptPrinter(
    "ReceiptPrinter.Status",
  );

  return (
    <div
      className={cn("flex min-w-0 items-center gap-2", className)}
      {...props}
    >
      <StatusIndicator animate={animate} move={shouldMove} stage={stage} />
      <div
        aria-live="polite"
        className="grid min-w-0 flex-1 items-center"
        role="status"
      >
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            className="col-start-1 row-start-1 truncate font-medium text-slate-300 text-xs leading-none"
            exit={{ opacity: 0, transform: "translateY(-4px)" }}
            initial={{ opacity: 0, transform: "translateY(4px)" }}
            key={stage}
            transition={{ duration: 0.18, ease: easeOut }}
          >
            {children ?? statusLabels[stage]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export function ReceiptPrinterPaper({
  children,
  className,
  style,
  ...props
}: ReceiptPrinterPaperProps) {
  return (
    <article
      className={cn(
        "relative z-10 min-h-80 bg-[#FAFAFA] text-[#0F172A] p-6 pb-10 font-mono text-xs shadow-2xl border-x border-slate-200",
        className,
      )}
      style={{ clipPath: receiptClipPath, ...style }}
      {...props}
    >
      {children}
    </article>
  );
}

export function ReceiptPrinterOutput({
  children,
  className,
  ...props
}: ReceiptPrinterOutputProps) {
  const { animate, feedMotion, shouldMove, stage } = useReceiptPrinter(
    "ReceiptPrinter.Output",
  );
  const isReceiptVisible = stage !== "processing";
  const shouldUseSteppedFeed =
    feedMotion === "stepped" && stage === "printing" && shouldMove;

  return (
    <div
      className={cn(
        "relative z-30 -mt-4 w-[calc(90%+1rem)] max-w-full overflow-hidden px-2",
        className,
      )}
      {...props}
    >
      {isReceiptVisible ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-4 -top-1 z-20 h-2 bg-slate-900/60 blur-[4px]"
        />
      ) : null}

      <motion.div
        animate={{
          opacity: isReceiptVisible ? 1 : 0,
          transform:
            stage === "printing" && shouldMove
              ? shouldUseSteppedFeed
                ? printingTransformKeyframes
                : "translateY(0%)"
              : isReceiptVisible || !shouldMove
                ? "translateY(0%)"
                : "translateY(calc(-100% + 2px))",
        }}
        aria-hidden={stage !== "complete"}
        className="relative isolate shadow-xl"
        initial={false}
        transition={{
          opacity: { duration: animate ? 0.16 : 0, ease: easeOut },
          transform: shouldUseSteppedFeed
            ? { duration: shouldMove ? 1.75 : 0, ease: "linear", times: printingKeyframeTimes }
            : { duration: shouldMove ? 1.75 : 0, ease: easeInOut },
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export const ReceiptPrinter = {
  Header: ReceiptPrinterHeader,
  Machine: ReceiptPrinterMachine,
  Output: ReceiptPrinterOutput,
  Paper: ReceiptPrinterPaper,
  Root: ReceiptPrinterRoot,
  Screen: ReceiptPrinterScreen,
  Status: ReceiptPrinterStatus,
};

/**
 * High-performance animated Subscription Receipt Printer Component
 */
export function SubscriptionReceiptPrinter({
  payment,
  landlord,
  autoAnimate = true,
  onDownload,
}: {
  payment: SubscriptionPaymentRecord;
  landlord?: LandlordProfileInfo;
  autoAnimate?: boolean;
  onDownload?: () => void;
}) {
  const [stage, setStage] = useState<ReceiptPrinterStage>(
    autoAnimate ? "printing" : "complete",
  );
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!autoAnimate) return;
    const timer = setTimeout(() => {
      setStage("complete");
    }, 1900);
    return () => clearTimeout(timer);
  }, [autoAnimate]);

  const planKey = (payment.plan in PLANS ? payment.plan : "monthly") as PlanKey;
  const planDetails = PLANS[planKey] ?? { label: payment.plan.toUpperCase(), periodLabel: "month" };
  const receiptNo = `RRP-SUB-${payment.reference.replace(/[^a-zA-Z0-9]/g, "").slice(-8).toUpperCase()}`;
  const dateFormatted = shortDate(payment.paid_at ?? payment.created_at);

  async function handleDownload() {
    try {
      setDownloading(true);
      const doc = await buildSubscriptionReceiptPdf(payment, landlord);
      doc.save(`RentReceiptPro_Subscription_Receipt_${payment.reference}.pdf`);
      toast.success("Subscription PDF receipt downloaded");
      onDownload?.();
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate PDF");
    } finally {
      setDownloading(false);
    }
  }

  function handleShareWhatsApp() {
    const msg = encodeURIComponent(
      `Official RentReceiptPro Subscription Receipt:\nReceipt #: ${receiptNo}\nPlan: ${planDetails.label}\nAmount: ${money(payment.amount)}\nRef: ${payment.reference}\nStatus: PAID & SETTLED\nIssued by Codevanta Ventures`,
    );
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  }

  return (
    <div className="w-full space-y-4">
      <ReceiptPrinter.Root stage={stage}>
        {/* Physical Machine Housing */}
        <ReceiptPrinter.Machine>
          <ReceiptPrinter.Header>
            <div className="flex items-center gap-2">
              <span className="gradient-primary flex size-6 items-center justify-center rounded-lg shadow-sm">
                <Building2 className="size-3.5 text-white" />
              </span>
              <span className="font-display text-xs font-bold text-white tracking-wide">
                RentReceiptPro Terminal
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700">
              {receiptNo}
            </span>
          </ReceiptPrinter.Header>

          {/* LCD Status Screen */}
          <ReceiptPrinter.Screen>
            <div className="space-y-2.5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold text-white">
                    {planDetails.label} Subscription
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Paystack · Ref: {payment.reference.slice(-10)}
                  </p>
                </div>
                <strong className="font-mono text-sm text-[#FFB020] font-bold">
                  {money(payment.amount)}
                </strong>
              </div>
              <div className="pt-1 border-t border-slate-800">
                <ReceiptPrinter.Status />
              </div>
            </div>
          </ReceiptPrinter.Screen>
        </ReceiptPrinter.Machine>

        {/* Paper Feeding Output with Jagged Tear-off Edge */}
        <ReceiptPrinter.Output>
          <ReceiptPrinter.Paper>
            <div className="text-center space-y-1 pb-3 border-b border-dashed border-slate-300">
              <h3 className="font-bold text-sm tracking-wider text-slate-900">
                RENTRECEIPTPRO
              </h3>
              <p className="text-[10px] text-slate-500">
                Codevanta Ventures · Tax Receipt
              </p>
              <p className="text-[10px] text-slate-500 font-mono">
                {receiptNo} · {dateFormatted}
              </p>
            </div>

            <div className="py-3 space-y-1.5 text-[11px] border-b border-dashed border-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Subscriber:</span>
                <span className="font-bold text-slate-800 truncate max-w-[170px]">
                  {landlord?.company_name || landlord?.full_name || "Landlord"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Service:</span>
                <span className="text-slate-800">{planDetails.label} Plan</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Gateway:</span>
                <span className="text-slate-800">Paystack Checkout</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ref:</span>
                <span className="font-mono text-[10px] text-slate-700">{payment.reference}</span>
              </div>
            </div>

            <div className="py-3 space-y-1 text-xs">
              <div className="flex justify-between font-semibold">
                <span>Subtotal</span>
                <span>{money(payment.amount)}</span>
              </div>
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>VAT / Tax (0%)</span>
                <span>KSh 0.00</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-slate-900 pt-1.5 border-t border-slate-300">
                <span>TOTAL PAID</span>
                <span className="text-[#FF7A00]">{money(payment.amount)}</span>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-dashed border-slate-300 text-center space-y-1">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                <CheckCircle className="size-3" /> OFFICIAL DIGITAL STAMP
              </span>
              <p className="text-[9px] text-slate-400">
                Retain this receipt for business accounting &amp; tax filing.
              </p>
            </div>
          </ReceiptPrinter.Paper>
        </ReceiptPrinter.Output>
      </ReceiptPrinter.Root>

      {/* Action Buttons Under Printer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
        <Button
          className="rounded-full shadow-glow font-bold text-xs gap-1.5 w-full h-10"
          disabled={downloading}
          onClick={handleDownload}
        >
          {downloading ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
          Download PDF
        </Button>
        <Button
          variant="outline"
          className="rounded-full text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 font-semibold text-xs gap-1.5 w-full h-10"
          onClick={handleShareWhatsApp}
        >
          <MessageCircle className="size-3.5" /> WhatsApp
        </Button>
        <Button
          variant="outline"
          className="rounded-full text-xs gap-1.5 w-full h-10"
          onClick={() => {
            void navigator.clipboard.writeText(payment.reference);
            toast.success("Payment reference copied to clipboard");
          }}
        >
          <Copy className="size-3.5" /> Copy Ref
        </Button>
      </div>
    </div>
  );
}
