import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { submitDemoBooking, type DemoBookingPayload } from "@/lib/feedback.functions";
import { toast } from "sonner";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Building2,
  MessageSquare,
  Sparkles,
  Phone,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";

const title = "Book a Free Live Demo — RentReceipt Pro";
const description =
  "Schedule a 15-minute personalized live demo of RentReceipt Pro. See how automated M-Pesa & KCB receipts, tenant portals, and SMS alerts simplify rental management.";

export const Route = createFileRoute("/book-demo")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://rentreceipt.co.ke/book-demo" },
    ],
    links: [{ rel: "canonical", href: "https://rentreceipt.co.ke/book-demo" }],
  }),
  component: BookDemoPage,
});

function BookDemoPage() {
  const [formData, setFormData] = useState<DemoBookingPayload>({
    fullName: "",
    email: "",
    phone: "",
    propertyName: "",
    unitsCount: "1-10",
    preferredDate: "",
    preferredTime: "morning",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone) {
      toast.error("Please fill in your name, email, and phone number.");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitDemoBooking({ data: formData });
      setIsSubmitted(true);
      toast.success("Demo request submitted! We will reach out shortly.");
    } catch (err: any) {
      console.error("Failed to book demo:", err);
      toast.error(err?.message || "Failed to submit demo request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteNav />

      <main className="flex-1">
        {/* Header / Hero */}
        <section className="relative overflow-hidden py-14 sm:py-20 border-b border-border/60 bg-gradient-to-b from-background via-muted/20 to-background">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold shadow-sm">
              <Sparkles className="size-3.5" /> 1-on-1 Interactive Product Walkthrough
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
              See RentReceipt Pro in Action
            </h1>
            <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Book a tailored 15-minute live demo with our real estate technology team. Learn how to automate M-Pesa reconciliation, issue tamper-proof PDF receipts, and manage caretakers.
            </p>
          </div>
        </section>

        {/* Content Section: Form & Value Props */}
        <section className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 items-start">
            {/* Left: What you will see */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-3">
                <h3 className="font-display text-xl font-bold text-foreground">
                  What we cover during the demo
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  We customize the session to match your current property management workflow, whether you have 3 units or 300 units.
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-card border border-border/60">
                  <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Zap className="size-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-foreground">Live M-Pesa &amp; KCB Reconciliation</h5>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      Watch how rent paid to Paybill or Till automatically generates instant digital receipts for tenants without manual logging.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-card border border-border/60">
                  <div className="size-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="size-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-foreground">Caretaker Portal &amp; Fraud Prevention</h5>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      See how caretakers log maintenance and record payments without ever having access to your bank accounts or sensitive records.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-card border border-border/60">
                  <div className="size-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Building2 className="size-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-foreground">Multi-Property Landlord Dashboard</h5>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      Explore occupancy rate metrics, overdue rent trackers, water bill meters, and PDF financial statements.
                    </p>
                  </div>
                </div>
              </div>

              {/* Instant WhatsApp Help */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-2">
                <p className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <Phone className="size-3.5" /> Need immediate assistance?
                </p>
                <p className="text-muted-foreground">
                  Our product specialists are online to answer quick questions directly via WhatsApp.
                </p>
                <a
                  href="https://wa.me/254742868209?text=Hi%2C%20I%20would%20like%20a%20quick%20walkthrough%20of%20RentReceipt%20Pro."
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-bold text-emerald-600 hover:underline"
                >
                  Chat with Team on WhatsApp →
                </a>
              </div>
            </div>

            {/* Right: The Demo Booking Form */}
            <div className="lg:col-span-7">
              <div className="surface-card p-6 sm:p-8 rounded-3xl border border-border shadow-xl bg-card">
                {isSubmitted ? (
                  <div className="text-center py-10 space-y-5">
                    <div className="size-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="size-8" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-display text-2xl font-bold text-foreground">
                        Demo Request Received!
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                        Thank you, <strong className="text-foreground">{formData.fullName}</strong>. Our onboarding team has received your demo booking and will reach out via WhatsApp/email within 2 business hours.
                      </p>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <Link to="/">
                        <Button variant="outline" className="rounded-full">
                          Back to Homepage
                        </Button>
                      </Link>
                      <a
                        href="https://wa.me/254742868209?text=Hi%2C%20I%20just%20submitted%20a%20demo%20booking%20for%20RentReceipt%20Pro."
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Button className="rounded-full gap-2 bg-emerald-600 hover:bg-emerald-700">
                          <Phone className="size-4" /> Message us on WhatsApp
                        </Button>
                      </a>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1">
                      <h3 className="font-display text-xl font-bold text-foreground">
                        Schedule Your Demo Session
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Tell us a little bit about your properties so we can prepare your walkthrough.
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="fullName" className="text-xs font-semibold">
                          Your Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="fullName"
                          required
                          placeholder="e.g. Samuel Karanja"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-xs font-semibold">
                          Phone / WhatsApp Number <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="phone"
                          required
                          placeholder="e.g. 0712 345 678"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-semibold">
                          Work / Personal Email <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          placeholder="e.g. samuel@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="propertyName" className="text-xs font-semibold">
                          Building / Estate Name
                        </Label>
                        <Input
                          id="propertyName"
                          placeholder="e.g. Kilimani Heights / Riverside"
                          value={formData.propertyName || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, propertyName: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="unitsCount" className="text-xs font-semibold">
                          Approximate Total Units
                        </Label>
                        <Select
                          value={formData.unitsCount}
                          onValueChange={(val) => setFormData({ ...formData, unitsCount: val })}
                        >
                          <SelectTrigger id="unitsCount">
                            <SelectValue placeholder="Select unit count" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-10">1 – 10 Units (Individual Landlord)</SelectItem>
                            <SelectItem value="11-30">11 – 30 Units (Multi-unit Apartments)</SelectItem>
                            <SelectItem value="31-100">31 – 100 Units (Commercial Portfolio)</SelectItem>
                            <SelectItem value="100+">100+ Units (Property Management Agency)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="preferredTime" className="text-xs font-semibold">
                          Preferred Time Slot
                        </Label>
                        <Select
                          value={formData.preferredTime}
                          onValueChange={(val: any) =>
                            setFormData({ ...formData, preferredTime: val })
                          }
                        >
                          <SelectTrigger id="preferredTime">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="morning">Morning (9:00 AM – 12:00 PM)</SelectItem>
                            <SelectItem value="afternoon">Afternoon (2:00 PM – 5:00 PM)</SelectItem>
                            <SelectItem value="evening">Evening (5:00 PM – 7:00 PM)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="preferredDate" className="text-xs font-semibold">
                        Preferred Date (Optional)
                      </Label>
                      <Input
                        id="preferredDate"
                        type="date"
                        value={formData.preferredDate || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, preferredDate: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="notes" className="text-xs font-semibold">
                        What challenges are you hoping to solve?
                      </Label>
                      <Textarea
                        id="notes"
                        rows={3}
                        placeholder="e.g. We want to stop manually checking M-Pesa SMS messages and send automated rent receipts to tenants."
                        value={formData.notes || ""}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-full py-3.5 font-bold shadow-glow text-sm gap-2"
                    >
                      {isSubmitting ? (
                        "Booking your demo..."
                      ) : (
                        <>
                          <Calendar className="size-4" /> Confirm &amp; Book Demo
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

