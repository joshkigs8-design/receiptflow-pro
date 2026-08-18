import { a as literalType, c as stringType, r as coerce, s as objectType, t as arrayType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/schemas-DUPaCA9k.js
var propertySchema = objectType({
	id: stringType().uuid().optional(),
	name: stringType().trim().min(2).max(120),
	code: stringType().trim().min(2).max(24).regex(/^[A-Za-z0-9-]+$/, "Letters, numbers and dashes only"),
	property_type: stringType().max(40).default("apartment"),
	address: stringType().max(200).optional().nullable(),
	gps_lat: coerce.number().optional().nullable(),
	gps_lng: coerce.number().optional().nullable(),
	description: stringType().max(2e3).optional().nullable(),
	amenities: arrayType(stringType().max(40)).max(40).default([]),
	units_count: coerce.number().int().min(0).max(1e5).default(0),
	status: stringType().max(24).default("active"),
	image_url: stringType().max(600).optional().nullable(),
	notes: stringType().max(2e3).optional().nullable()
});
var unitSchema = objectType({
	id: stringType().uuid().optional(),
	property_id: stringType().uuid(),
	unit_number: stringType().trim().min(1).max(40),
	room_number: stringType().max(40).optional().nullable(),
	floor: stringType().max(24).optional().nullable(),
	rent: coerce.number().min(0).max(1e8).default(0),
	deposit: coerce.number().min(0).max(1e8).default(0),
	status: stringType().max(24).default("vacant"),
	utilities: stringType().max(500).optional().nullable(),
	image_url: stringType().max(600).optional().nullable(),
	notes: stringType().max(1e3).optional().nullable()
});
var tenantSchema = objectType({
	id: stringType().uuid().optional(),
	property_id: stringType().uuid().optional().nullable(),
	unit_id: stringType().uuid().optional().nullable(),
	full_name: stringType().trim().min(2).max(120),
	phone: stringType().trim().min(6).max(24),
	email: stringType().trim().email().max(200).optional().or(literalType("")).nullable(),
	national_id: stringType().max(40).optional().nullable(),
	passport: stringType().max(40).optional().nullable(),
	emergency_contact: stringType().max(120).optional().nullable(),
	occupation: stringType().max(120).optional().nullable(),
	photo_url: stringType().max(600).optional().nullable(),
	lease_start: stringType().max(20).optional().nullable(),
	lease_end: stringType().max(20).optional().nullable(),
	rent_amount: coerce.number().min(0).max(1e8).default(0),
	deposit_paid: coerce.number().min(0).max(1e8).default(0),
	status: stringType().max(24).default("active"),
	notes: stringType().max(2e3).optional().nullable()
});
var paymentSchema = objectType({
	tenant_id: stringType().uuid(),
	amount: coerce.number().min(1).max(1e8),
	method: stringType().max(24).default("cash"),
	reference: stringType().max(80).optional().nullable(),
	paid_at: stringType().max(20),
	period_label: stringType().max(40).optional().nullable(),
	notes: stringType().max(1e3).optional().nullable(),
	issued_by: stringType().max(120).optional().nullable()
});
var announcementSchema = objectType({
	property_id: stringType().uuid().optional().nullable(),
	title: stringType().trim().min(2).max(140),
	body: stringType().trim().min(2).max(3e3),
	category: stringType().max(40).default("general")
});
var settingsSchema = objectType({
	full_name: stringType().max(120).optional().nullable(),
	company_name: stringType().trim().min(1).max(120),
	logo_url: stringType().max(600).optional().nullable(),
	phone: stringType().max(24).optional().nullable(),
	currency: stringType().trim().min(1).max(8),
	business_details: stringType().max(1e3).optional().nullable()
});
var portalVerifySchema = objectType({
	code: stringType().trim().min(2).max(24),
	room: stringType().trim().min(1).max(40),
	phone: stringType().trim().min(6).max(24)
});
var portalRequestSchema = portalVerifySchema.extend({
	category: stringType().max(40),
	description: stringType().trim().min(4).max(2e3),
	priority: stringType().max(20)
});
//#endregion
export { propertySchema as a, unitSchema as c, portalVerifySchema as i, paymentSchema as n, settingsSchema as o, portalRequestSchema as r, tenantSchema as s, announcementSchema as t };
