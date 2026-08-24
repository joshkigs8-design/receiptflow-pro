import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Palette, Sparkles, Building2 } from "lucide-react";
import { toast } from "sonner";
import { getSettings, saveSettings } from "@/lib/app.functions";
import { AppShell } from "@/components/app/AppShell";
import { Field } from "@/components/app/Field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ThemePicker, useTheme } from "@/lib/theme";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Rent Receipt Pro" },
      {
        name: "description",
        content: "Branding, currency, appearance and business details used on your receipts.",
      },
      { property: "og:title", content: "Settings — Rent Receipt Pro" },
      { property: "og:description", content: "Customise your receipt branding and theme." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const qc = useQueryClient();
  const fetchSettings = useServerFn(getSettings);
  const save = useServerFn(saveSettings);
  const { data } = useQuery({ queryKey: ["settings"], queryFn: () => fetchSettings() });
  const { mode, accent, setMode, setAccent } = useTheme();

  const [form, setForm] = useState({
    full_name: "",
    company_name: "Codevanta Ventures",
    logo_url: "",
    phone: "",
    currency: "KSh",
    business_details: "",
  });

  useEffect(() => {
    if (!data) return;
    setForm({
      full_name: data.full_name ?? "",
      company_name: data.company_name ?? "Codevanta Ventures",
      logo_url: data.logo_url ?? "",
      phone: data.phone ?? "",
      currency: data.currency ?? "KSh",
      business_details: data.business_details ?? "",
    });
  }, [data]);

  const mutation = useMutation({
    mutationFn: () => save({ data: form }),
    onSuccess: () => {
      toast.success("Branding settings saved");
      qc.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (e: Error) => toast.error(e.message || "Could not save settings"),
  });

  return (
    <AppShell title="Settings" description="Customize appearance, theme and receipt branding">
      <div className="max-w-3xl space-y-6">
        {/* 1. APPEARANCE & THEME CARD */}
        <div className="surface-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="gradient-primary flex size-8 items-center justify-center rounded-xl text-primary-foreground shadow-glow">
                <Palette className="size-4" />
              </span>
              <div>
                <h3 className="font-display font-bold text-base">Appearance &amp; Theme</h3>
                <p className="text-xs text-muted-foreground">
                  Choose your preferred display mode and brand color palette
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-primary flex items-center gap-1">
              <Sparkles className="size-3.5" /> Instant Live Apply
            </span>
          </div>

          <ThemePicker
            valueMode={mode}
            valueAccent={accent}
            onChange={(m, a) => {
              setMode(m);
              setAccent(a);
              toast.success(`Theme updated to ${a.toUpperCase()} (${m})`, { duration: 1800 });
            }}
          />
        </div>

        {/* 2. RECEIPT BRANDING & BUSINESS DETAILS */}
        <form
          className="surface-card grid gap-4 p-6 rounded-3xl sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
        >
          <div className="sm:col-span-2 flex items-center gap-2.5 border-b border-border/60 pb-3">
            <span className="gradient-primary flex size-8 items-center justify-center rounded-xl text-primary-foreground shadow-glow">
              <Building2 className="size-4" />
            </span>
            <div>
              <h3 className="font-display font-bold text-base">Receipt Branding &amp; Details</h3>
              <p className="text-xs text-muted-foreground">
                These details will appear on official QR-verified PDF receipts
              </p>
            </div>
          </div>

          <Field label="Your name" htmlFor="fn">
            <Input
              id="fn"
              maxLength={120}
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            />
          </Field>
          <Field label="Company / brand" htmlFor="cn">
            <Input
              id="cn"
              required
              maxLength={120}
              value={form.company_name}
              onChange={(e) => setForm({ ...form, company_name: e.target.value })}
            />
          </Field>
          <Field label="Phone" htmlFor="ph">
            <Input
              id="ph"
              maxLength={24}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </Field>
          <Field label="Currency" htmlFor="cur">
            <Input
              id="cur"
              required
              maxLength={8}
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
            />
          </Field>
          <Field label="Logo URL" htmlFor="logo" className="sm:col-span-2">
            <Input
              id="logo"
              maxLength={600}
              placeholder="https://…"
              value={form.logo_url}
              onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
            />
          </Field>
          <Field label="Business details (address, KRA PIN…)" className="sm:col-span-2">
            <Textarea
              maxLength={1000}
              rows={4}
              value={form.business_details}
              onChange={(e) => setForm({ ...form, business_details: e.target.value })}
            />
          </Field>
          <div className="sm:col-span-2 pt-2">
            <Button type="submit" className="rounded-full shadow-glow" disabled={mutation.isPending}>
              Save Branding Settings
            </Button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
