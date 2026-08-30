import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Palette, Sparkles, Building2, Smartphone, ShieldCheck, CheckCircle2, AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { getSettings, saveSettings } from "@/lib/app.functions";
import {
  getLandlordMpesaSettings,
  saveLandlordMpesaSettings,
  testLandlordMpesaConnection,
} from "@/lib/mpesa.functions";
import { AppShell } from "@/components/app/AppShell";
import { Field } from "@/components/app/Field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const fetchMpesaSettings = useServerFn(getLandlordMpesaSettings);
  const saveMpesa = useServerFn(saveLandlordMpesaSettings);
  const testMpesa = useServerFn(testLandlordMpesaConnection);

  const { data } = useQuery({ queryKey: ["settings"], queryFn: () => fetchSettings() });
  const { data: mpesaData, isLoading: isMpesaLoading } = useQuery({
    queryKey: ["landlord_mpesa_settings"],
    queryFn: () => fetchMpesaSettings(),
  });

  const { mode, accent, setMode, setAccent } = useTheme();

  const [form, setForm] = useState({
    full_name: "",
    company_name: "Codevanta Ventures",
    logo_url: "",
    phone: "",
    currency: "KSh",
    business_details: "",
  });

  const [mpesaForm, setMpesaForm] = useState({
    shortcode: "",
    consumer_key: "",
    consumer_secret: "",
    passkey: "",
    environment: "sandbox" as "sandbox" | "production",
    transaction_type: "CustomerPayBillOnline" as "CustomerPayBillOnline" | "CustomerBuyGoodsOnline",
    account_reference_prefix: "RRP",
    is_active: true,
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

  useEffect(() => {
    if (!mpesaData) return;
    setMpesaForm({
      shortcode: mpesaData.shortcode || "",
      consumer_key: mpesaData.consumer_key || "",
      consumer_secret: mpesaData.consumer_secret_masked || "",
      passkey: mpesaData.passkey_masked || "",
      environment: mpesaData.environment || "sandbox",
      transaction_type: mpesaData.transaction_type || "CustomerPayBillOnline",
      account_reference_prefix: mpesaData.account_reference_prefix || "RRP",
      is_active: mpesaData.is_active ?? true,
    });
  }, [mpesaData]);

  const mutation = useMutation({
    mutationFn: () => save({ data: form }),
    onSuccess: () => {
      toast.success("Branding settings saved");
      qc.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (e: Error) => toast.error(e.message || "Could not save settings"),
  });

  const mpesaMutation = useMutation({
    mutationFn: () => saveMpesa({ data: mpesaForm }),
    onSuccess: () => {
      toast.success("M-Pesa Daraja configuration saved!");
      qc.invalidateQueries({ queryKey: ["landlord_mpesa_settings"] });
    },
    onError: (e: Error) => toast.error(e.message || "Could not save M-Pesa settings"),
  });

  const testConnectionMutation = useMutation({
    mutationFn: () =>
      testMpesa({
        data: {
          consumer_key: mpesaForm.consumer_key,
          consumer_secret: mpesaForm.consumer_secret,
          environment: mpesaForm.environment,
        },
      }),
    onSuccess: (res) => {
      toast.success(res.message);
    },
    onError: (e: Error) => toast.error(e.message || "Daraja connection test failed."),
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

        {/* 3. M-PESA DARAJA STK PUSH COLLECTION SETTINGS */}
        <form
          className="surface-card grid gap-4 p-6 rounded-3xl sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            mpesaMutation.mutate();
          }}
        >
          <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 font-bold">
                <Smartphone className="size-5" />
              </span>
              <div>
                <h3 className="font-display font-bold text-base flex items-center gap-2">
                  M-Pesa Online Collection (Daraja STK Push)
                </h3>
                <p className="text-xs text-muted-foreground">
                  Receive rent directly into your Safaricom Paybill or Till Number via instant STK Push
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {mpesaData?.configured && mpesaForm.is_active ? (
                <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30 text-xs font-semibold">
                  <CheckCircle2 className="size-3.5 mr-1" /> Active &amp; Connected
                </Badge>
              ) : mpesaData?.configured && !mpesaForm.is_active ? (
                <Badge variant="outline" className="text-amber-500 border-amber-500/30 text-xs">
                  <AlertCircle className="size-3.5 mr-1" /> Configured (Paused)
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">
                  Not Configured
                </Badge>
              )}
            </div>
          </div>

          <div className="sm:col-span-2 flex items-center justify-between p-4 rounded-2xl bg-muted/40 border border-border/60">
            <div className="space-y-0.5">
              <Label htmlFor="mpesa_active" className="font-semibold text-sm cursor-pointer">
                Enable Automated Online STK Push
              </Label>
              <p className="text-xs text-muted-foreground">
                When enabled, tenants on your portal can click "Pay with M-Pesa" to receive instant PIN prompts
              </p>
            </div>
            <Switch
              id="mpesa_active"
              checked={mpesaForm.is_active}
              onCheckedChange={(checked) => setMpesaForm({ ...mpesaForm, is_active: checked })}
            />
          </div>

          <Field label="Business Shortcode / Paybill / Till" htmlFor="shortcode">
            <Input
              id="shortcode"
              required
              placeholder="e.g. 174379 (Sandbox) or Paybill"
              maxLength={10}
              value={mpesaForm.shortcode}
              onChange={(e) => setMpesaForm({ ...mpesaForm, shortcode: e.target.value.trim() })}
              className="font-mono font-semibold"
            />
          </Field>

          <Field label="Transaction Type" htmlFor="tx_type">
            <Select
              value={mpesaForm.transaction_type}
              onValueChange={(v: "CustomerPayBillOnline" | "CustomerBuyGoodsOnline") =>
                setMpesaForm({ ...mpesaForm, transaction_type: v })
              }
            >
              <SelectTrigger id="tx_type" className="font-semibold">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CustomerPayBillOnline">Paybill (CustomerPayBillOnline)</SelectItem>
                <SelectItem value="CustomerBuyGoodsOnline">Buy Goods / Till (CustomerBuyGoodsOnline)</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field label="Environment" htmlFor="env">
            <Select
              value={mpesaForm.environment}
              onValueChange={(v: "sandbox" | "production") => {
                const next = { ...mpesaForm, environment: v };
                if (v === "sandbox" && (!mpesaForm.shortcode || !mpesaForm.passkey)) {
                  next.shortcode = "174379";
                  next.passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
                }
                setMpesaForm(next);
              }}
            >
              <SelectTrigger id="env" className="font-semibold">
                <SelectValue placeholder="Select environment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sandbox">Sandbox (Testing / Development)</SelectItem>
                <SelectItem value="production">Production (Live Real Payments)</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field label="Account Reference Prefix" htmlFor="ref_prefix">
            <Input
              id="ref_prefix"
              placeholder="e.g. RRP or Estate Name"
              maxLength={10}
              value={mpesaForm.account_reference_prefix}
              onChange={(e) => setMpesaForm({ ...mpesaForm, account_reference_prefix: e.target.value.trim() })}
              className="font-mono uppercase font-semibold"
            />
          </Field>

          {mpesaForm.environment === "sandbox" && (
            <div className="sm:col-span-2 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="size-3.5" /> Safaricom Sandbox Testing Mode
                </span>
                <p className="text-muted-foreground text-[11px]">
                  Standard Sandbox Shortcode: <strong>174379</strong> · Passkey is pre-filled. You only need your Consumer Key &amp; Secret from Safaricom Daraja.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full text-xs h-7 px-3 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10 shrink-0 self-start sm:self-auto font-semibold"
                onClick={() => {
                  setMpesaForm((prev) => ({
                    ...prev,
                    shortcode: "174379",
                    passkey: "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919",
                    transaction_type: "CustomerPayBillOnline",
                  }));
                  toast.success("Applied standard Safaricom Sandbox Shortcode (174379) & Passkey!");
                }}
              >
                Auto-fill Sandbox Defaults
              </Button>
            </div>
          )}

          <Field label="Daraja Consumer Key" htmlFor="ck" className="sm:col-span-2">
            <Input
              id="ck"
              required
              placeholder="Daraja app consumer key"
              value={mpesaForm.consumer_key}
              onChange={(e) => setMpesaForm({ ...mpesaForm, consumer_key: e.target.value.trim() })}
              className="font-mono text-xs"
            />
          </Field>

          <Field label="Daraja Consumer Secret" htmlFor="cs">
            <Input
              id="cs"
              required
              placeholder="••••••••••••"
              value={mpesaForm.consumer_secret}
              onChange={(e) => setMpesaForm({ ...mpesaForm, consumer_secret: e.target.value.trim() })}
              className="font-mono text-xs"
            />
          </Field>

          <Field label="Lipa Na M-Pesa Online Passkey" htmlFor="pk">
            <Input
              id="pk"
              required
              placeholder="••••••••••••"
              value={mpesaForm.passkey}
              onChange={(e) => setMpesaForm({ ...mpesaForm, passkey: e.target.value.trim() })}
              className="font-mono text-xs"
            />
          </Field>

          <div className="sm:col-span-2 pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-border/60 mt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full text-xs gap-1.5 h-10"
              disabled={
                testConnectionMutation.isPending ||
                !mpesaForm.consumer_key ||
                !mpesaForm.consumer_secret
              }
              onClick={() => testConnectionMutation.mutate()}
            >
              {testConnectionMutation.isPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <ShieldCheck className="size-3.5 text-emerald-600" />
              )}
              Test Daraja Connection
            </Button>

            <Button
              type="submit"
              className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 px-6 shadow-glow"
              disabled={mpesaMutation.isPending}
            >
              {mpesaMutation.isPending ? (
                <Loader2 className="size-4 animate-spin mr-1.5" />
              ) : (
                <Smartphone className="size-4 mr-1.5" />
              )}
              Save M-Pesa Settings
            </Button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
