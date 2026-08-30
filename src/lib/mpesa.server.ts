import { supabaseAdmin } from "@/integrations/supabase/client.server";

export interface LandlordMpesaConfig {
  id?: string;
  landlord_id: string;
  shortcode: string;
  consumer_key: string;
  consumer_secret: string;
  passkey: string;
  transaction_type: "CustomerPayBillOnline" | "CustomerBuyGoodsOnline";
  environment: "sandbox" | "production";
  account_reference_prefix?: string | null;
  is_active: boolean;
}

/**
 * Normalizes any Kenyan phone number format to standard 254XXXXXXXXX
 * e.g. "0712345678" -> "254712345678"
 * e.g. "0112345678" -> "254112345678"
 * e.g. "+254712345678" -> "254712345678"
 */
export function normalizeKenyanPhone(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (digits.startsWith("254") && digits.length === 12) {
    return digits;
  }
  if ((digits.startsWith("07") || digits.startsWith("01")) && digits.length === 10) {
    return "254" + digits.slice(1);
  }
  if ((digits.startsWith("7") || digits.startsWith("1")) && digits.length === 9) {
    return "254" + digits;
  }
  throw new Error(`Invalid Kenyan mobile phone number: "${input}". Must be a valid Safaricom/Kenyan mobile number.`);
}

/**
 * Generates Daraja timestamp string: YYYYMMDDHHmmss
 */
export function getDarajaTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

export function getDarajaBaseUrl(environment: "sandbox" | "production"): string {
  return environment === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";
}

/**
 * Obtains an OAuth Bearer Token from Safaricom Daraja API
 */
export async function generateDarajaAccessToken(
  consumerKey: string,
  consumerSecret: string,
  environment: "sandbox" | "production",
): Promise<string> {
  const auth = Buffer.from(`${consumerKey.trim()}:${consumerSecret.trim()}`).toString("base64");
  const baseUrl = getDarajaBaseUrl(environment);

  const res = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
    method: "GET",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Daraja OAuth Failed:", errorText);
    throw new Error(`M-Pesa Authentication Failed (${res.status}): Please check Consumer Key and Secret.`);
  }

  const json = (await res.json()) as { access_token?: string; expires_in?: string };
  if (!json.access_token) {
    throw new Error("No access token returned by Daraja OAuth.");
  }

  return json.access_token;
}

export const DARAJA_SANDBOX_DEFAULTS = {
  shortcode: "174379",
  passkey: "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919",
  transaction_type: "CustomerPayBillOnline" as const,
};

/**
 * Sends a Lipa Na M-Pesa Online STK Push request to Safaricom Daraja
 */
export async function sendDarajaStkPush(params: {
  config: LandlordMpesaConfig;
  phoneNumber: string;
  amount: number;
  accountReference: string;
  transactionDesc?: string;
  callbackUrl: string;
}): Promise<{
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}> {
  const { config, phoneNumber, amount, accountReference, transactionDesc, callbackUrl } = params;

  const shortcode = config.shortcode?.trim() || (config.environment === "sandbox" ? DARAJA_SANDBOX_DEFAULTS.shortcode : "");
  const passkey = config.passkey?.trim() || (config.environment === "sandbox" ? DARAJA_SANDBOX_DEFAULTS.passkey : "");

  if (!shortcode || !passkey) {
    throw new Error("M-Pesa Shortcode and Passkey are required.");
  }

  const normalizedPhone = normalizeKenyanPhone(phoneNumber);
  const timestamp = getDarajaTimestamp();
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");

  const accessToken = await generateDarajaAccessToken(
    config.consumer_key,
    config.consumer_secret,
    config.environment,
  );

  const baseUrl = getDarajaBaseUrl(config.environment);
  const payload = {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: config.transaction_type || "CustomerPayBillOnline",
    Amount: Math.round(amount),
    PartyA: normalizedPhone,
    PartyB: shortcode,
    PhoneNumber: normalizedPhone,
    CallBackURL: callbackUrl,
    AccountReference: accountReference.slice(0, 12),
    TransactionDesc: (transactionDesc || "Rent Payment").slice(0, 13),
  };

  const res = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const responseJson = await res.json();

  if (!res.ok || responseJson.ResponseCode !== "0") {
    const msg = responseJson.errorMessage || responseJson.ResponseDescription || "Could not initiate M-Pesa STK Push.";
    throw new Error(`M-Pesa STK Push Error: ${msg}`);
  }

  return responseJson;
}

/**
 * Retrieves the active M-Pesa configuration for a landlord
 */
export async function getLandlordMpesaConfig(landlordId: string): Promise<LandlordMpesaConfig | null> {
  const { data: config, error } = await supabaseAdmin
    .from("landlord_mpesa_configs")
    .select("*")
    .eq("landlord_id", landlordId)
    .eq("is_active", true)
    .maybeSingle();

  if (!error && config) {
    return config as LandlordMpesaConfig;
  }

  return null;
}

/**
 * Saves or updates landlord M-Pesa configuration in the secure landlord_mpesa_configs table
 */
export async function saveLandlordMpesaConfig(
  landlordId: string,
  config: Omit<LandlordMpesaConfig, "landlord_id">,
): Promise<void> {
  const payload = {
    landlord_id: landlordId,
    shortcode: config.shortcode.trim(),
    consumer_key: config.consumer_key.trim(),
    consumer_secret: config.consumer_secret.trim(),
    passkey: config.passkey.trim(),
    transaction_type: config.transaction_type,
    environment: config.environment,
    account_reference_prefix: config.account_reference_prefix?.trim() || "RRP",
    is_active: config.is_active,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabaseAdmin.from("landlord_mpesa_configs").upsert(payload, {
    onConflict: "landlord_id",
  });

  if (error) {
    throw new Error(`Failed to save M-Pesa credentials: ${error.message}`);
  }
}

