import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getSettings, saveSettings } from "@/lib/app.functions";
import { AppShell } from "@/components/app/AppShell";
import { Field } from "@/components/app/Field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Rent Receipt Pro" },
      { name: "description", content: "Branding, currency and business details used on your receipts." },
      { property: "og:title", content: "Settings — Rent Receipt Pro" },
      { property: "og:description", content: "Customise your receipt branding." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const qc = useQueryClient();
  const fetchSettings = useServerFn(getSettings);
  const save = useServerFn(saveSettings);
  const { data } = useQuery({ queryKey: ["settings"], queryFn: () => fetchSettings() });

  const [form, setForm] = useState({
    full_name: "",
    company_name: "Crossbridge",
    logo_url: "",
    phone: "",
    currency: "KSh",
    business_details: "",
  });

  useEffect(() => {
    if (!data) return;
    setForm({
      full_name: data.full_name ?? "",
      company_name: data.company_name ?? "Crossbridge",
      logo_url: data.logo_url ?? "",
      phone: data.phone ?? "",
      currency: data.currency ?? "KSh",
      business_details: data.business_details ?? "",
    });
  }, [data]);

  const mutation = useMutation({
    mutationFn: () => save({ data: form }),
    onSuccess: () => {
      toast.success("Settings saved");
      qc.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (e: Error) => toast.error(e.message || "Could not save settings"),
  });

  return (
    <AppShell title="Settings" description="Branding shown on every receipt">
      <form
        className="surface-card grid max-w-3xl gap-4 p-6 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate();
        }}
      >
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
        <div className="sm:col-span-2">
          <Button type="submit" className="rounded-full shadow-glow" disabled={mutation.isPending}>
            Save settings
          </Button>
        </div>
      </form>
    </AppShell>
  );
}