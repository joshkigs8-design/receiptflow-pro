import crypto from "node:crypto";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { ConnectionStatusType, ParsedPaymentReference } from "./types";

const ENCRYPTION_KEY = (
  process.env["MPESA_ENCRYPTION_KEY"] ||
  process.env["SUPABASE_SERVICE_ROLE_KEY"] ||
  "default-secret-key-rentreceipt-32b"
)
  .slice(0, 32)
  .padEnd(32, "0");

export function encryptSecret(plainText: string): string {
  if (!plainText) return "";
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", Buffer.from(ENCRYPTION_KEY, "utf-8"), iv);
  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");
  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

export function decryptSecret(cipherText: string): string {
  if (!cipherText) return "";
  const parts = cipherText.split(":");
  if (parts.length !== 3) return cipherText;
  const [ivHex, authTagHex, encrypted] = parts;
  try {
    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      Buffer.from(ENCRYPTION_KEY, "utf-8"),
      Buffer.from(ivHex, "hex")
    );
    decipher.setAuthTag(Buffer.from(authTagHex, "hex"));
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch {
    return cipherText;
  }
}

export interface LandlordKcbConfig {
  id?: string;
  landlord_id: string;
  paybill_number: string;
  account_number?: string | null;
  client_key: string;
  client_secret: string;
  ipn_secret_token?: string | null;
  environment: "sandbox" | "production";
  account_reference_prefix?: string | null;
  is_active: boolean;
  connection_status?: ConnectionStatusType;
  last_tested_at?: string | null;
}

export const KCB_BUNI_ENDPOINTS = {
  sandbox: "https://uat.buni.kcbgroup.com",
  production: "https://buni.kcbgroup.com",
};

export const KCB_SANDBOX_DEFAULTS = {
  paybill_number: "522123",
  account_number: "1234567890",
  account_reference_prefix: "RR",
};

/**
 * Obtains an OAuth Bearer Token from KCB BUNI Developer Gateway
 */
export async function generateKcbAccessToken(
  clientKey: string,
  clientSecret: string,
  environment: "sandbox" | "production" = "sandbox",
): Promise<{ accessToken: string; expiresIn: number }> {
  const cleanKey = clientKey.trim();
  const cleanSecret = clientSecret.trim();

  if (!cleanKey || !cleanSecret) {
    throw new Error("KCB BUNI Client Key and Client Secret are required.");
  }

  const auth = Buffer.from(`${cleanKey}:${cleanSecret}`).toString("base64");
  const baseUrl = KCB_BUNI_ENDPOINTS[environment] || KCB_BUNI_ENDPOINTS.sandbox;

  try {
    const res = await fetch(`${baseUrl}/token?grant_type=client_credentials`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "");
      console.error("KCB BUNI OAuth Failed:", res.status, errorText);
      throw new Error(
        `KCB BUNI Authentication Failed (${res.status}): Please check your Client Key, Secret, and Environment.`,
      );
    }

    const json = (await res.json()) as { access_token?: string; expires_in?: number; token_type?: string };
    if (!json.access_token) {
      throw new Error("No access token returned by KCB BUNI OAuth gateway.");
    }

    return {
      accessToken: json.access_token,
      expiresIn: Number(json.expires_in || 3600),
    };
  } catch (err: any) {
    if (err.message.includes("KCB BUNI Authentication Failed")) throw err;
    throw new Error(`Failed to reach KCB BUNI gateway (${environment}): ${err?.message || "Network error"}`);
  }
}

/**
 * Tests connection to KCB BUNI OAuth Gateway and records status
 */
export async function testKcbConnection(
  clientKey: string,
  clientSecret: string,
  environment: "sandbox" | "production",
): Promise<{ ok: boolean; message: string; latencyMs: number }> {
  const start = Date.now();
  const tokenRes = await generateKcbAccessToken(clientKey, clientSecret, environment);
  const latencyMs = Date.now() - start;

  return {
    ok: true,
    message: `Connected successfully to KCB BUNI (${environment.toUpperCase()}) in ${latencyMs}ms. OAuth Bearer token validated.`,
    latencyMs,
  };
}

