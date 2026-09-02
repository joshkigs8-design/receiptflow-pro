import { useState, useEffect } from "react";
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
import {
  submitSiteMessage,
  getPublicComments,
  type SiteMessagePayload,
} from "@/lib/feedback.functions";
import { toast } from "sonner";
import {
  Send,
  MessageSquare,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Star,
  CheckCircle2,
  ThumbsUp,
  MessageCircle,
  HelpCircle,
  Clock,
} from "lucide-react";

const title = "Contact Us & Leave Comments — RentReceipt Pro";
const description =
  "Have a question, feedback, or suggestion? Send us a message or leave a comment for the RentReceipt Pro engineering and customer support team.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://rentreceipt.co.ke/contact" },
    ],
    links: [{ rel: "canonical", href: "https://rentreceipt.co.ke/contact" }],
  }),
  component: ContactAndCommentsPage,
});

function ContactAndCommentsPage() {
  const [formData, setFormData] = useState<SiteMessagePayload>({
    senderName: "",
    email: "",
    phone: "",
    category: "general",
    subject: "",
    message: "",
    rating: 5,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);

  useEffect(() => {
    getPublicComments()
      .then((data) => setComments(data))
      .catch((err) => console.error("Error loading comments:", err))
      .finally(() => setLoadingComments(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.senderName || !formData.email || !formData.message) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitSiteMessage({ data: formData });
      setIsSubmitted(true);
      toast.success("Thank you! Your message/comment has been delivered.");
    } catch (err: any) {
      console.error("Error sending message:", err);
      toast.error(err?.message || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteNav />

      <main className="flex-1">
        {/* Hero Header */}
        <section className="relative overflow-hidden py-14 sm:py-20 border-b border-border/60 bg-gradient-to-b from-background via-muted/20 to-background">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold shadow-sm">
              <MessageSquare className="size-3.5" /> Direct Support &amp; Feedback Channel
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
              Send a Message &amp; Share Comments
            </h1>
            <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We love hearing from landlords, tenants, caretakers, and property managers. Let us know how we can help or how we can make RentReceipt Pro even better.
            </p>
          </div>
        </section>

        {/* Content Section: Form & Direct Reach */}
        <section className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 items-start">
            {/* Left: Quick Contact Info */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-3">
                <h3 className="font-display text-xl font-bold text-foreground">
                  Get in Touch Directly
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Our Nairobi-based support team responds to inquiries promptly during business hours (Monday – Saturday, 8:00 AM – 7:00 PM EAT).
                </p>
              </div>

              <div className="space-y-4">
                <a
                  href="https://wa.me/254742868209"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border/60 hover:border-emerald-500/40 transition-colors group"
                >
                  <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <MessageCircle className="size-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-foreground text-sm">WhatsApp Live Chat</h5>
                    <p className="text-muted-foreground text-xs mt-0.5">+254 742 868 209</p>
                    <p className="text-[11px] text-emerald-600 font-semibold mt-1">Instant replies for landlords &amp; tenants</p>
                  </div>
                </a>

                <a
                  href="mailto:support@rentreceipt.co.ke"
                  className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border/60 hover:border-primary/40 transition-colors group"
                >
                  <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Mail className="size-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-foreground text-sm">Email Support</h5>
                    <p className="text-muted-foreground text-xs mt-0.5">support@rentreceipt.co.ke</p>
                    <p className="text-[11px] text-primary font-semibold mt-1">Response within 2 hours</p>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border/60">
                  <div className="size-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                    <MapPin className="size-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-foreground text-sm">Headquarters</h5>
                    <p className="text-muted-foreground text-xs mt-0.5">Nairobi, Kenya</p>
                    <p className="text-[11px] text-muted-foreground mt-1">Serving clients across all 47 counties</p>
                  </div>
                </div>
              </div>

              {/* Book a Demo Banner */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 space-y-3">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="size-3.5" /> Need a Walkthrough?
                </div>
                <h4 className="font-display text-base font-bold text-foreground">
                  Want to see how it works for your buildings?
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Schedule a live interactive 15-minute demo with our product team.
                </p>
                <Link to="/book-demo">
                  <Button size="sm" className="rounded-full gap-1.5 font-bold mt-1 text-xs">
                    Book a Free Demo →
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right: Message / Comment Form */}
            <div className="lg:col-span-7">
              <div className="surface-card p-6 sm:p-8 rounded-3xl border border-border shadow-xl bg-card">
                {isSubmitted ? (
                  <div className="text-center py-10 space-y-5">
                    <div className="size-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                      <CheckCircle2 className="size-8" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-display text-2xl font-bold text-foreground">
                        Message Received!
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                        Thank you, <strong className="text-foreground">{formData.senderName}</strong>. Your comment and message have been sent to our team. If you requested a reply, we will email you at <strong className="text-foreground">{formData.email}</strong>.
                      </p>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <Button
                        variant="outline"
                        className="rounded-full"
                        onClick={() => {
                          setIsSubmitted(false);
                          setFormData({
                            senderName: "",
                            email: "",
                            phone: "",
                            category: "general",
                            subject: "",
                            message: "",
                            rating: 5,
                          });
                        }}
                      >
                        Send Another Message
                      </Button>
                      <Link to="/">
                        <Button className="rounded-full">Back to Home</Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1">
                      <h3 className="font-display text-xl font-bold text-foreground">
                        Leave a Comment or Send a Message
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Feel free to share suggestions, ask questions, or review your experience.
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="senderName" className="text-xs font-semibold">
                          Your Full Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="senderName"
                          required
                          placeholder="e.g. Grace Wambui"
                          value={formData.senderName}
                          onChange={(e) =>
                            setFormData({ ...formData, senderName: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-semibold">
                          Your Email <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          placeholder="e.g. grace@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-xs font-semibold">
                          Phone / WhatsApp Number (Optional)
                        </Label>
                        <Input
                          id="phone"
                          placeholder="e.g. 0722 000 000"
                          value={formData.phone || ""}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="category" className="text-xs font-semibold">
                          Message Category
                        </Label>
                        <Select
                          value={formData.category}
                          onValueChange={(val: any) =>
                            setFormData({ ...formData, category: val })
                          }
                        >
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Inquiry</SelectItem>
                            <SelectItem value="comment">Visitor Comment / Review</SelectItem>
                            <SelectItem value="feedback">Product Feedback</SelectItem>
                            <SelectItem value="feature_request">Feature Request</SelectItem>
                            <SelectItem value="support">Customer / Technical Support</SelectItem>
                            <SelectItem value="partnership">Partnership &amp; Agent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="subject" className="text-xs font-semibold">
                        Subject (Optional)
                      </Label>
                      <Input
                        id="subject"
                        placeholder="e.g. Inquiry regarding KCB integration / Feedback on receipts"
                        value={formData.subject || ""}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      />
                    </div>

                    {/* Star Rating for Feedback/Comments */}
                    {(formData.category === "comment" || formData.category === "feedback") && (
                      <div className="space-y-1.5 p-3 rounded-xl bg-muted/30 border border-border/60">
                        <Label className="text-xs font-semibold">Your Rating</Label>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setFormData({ ...formData, rating: star })}
                              className="text-amber-500 hover:scale-110 transition-transform"
                            >
                              <Star
                                className={`size-5 ${
                                  (formData.rating || 5) >= star
                                    ? "fill-amber-500 text-amber-500"
                                    : "text-muted-foreground"
                                }`}
                              />
                            </button>
                          ))}
                          <span className="text-xs text-muted-foreground ml-2">
                            {formData.rating} out of 5 stars
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <Label htmlFor="message" className="text-xs font-semibold">
                        Your Message or Comment <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        required
                        rows={4}
                        placeholder="Write your comments, feedback, or question here..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-full py-3.5 font-bold shadow-glow text-sm gap-2"
                    >
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="size-4" /> Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Public Feedback / Testimonials Showcase (if any approved comments) */}
        {comments && comments.length > 0 && (
          <section className="py-12 border-t border-border/60 bg-muted/10">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="text-center space-y-2">
                <h3 className="font-display text-xl font-bold text-foreground">
                  What Landlords &amp; Property Managers Say
                </h3>
                <p className="text-xs text-muted-foreground">
                  Recent reviews and comments shared by our community
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {comments.map((c) => (
                  <div
                    key={c.id}
                    className="p-5 rounded-2xl bg-card border border-border/60 space-y-3 shadow-sm"
                  >
                    {c.rating && (
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: c.rating }).map((_, i) => (
                          <Star key={i} className="size-3.5 fill-amber-500 text-amber-500" />
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-foreground/90 italic leading-relaxed">
                      "{c.message}"
                    </p>
                    <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="font-semibold text-foreground">{c.sender_name}</span>
                      <span>
                        {new Date(c.created_at).toLocaleDateString("en-GB", {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}

