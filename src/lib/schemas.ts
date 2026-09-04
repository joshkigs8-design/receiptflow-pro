import { z } from "zod";

export const propertySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2).max(120),
  code: z
    .string()
    .trim()
    .min(2)
    .max(24)
    .regex(/^[A-Za-z0-9-]+$/, "Letters, numbers and dashes only"),
  property_type: z.string().max(40).default("apartment"),
  address: z.string().max(200).optional().nullable(),
  gps_lat: z.coerce.number().optional().nullable(),
  gps_lng: z.coerce.number().optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  amenities: z.array(z.string().max(40)).max(40).default([]),
  units_count: z.coerce.number().int().min(0).max(100000).default(0),
  status: z.string().max(24).default("active"),
  image_url: z.string().max(600).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
});

export const unitSchema = z.object({
  id: z.string().uuid().optional(),
  property_id: z.string().uuid(),
  unit_number: z.string().trim().min(1).max(40),
  room_number: z.string().max(40).optional().nullable(),
  floor: z.string().max(24).optional().nullable(),
  rent: z.coerce.number().min(0).max(100000000).default(0),
  deposit: z.coerce.number().min(0).max(100000000).default(0),
  status: z.string().max(24).default("vacant"),
  utilities: z.string().max(500).optional().nullable(),
  image_url: z.string().max(600).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
});

export const tenantSchema = z.object({
  id: z.string().uuid().optional(),
  property_id: z.string().uuid().optional().nullable(),
  unit_id: z.string().uuid().optional().nullable(),
  full_name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(6).max(24),
  email: z.string().trim().email().max(200).optional().or(z.literal("")).nullable(),
  national_id: z.string().max(40).optional().nullable(),
  passport: z.string().max(40).optional().nullable(),
  emergency_contact: z.string().max(120).optional().nullable(),
  occupation: z.string().max(120).optional().nullable(),
  photo_url: z.string().max(600).optional().nullable(),
  lease_start: z.string().max(20).optional().nullable(),
  lease_end: z.string().max(20).optional().nullable(),
  rent_amount: z.coerce.number().min(0).max(100000000).default(0),
  deposit_paid: z.coerce.number().min(0).max(100000000).default(0),
  status: z.string().max(24).default("active"),
  notes: z.string().max(2000).optional().nullable(),
});

export const paymentSchema = z.object({
  tenant_id: z.string().uuid(),
  amount: z.coerce.number().min(1).max(100000000),
  method: z.string().max(24).default("cash"),
  reference: z.string().max(80).optional().nullable(),
  paid_at: z.string().max(20),
  period_label: z.string().max(40).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
  issued_by: z.string().max(120).optional().nullable(),
});

export const announcementSchema = z.object({
  property_id: z.string().uuid().optional().nullable(),
  title: z.string().trim().min(2).max(140),
  body: z.string().trim().min(2).max(3000),
  category: z.string().max(40).default("general"),
});

export const settingsSchema = z.object({
  full_name: z.string().max(120).optional().nullable(),
  company_name: z.string().trim().min(1).max(120),
  logo_url: z.string().max(600).optional().nullable(),
  phone: z.string().max(24).optional().nullable(),
  currency: z.string().trim().min(1).max(8),
  business_details: z.string().max(1000).optional().nullable(),
});

export const portalVerifySchema = z.object({
  code: z.string().trim().min(2).max(24),
  room: z.string().trim().min(1).max(40),
  phone: z.string().trim().min(6).max(24),
});

export const portalRequestSchema = portalVerifySchema.extend({
  category: z.string().max(40),
  description: z.string().trim().min(4).max(2000),
  priority: z.string().max(20),
  photo_url: z.string().max(600).optional().nullable(),
});

export const leaseSchema = z.object({
  id: z.string().uuid().optional(),
  tenant_id: z.string().uuid({ message: "Tenant is required" }),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  status: z.enum(["active", "expiring", "expired", "terminated"]).default("active"),
  document_url: z.string().max(800).optional().nullable(),
  signed: z.boolean().default(false),
});

export const expenseSchema = z.object({
  id: z.string().uuid().optional(),
  property_id: z.string().uuid().optional().nullable(),
  category: z.enum([
    "repairs",
    "salaries",
    "electricity",
    "water",
    "garbage",
    "security",
    "taxes",
    "maintenance",
    "other",
  ]).default("other"),
  amount: z.coerce.number().positive({ message: "Amount must be greater than 0" }),
  expense_date: z.string().min(4),
  vendor: z.string().max(120).optional().nullable(),
  receipt_image_url: z.string().max(800).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
});