/**
 * Intelligently parses payment account references to identify Property and Unit/Room.
 * Supports formats:
 * - "RR-KILIMA1-U101" -> prefix: "RR", propertyCode: "KILIMA1", unit: "U101"
 * - "KILIMA1-101" -> propertyCode: "KILIMA1", unit: "101"
 * - "RR-PROP-ROOM1" -> prefix: "RR", propertyCode: "PROP", unit: "ROOM1"
 * - "101" -> unit: "101"
 */
export function parseKcbPaymentReference(raw: string): ParsedPaymentReference {
  const cleaned = (raw || "").trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
  if (!cleaned) {
    return { raw, isValid: false };
  }

  const parts = cleaned.split(/[-_]/);

  if (parts.length >= 3) {
    const unit = parts.slice(2).join("-");
    return {
      raw: cleaned,
      prefix: parts[0],
      propertyCode: parts[1],
      unitOrRoom: unit,
      unitIdentifier: unit,
      isValid: true,
    };
  }

  if (parts.length === 2) {
    return {
      raw: cleaned,
      propertyCode: parts[0],
      unitOrRoom: parts[1],
      unitIdentifier: parts[1],
      isValid: true,
    };
  }

  return {
    raw: cleaned,
    unitOrRoom: cleaned,
    unitIdentifier: cleaned,
    isValid: true,
  };
}

/**
 * Retrieves the active KCB configuration for a landlord with decrypted secrets
 */
export async function getLandlordKcbConfig(landlordId: string): Promise<LandlordKcbConfig | null> {
  const { data: config, error } = await supabaseAdmin
    .from("landlord_kcb_configs")
    .select("*")
    .eq("landlord_id", landlordId)
    .maybeSingle();

  if (!error && config) {
    return {
      ...(config as LandlordKcbConfig),
      client_secret: decryptSecret(config.client_secret),
      ipn_secret_token: config.ipn_secret_token ? decryptSecret(config.ipn_secret_token) : null,
    };
  }

  return null;
}

/**
 * Looks up landlord KCB configuration by Paybill Number and/or Account Number for incoming IPNs
 */
export async function getKcbConfigByPaybill(
  paybillNumber: string,
  accountNumber?: string,
): Promise<LandlordKcbConfig | null> {
  const cleanPaybill = (paybillNumber || "").trim();
  if (!cleanPaybill) return null;

  let query = supabaseAdmin
    .from("landlord_kcb_configs")
    .select("*")
    .eq("paybill_number", cleanPaybill)
    .eq("is_active", true);

  if (accountNumber) {
    const { data: specific } = await query.eq("account_number", accountNumber.trim()).maybeSingle();
    if (specific) {
      return {
        ...(specific as LandlordKcbConfig),
        client_secret: decryptSecret(specific.client_secret),
        ipn_secret_token: specific.ipn_secret_token ? decryptSecret(specific.ipn_secret_token) : null,
      };
    }
  }

  const { data: fallback } = await supabaseAdmin
    .from("landlord_kcb_configs")
    .select("*")
    .eq("paybill_number", cleanPaybill)
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();

  if (fallback) {
    return {
      ...(fallback as LandlordKcbConfig),
      client_secret: decryptSecret(fallback.client_secret),
      ipn_secret_token: fallback.ipn_secret_token ? decryptSecret(fallback.ipn_secret_token) : null,
    };
  }

  return null;
}

/**
 * Saves or updates landlord KCB configuration in secure landlord_kcb_configs table with AES-256-GCM encryption at rest
 */
export async function saveLandlordKcbConfig(
  landlordId: string,
  config: Omit<LandlordKcbConfig, "landlord_id">,
): Promise<void> {
  const payload = {
    landlord_id: landlordId,
    paybill_number: config.paybill_number.trim(),
    account_number: config.account_number?.trim() || null,
    client_key: config.client_key.trim(),
    client_secret: encryptSecret(config.client_secret.trim()),
    ipn_secret_token: config.ipn_secret_token ? encryptSecret(config.ipn_secret_token.trim()) : null,
    environment: config.environment,
    account_reference_prefix: config.account_reference_prefix?.trim() || "RR",
    is_active: config.is_active,
    connection_status: config.connection_status || "configured",
    last_tested_at: config.last_tested_at || null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabaseAdmin.from("landlord_kcb_configs").upsert(payload, {
    onConflict: "landlord_id",
  });

  if (error) {
    throw new Error(`Failed to save KCB BUNI credentials: ${error.message}`);
  }
}

