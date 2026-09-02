import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export interface DemoBookingPayload {
  fullName: string;
  email: string;
  phone: string;
  propertyName?: string;
  unitsCount: string;
  preferredDate?: string;
  preferredTime: "morning" | "afternoon" | "evening";
  notes?: string;
}

export interface SiteMessagePayload {
  senderName: string;
  email: string;
  phone?: string;
  category: "general" | "comment" | "feedback" | "feature_request" | "support" | "partnership";
  subject?: string;
  message: string;
  rating?: number;
}

/**
 * Public Server Function: Submit a Demo Booking Request
 */
export const submitDemoBooking = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as DemoBookingPayload)
  .handler(async ({ data }) => {
    if (!data.fullName || !data.email || !data.phone) {
      throw new Error("Full name, email, and phone number are required.");
    }

    const { data: booking, error } = await supabaseAdmin
      .from("demo_bookings")
      .insert({
        full_name: data.fullName.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim(),
        property_name: data.propertyName?.trim() || null,
        units_count: data.unitsCount || "1-10",
        preferred_date: data.preferredDate || null,
        preferred_time: data.preferredTime || "morning",
        notes: data.notes?.trim() || null,
        status: "new",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error inserting demo booking:", error);
      throw new Error(error.message || "Failed to submit demo booking request.");
    }

    return { success: true, id: booking.id };
  });

/**
 * Public Server Function: Submit a Comment or Message
 */
export const submitSiteMessage = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as SiteMessagePayload)
  .handler(async ({ data }) => {
    if (!data.senderName || !data.email || !data.message) {
      throw new Error("Name, email, and message are required.");
    }

    const { data: msg, error } = await supabaseAdmin
      .from("site_messages")
      .insert({
        sender_name: data.senderName.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone?.trim() || null,
        category: data.category || "general",
        subject: data.subject?.trim() || null,
        message: data.message.trim(),
        rating: data.rating ? Math.min(Math.max(Number(data.rating), 1), 5) : null,
        status: "unread",
        is_public_testimonial: false,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error inserting site message:", error);
      throw new Error(error.message || "Failed to send message.");
    }

    return { success: true, id: msg.id };
  });

/**
 * Public Server Function: Get Approved Comments and Testimonials
 */
export const getPublicComments = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("site_messages")
    .select("id, sender_name, message, rating, created_at, category")
    .eq("is_public_testimonial", true)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Error fetching public comments:", error);
    return [];
  }

  return data || [];
});

/**
 * Admin Server Function: List Demo Bookings
 */
export const listDemoBookingsAdmin = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("demo_bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error listing demo bookings:", error);
    throw new Error(error.message || "Failed to load demo bookings.");
  }

  return data || [];
});

/**
 * Admin Server Function: Update Demo Booking Status
 */
export const updateDemoBookingStatus = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      data as {
        id: string;
        status: "new" | "contacted" | "scheduled" | "completed" | "cancelled";
        adminNotes?: string;
      }
  )
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin
      .from("demo_bookings")
      .update({
        status: data.status,
        admin_notes: data.adminNotes ?? undefined,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.id);

    if (error) throw new Error(error.message || "Failed to update demo booking.");
    return { success: true };
  });

/**
 * Admin Server Function: List Site Messages and Comments
 */
export const listSiteMessagesAdmin = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("site_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error listing site messages:", error);
    throw new Error(error.message || "Failed to load site messages.");
  }

  return data || [];
});

/**
 * Admin Server Function: Update Site Message (Status, Reply, Toggle Testimonial)
 */
export const updateSiteMessageAdmin = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      data as {
        id: string;
        status?: "unread" | "read" | "replied" | "archived";
        adminReply?: string;
        isPublicTestimonial?: boolean;
      }
  )
  .handler(async ({ data }) => {
    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (data.status !== undefined) updatePayload.status = data.status;
    if (data.adminReply !== undefined) {
      updatePayload.admin_reply = data.adminReply;
      updatePayload.replied_at = new Date().toISOString();
      updatePayload.status = "replied";
    }
    if (data.isPublicTestimonial !== undefined) {
      updatePayload.is_public_testimonial = data.isPublicTestimonial;
    }

    const { error } = await supabaseAdmin
      .from("site_messages")
      .update(updatePayload)
      .eq("id", data.id);

    if (error) throw new Error(error.message || "Failed to update site message.");
    return { success: true };
  });
