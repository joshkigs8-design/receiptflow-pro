import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";

export const faqsList = [
  {
    q: "How does RentReceiptPro generate verified digital rent receipts?",
    a: "When a landlord records a rent payment (via M-Pesa, bank, cash, or cheque), RentReceiptPro automatically creates an official branded PDF receipt complete with a cryptographic QR code and unique receipt ID. The receipt is permanently recorded on our registry for instant verification.",
  },
  {
    q: "Can tenants download their receipts without creating an account?",
    a: "Yes! Tenants simply visit the Tenant Portal (/tenant), enter their Property Code, Room/Unit Number, and Phone Number, and get instant access to all their verified PDF receipts, rental balances, and maintenance tickets.",
  },
  {
    q: "Does RentReceiptPro support M-Pesa payments in Kenya?",
    a: "Yes. You can record M-Pesa confirmation codes (Paybill, Till, or Send Money), bank transactions, and cash payments. Invoices and receipts display the M-Pesa reference and timestamp for 100% dispute-free accounting.",
  },
  {
    q: "What are the pricing plans and is there a free trial?",
    a: "All new accounts receive a full 14-day free trial with zero credit card required. Afterwards, plans are KSh 400 monthly, KSh 1,100 quarterly, KSh 2,100 semi-annually, or KSh 4,000 yearly for unlimited properties, units, and receipts.",
  },
  {
    q: "How does the Affiliate Program work?",
    a: "Anyone can join the RentReceiptPro Affiliate Program for free. Share your unique referral link with landlords, caretakers, or agents. You earn KSh 50 for every paying landlord referral, paid directly to your M-Pesa with 24-hour withdrawal processing.",
  },
  {
    q: "Can I use RentReceiptPro on my mobile phone?",
    a: "Yes! RentReceiptPro is fully mobile-optimized for smartphones, tablets, laptops, and desktop computers. You can issue receipts directly from your phone while on-site at your property.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 bg-muted/20 border-t border-border/60 overflow-hidden">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center">
          <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold text-primary">
            <HelpCircle className="size-3.5 text-primary" /> Common Questions
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold sm:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground">
            Everything you need to know about digital rent receipts, tenant management, and pricing.
          </p>
        </div>

        <div className="mt-14 space-y-3.5">
          {faqsList.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.q}
                className="surface-card rounded-2xl border border-border/80 overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-5 sm:p-6 text-left font-display text-base font-bold text-foreground hover:text-primary transition-colors gap-4"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`size-5 shrink-0 text-muted-foreground transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-5 pb-6 sm:px-6 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
