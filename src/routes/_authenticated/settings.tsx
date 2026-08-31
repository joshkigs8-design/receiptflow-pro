import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import {
  Palette,
  Sparkles,
  Building2,
  Smartphone,
  Building,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  BookOpen,
  Download,
  Copy,
  ExternalLink,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { getSettings, saveSettings } from "@/lib/app.functions";
import {
  getLandlordMpesaSettings,
  saveLandlordMpesaSettings,
  testLandlordMpesaConnection,
} from "@/lib/mpesa.functions";
import {
  getLandlordKcbSettings,
  saveLandlordKcbSettings,
  testLandlordKcbConnection,
} from "@/lib/payments/kcb.functions";
import { downloadLandlordManualPdf } from "@/lib/manual-pdf";
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
        content: "Branding, currency, appearance, M-Pesa Daraja and KCB BUNI payment integrations.",
      },
      { property: "og:title", content: "Settings — Rent Receipt Pro" },
      { property: "og:description", content: "Customise your receipt branding, theme, and payment gateways." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const qc = useQueryClient();
  const fetchSettings = useServerFn(getSettings);
  const save = useServerFn(saveSettings);

  // M-Pesa Server Functions
  const fetchMpesaSettings = useServerFn(getLandlordMpesaSettings);
  const saveMpesa = useServerFn(saveLandlordMpesaSettings);
  const testMpesa = useServerFn(testLandlordMpesaConnection);

  // KCB Server Functions
  const fetchKcbSettings = useServerFn(getLandlordKcbSettings);
  const saveKcb = useServerFn(saveLandlordKcbSettings);
  const testKcb = useServerFn(testLandlordKcbConnection);

  const { data } = useQuery({ queryKey: ["settings"], queryFn: () => fetchSettings() });
  const { data: mpesaData } = useQuery({
    queryKey: ["landlord_mpesa_settings"],
    queryFn: () => fetchMpesaSettings(),
  });
  const { data: kcbData } = useQuery({
    queryKey: ["landlord_kcb_settings"],
    queryFn: () => fetchKcbSettings(),
  });

  const { mode, accent, setMode, setAccent } = useTheme();

  // Payment Provider Tab Switcher
  const [selectedProvider, setSelectedProvider] = useState<"mpesa" | "kcb">("mpesa");

  const [form, setForm] = useState({
    full_name: "",
    company_name: "Codevanta Ventures",
    logo_url: "",
    phone: "",
    currency: "KSh",
    business_details: "",
  });

  // M-Pesa Form State
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

  // KCB BUNI Form State
  const [kcbForm, setKcbForm] = useState({
    paybill_number: "",
    account_number: "",
    client_key: "",
    client_secret: "",
    ipn_secret_token: "",
    environment: "sandbox" as "sandbox" | "production",
    account_reference_prefix: "RR",
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

  useEffect(() => {
    if (!kcbData) return;
    setKcbForm({
      paybill_number: kcbData.paybill_number || "",
      account_number: kcbData.account_number || "",
      client_key: kcbData.client_key || "",
      client_secret: kcbData.client_secret_masked || "",
      ipn_secret_token: kcbData.ipn_secret_token_masked || "",
      environment: kcbData.environment || "sandbox",
      account_reference_prefix: kcbData.account_reference_prefix || "RR",
      is_active: kcbData.is_active ?? true,
    });
  }, [kcbData]);

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

  const kcbMutation = useMutation({
    mutationFn: () => saveKcb({ data: kcbForm }),
    onSuccess: () => {
      toast.success("KCB BUNI payment configuration saved!");
      qc.invalidateQueries({ queryKey: ["landlord_kcb_settings"] });
    },
    onError: (e: Error) => toast.error(e.message || "Could not save KCB settings"),
  });

  const testKcbMutation = useMutation({
    mutationFn: () =>
      testKcb({
        data: {
          client_key: kcbForm.client_key,
          client_secret: kcbForm.client_secret,
          environment: kcbForm.environment,
        },
      }),
    onSuccess: (res) => {
      toast.success(res.message);
      qc.invalidateQueries({ queryKey: ["landlord_kcb_settings"] });
    },
    onError: (e: Error) => toast.error(e.message || "KCB BUNI connection test failed."),
  });

  return (
    <AppShell title="Settings" description="Customize appearance, theme, receipt branding and automated payment gateways">
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

          <Field label="Company / Entity Name" htmlFor="cn">
            <Input
              id="cn"
              maxLength={120}
              value={form.company_name}
              onChange={(e) => setForm({ ...form, company_name: e.target.value })}
            />
          </Field>

          <Field label="Primary Phone Number" htmlFor="ph">
            <Input
              id="ph"
              maxLength={40}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </Field>

          <Field label="Currency Code" htmlFor="cur">
            <Input
              id="cur"
              maxLength={10}
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
            />
          </Field>

          <Field label="Logo Image URL" htmlFor="lu" className="sm:col-span-2">
            <Input
              id="lu"
              placeholder="https://..."
              value={form.logo_url}
              onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
            />
          </Field>

          <Field label="Business / Payment Instructions" htmlFor="bd" className="sm:col-span-2">
            <Textarea
              id="bd"
              rows={3}
              value={form.business_details}
              onChange={(e) => setForm({ ...form, business_details: e.target.value })}
              placeholder="Bank account, payment policies, contact info..."
            />
          </Field>

          <div className="sm:col-span-2 pt-2">
            <Button type="submit" className="rounded-full shadow-glow" disabled={mutation.isPending}>
              Save Branding Settings
            </Button>
          </div>
        </form>

        {/* 3. MULTI-PROVIDER PAYMENT GATEWAYS */}
        <div className="surface-card p-6 rounded-3xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary font-bold">
                <Wallet className="size-5" />
              </span>
              <div>
                <h3 className="font-display font-bold text-base">Automated Payment Gateways</h3>
                <p className="text-xs text-muted-foreground">
                  Configure your digital payment channels for automatic instant rent reconciliation
                </p>
              </div>
            </div>

            {/* Provider Switcher Selector */}
            <div className="flex items-center bg-muted/60 p-1 rounded-2xl border border-border/60 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setSelectedProvider("mpesa")}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedProvider === "mpesa"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Smartphone className="size-3.5 text-emerald-600" />
                Safaricom M-Pesa
                {mpesaData?.configured && mpesaForm.is_active && (
                  <span className="size-2 rounded-full bg-emerald-500" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setSelectedProvider("kcb")}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedProvider === "kcb"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Building className="size-3.5 text-blue-600" />
                KCB BUNI
                {kcbData?.configured && kcbForm.is_active && (
                  <span className="size-2 rounded-full bg-blue-500" />
                )}
              </button>
            </div>
          </div>

          {/* SAFARICOM M-PESA CONFIGURATION VIEW */}
          {selectedProvider === "mpesa" && (
            <form
              className="grid gap-4 sm:grid-cols-2 animate-in fade-in duration-200"
              onSubmit={(e) => {
                e.preventDefault();
                mpesaMutation.mutate();
              }}
            >
              <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-2">
                  <Smartphone className="size-4 text-emerald-600" />
                  <span className="font-bold text-xs text-emerald-700 dark:text-emerald-300">
                    Safaricom Daraja STK Push Integration
                  </span>
                </div>
                <div>
                  {mpesaData?.configured && mpesaForm.is_active ? (
                    <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30 text-xs font-semibold">
                      <CheckCircle2 className="size-3 mr-1" /> Active &amp; Connected
                    </Badge>
                  ) : mpesaData?.configured && !mpesaForm.is_active ? (
                    <Badge variant="outline" className="text-amber-500 border-amber-500/30 text-xs">
                      <AlertCircle className="size-3 mr-1" /> Configured (Paused)
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

              <Field label="Environment" htmlFor="mpesa_env">
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
                  <SelectTrigger id="mpesa_env" className="font-semibold">
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
          )}

          {/* KCB BUNI INTEGRATION CONFIGURATION VIEW */}
          {selectedProvider === "kcb" && (
            <form
              className="grid gap-4 sm:grid-cols-2 animate-in fade-in duration-200"
              onSubmit={(e) => {
                e.preventDefault();
                kcbMutation.mutate();
              }}
            >
              <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-center gap-2">
                  <Building className="size-4 text-blue-600" />
                  <span className="font-bold text-xs text-blue-700 dark:text-blue-300">
                    KCB BUNI Payment Gateway &amp; IPN Notification Integration
                  </span>
                </div>
                <div>
                  {kcbData?.configured && kcbForm.is_active && kcbData.connection_status === "connection_successful" ? (
                    <Badge className="bg-blue-500/15 text-blue-600 border-blue-500/30 text-xs font-semibold">
                      <CheckCircle2 className="size-3 mr-1" /> Active &amp; Connected
                    </Badge>
                  ) : kcbData?.configured && kcbForm.is_active ? (
                    <Badge className="bg-blue-500/15 text-blue-600 border-blue-500/30 text-xs font-semibold">
                      <CheckCircle2 className="size-3 mr-1" /> Configured
                    </Badge>
                  ) : kcbData?.configured && !kcbForm.is_active ? (
                    <Badge variant="outline" className="text-amber-500 border-amber-500/30 text-xs">
                      <AlertCircle className="size-3 mr-1" /> Configured (Paused)
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      Not Configured
                    </Badge>
                  )}
                </div>
              </div>

              {/* Informative Guidance Banner */}
              <div className="sm:col-span-2 p-4 rounded-2xl bg-muted/40 border border-border/60 text-xs space-y-1.5">
                <div className="font-bold text-foreground flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-blue-600" /> Automated KCB BUNI Reconciliation
                </div>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  KCB payments can be automatically received and reconciled in RentReceiptPro when the required KCB BUNI/API payment notification setup is enabled. Configure your BUNI Developer credentials below.
                </p>
              </div>

              <div className="sm:col-span-2 flex items-center justify-between p-4 rounded-2xl bg-muted/40 border border-border/60">
                <div className="space-y-0.5">
                  <Label htmlFor="kcb_active" className="font-semibold text-sm cursor-pointer">
                    Enable KCB BUNI Automated Collection
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Accept rent via KCB Paybill / Bank and automatically generate official receipts upon IPN arrival
                  </p>
                </div>
                <Switch
                  id="kcb_active"
                  checked={kcbForm.is_active}
                  onCheckedChange={(checked) => setKcbForm({ ...kcbForm, is_active: checked })}
                />
              </div>

              <Field label="KCB PayBill / Business Number" htmlFor="kcb_paybill">
                <Input
                  id="kcb_paybill"
                  required
                  placeholder="e.g. 522123"
                  maxLength={15}
                  value={kcbForm.paybill_number}
                  onChange={(e) => setKcbForm({ ...kcbForm, paybill_number: e.target.value.trim() })}
                  className="font-mono font-semibold"
                />
              </Field>

              <Field label="KCB Account Number / Merchant ID" htmlFor="kcb_account">
                <Input
                  id="kcb_account"
                  placeholder="e.g. 1234567890 (optional)"
                  maxLength={25}
                  value={kcbForm.account_number}
                  onChange={(e) => setKcbForm({ ...kcbForm, account_number: e.target.value.trim() })}
                  className="font-mono font-semibold"
                />
              </Field>

              <Field label="Environment" htmlFor="kcb_env">
                <Select
                  value={kcbForm.environment}
                  onValueChange={(v: "sandbox" | "production") => {
                    const next = { ...kcbForm, environment: v };
                    if (v === "sandbox" && !kcbForm.paybill_number) {
                      next.paybill_number = "522123";
                    }
                    setKcbForm(next);
                  }}
                >
                  <SelectTrigger id="kcb_env" className="font-semibold">
                    <SelectValue placeholder="Select environment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sandbox">Sandbox / UAT (Testing)</SelectItem>
                    <SelectItem value="production">Production (Live Payments)</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Account Reference Prefix" htmlFor="kcb_ref_prefix">
                <Input
                  id="kcb_ref_prefix"
                  placeholder="e.g. RR or Property Code"
                  maxLength={10}
                  value={kcbForm.account_reference_prefix}
                  onChange={(e) => setKcbForm({ ...kcbForm, account_reference_prefix: e.target.value.trim().toUpperCase() })}
                  className="font-mono uppercase font-semibold"
                />
              </Field>

              {kcbForm.environment === "sandbox" && (
                <div className="sm:col-span-2 p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                      <Sparkles className="size-3.5" /> KCB BUNI Sandbox Mode
                    </span>
                    <p className="text-muted-foreground text-[11px]">
                      Default KCB Sandbox Paybill: <strong>522123</strong>. Connect to BUNI Developer Portal at <code className="font-mono text-[10px]">uat.buni.kcbgroup.com</code>.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full text-xs h-7 px-3 text-blue-600 border-blue-500/30 hover:bg-blue-500/10 shrink-0 self-start sm:self-auto font-semibold"
                    onClick={() => {
                      setKcbForm((prev) => ({
                        ...prev,
                        paybill_number: "522123",
                        account_number: "1234567890",
                        account_reference_prefix: "RR",
                      }));
                      toast.success("Applied standard KCB Sandbox defaults!");
                    }}
                  >
                    Auto-fill Sandbox Defaults
                  </Button>
                </div>
              )}

              <Field label="KCB BUNI Client Key" htmlFor="kcb_ck" className="sm:col-span-2">
                <Input
                  id="kcb_ck"
                  required
                  placeholder="KCB BUNI Application Consumer Key"
                  value={kcbForm.client_key}
                  onChange={(e) => setKcbForm({ ...kcbForm, client_key: e.target.value.trim() })}
                  className="font-mono text-xs"
                />
              </Field>

              <Field label="KCB BUNI Client Secret" htmlFor="kcb_cs" className="sm:col-span-2">
                <Input
                  id="kcb_cs"
                  required
                  placeholder="••••••••••••"
                  value={kcbForm.client_secret}
                  onChange={(e) => setKcbForm({ ...kcbForm, client_secret: e.target.value.trim() })}
                  className="font-mono text-xs"
                />
              </Field>

              {/* IPN Webhook URL Callback Box */}
              <div className="sm:col-span-2 p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">Instant Payment Notification (IPN) Callback URL</span>
                  <span className="text-[10px] text-muted-foreground">Register this in your KCB BUNI App</span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value={kcbData?.ipn_url || "https://www.rentreceipt.co.ke/api/public/kcb/ipn"}
                    className="font-mono text-xs bg-background select-all"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-xl shrink-0 gap-1.5 h-9"
                    onClick={() => {
                      const url = kcbData?.ipn_url || "https://www.rentreceipt.co.ke/api/public/kcb/ipn";
                      navigator.clipboard.writeText(url);
                      toast.success("IPN Callback URL copied to clipboard!");
                    }}
                  >
                    <Copy className="size-3.5" /> Copy
                  </Button>
                </div>
              </div>

              <div className="sm:col-span-2 pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-border/60 mt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-full text-xs gap-1.5 h-10"
                  disabled={
                    testKcbMutation.isPending ||
                    !kcbForm.client_key ||
                    !kcbForm.client_secret
                  }
                  onClick={() => testKcbMutation.mutate()}
                >
                  {testKcbMutation.isPending ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <ShieldCheck className="size-3.5 text-blue-600" />
                  )}
                  Test KCB Connection
                </Button>

                <Button
                  type="submit"
                  className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-6 shadow-glow"
                  disabled={kcbMutation.isPending}
                >
                  {kcbMutation.isPending ? (
                    <Loader2 className="size-4 animate-spin mr-1.5" />
                  ) : (
                    <Building className="size-4 mr-1.5" />
                  )}
                  Save KCB Configuration
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Documentation & Landlord Operations Manual Section */}
        <div className="surface-card p-6 sm:p-7 rounded-3xl border border-border/80 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary inline-flex items-center gap-1.5">
                <BookOpen className="size-4" /> Platform Documentation
              </span>
              <h3 className="font-display text-lg font-bold">Landlord &amp; Operations Manual (2026 Edition)</h3>
              <p className="text-xs text-muted-foreground max-w-xl">
                Download the complete step-by-step PDF manual covering property setup, AI bulk imports, tenant onboarding, automated M-Pesa Daraja STK Push, KCB BUNI payment channels, caretaker delegation, and KRA 7.5% MRI tax compliance.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => downloadLandlordManualPdf()}
              className="rounded-full border-primary/30 text-primary hover:bg-primary/10 font-bold text-xs h-10 px-5 gap-2 shrink-0"
            >
              <Download className="size-4 text-primary" /> Download User Manual (PDF)
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
