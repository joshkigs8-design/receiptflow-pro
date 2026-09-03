import { useState } from "react";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";

export const faqsList = [
  {
    q: "How does RentReceipt Pro generate verified digital rent receipts?",
    a: "When a landlord records a rent payment (via M-PESA, bank, cash, or cheque), RentReceipt Pro automatically creates an official branded PDF receipt complete with a cryptographic QR code and unique receipt ID. The receipt is permanently recorded on our registry for instant public verification.",
  },
  {
    q: "Can tenants download their receipts without creating an account?",
    a: "Yes! Tenants simply visit the Tenant Portal (/tenant), enter their Phone Number, and get instant access to all their verified PDF receipts, rental balances, and maintenance tickets.",
  },
  {
    q: "Does RentReceipt Pro support M-PESA payments in Kenya?",
    a: "Yes. You can record M-PESA confirmation codes (Paybill, Till, or Send Money), bank transactions, and cash payments. Invoices and receipts display the M-PESA reference and timestamp for 100% dispute-free accounting.",
  },
  {
    q: "What are the pricing plans and is there a free trial?",
    a: "All new accounts receive a full 1-month free trial with zero credit card required. Afterwards, standard plans are KES 1,200 monthly (with a special KES 400 first-time user offer), KES 1,100 quarterly, KES 2,100 semi-annually, or KES 4,000 yearly for unlimited properties, units, and receipts.",
  },
  {
    q: "How does the Done-For-You Data Setup work?",
    a: "If you have handwritten receipt notebooks or Excel sheets, you can send them to our WhatsApp team (0742868209). We will structure, verify, and load all your properties, units, and tenant ledgers into your account within 2 hours.",
  },
  {
    q: "Can I use RentReceipt Pro on my mobile phone?",
    a: "Yes! RentReceipt Pro is fully mobile-optimized for smartphones, tablets, laptops, and desktop computers. You can issue receipts directly from your phone while on-site at your property.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-28 bg-[#F7F8F5] dark:bg-[#061A13] border-t border-[#E2E8E4] dark:border-white/10 overflow-hidden">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center space-y-3 mb-16">
          <span className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold text-[#063B2A] dark:text-[#52B788] bg-[#E8F2ED] dark:bg-[#0D3528] border border-[#063B2A]/10 dark:border-white/10">
            <HelpCircle className="size-3.5 text-[#C9A227]" /> Frequently Asked Questions
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-[#101714] dark:text-[#F7F8F5]">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <p className="text-base sm:text-lg text-[#4A5B53] dark:text-[#94A89E]">
            Everything you need to know about digital rent receipts, tenant management, and pricing.
          </p>
        </div>

        <div className="space-y-3.5">
          {faqsList.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.q}
                className="rounded-2xl bg-[#FFFFFF] dark:bg-[#0A261D] border border-[#E2E8E4] dark:border-white/10 overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-5 text-left text-sm font-bold text-[#101714] dark:text-[#F7F8F5] hover:text-[#087443] transition-colors"
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`size-4 shrink-0 text-[#4A5B53] dark:text-[#94A89E] transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#087443]" : ""
                    }`}
                  />
                </button>

                {isOpen ? (
                  <div className="px-5 pb-5 pt-1 text-xs text-[#4A5B53] dark:text-[#94A89E] leading-relaxed border-t border-[#E2E8E4] dark:border-white/10">
                    <p>{faq.a}</p>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
