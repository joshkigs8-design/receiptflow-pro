export type PaymentProviderType = "mpesa" | "kcb";

export type PaymentMethodType =
  | "cash"
  | "mpesa"
  | "kcb"
  | "kcb_buni"
  | "bank"
  | "card"
  | "cheque";

export type ConnectionStatusType =
  | "not_configured"
  | "configured"
  | "connection_successful"
  | "connection_failed"
  | "awaiting_approval";

export interface ParsedPaymentReference {
  raw: string;
  prefix?: string;
  propertyCode?: string;
  unitOrRoom?: string;
  isValid: boolean;
}

export interface KcbIpnPayload {
  transactionId?: string;
  transaction_id?: string;
  externalReference?: string;
  external_reference?: string;
  accountReference?: string;
  account_reference?: string;
  billNumber?: string;
  bill_number?: string;
  paybillNumber?: string;
  accountNumber?: string;
  account_number?: string;
  amount?: number | string;
  currency?: string;
  phoneNumber?: string;
  phone_number?: string;
  customerName?: string;
  customer_name?: string;
  channel?: string;
  paymentDate?: string;
  payment_date?: string;
  status?: string;
  merchantId?: string;
  merchant_id?: string;
  resultCode?: string | number;
  resultDesc?: string;
  [key: string]: any;
}

