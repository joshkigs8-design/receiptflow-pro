-- Migration: Demo Bookings and Visitor Feedback / Messages System
-- Adds: public.demo_bookings, public.site_messages, indexes, and RLS policies

-- 1. DEMO BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.demo_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  property_name text,
  units_count text NOT NULL DEFAULT '1-10',
  preferred_date date,
  preferred_time text NOT NULL DEFAULT 'morning' CHECK (preferred_time IN ('morning', 'afternoon', 'evening')),
  notes text,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'scheduled', 'completed', 'cancelled')),
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.demo_bookings IS 'Stores requests for live RentReceipt Pro product demos from prospective landlords and property managers';

-- 2. SITE MESSAGES & COMMENTS TABLE
CREATE TABLE IF NOT EXISTS public.site_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_name text NOT NULL,
  email text NOT NULL,
  phone text,
  category text NOT NULL DEFAULT 'general' CHECK (category IN ('general', 'comment', 'feedback', 'feature_request', 'support', 'partnership')),
  subject text,
  message text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  is_public_testimonial boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
  admin_reply text,
  replied_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.site_messages IS 'Visitor comments, product feedback, inquiries and contact messages';

-- 3. INDEXES FOR FAST QUERYING
CREATE INDEX IF NOT EXISTS idx_demo_bookings_status ON public.demo_bookings (status);
CREATE INDEX IF NOT EXISTS idx_demo_bookings_created_at ON public.demo_bookings (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_demo_bookings_email ON public.demo_bookings (email);

CREATE INDEX IF NOT EXISTS idx_site_messages_status ON public.site_messages (status);
CREATE INDEX IF NOT EXISTS idx_site_messages_category ON public.site_messages (category);
CREATE INDEX IF NOT EXISTS idx_site_messages_created_at ON public.site_messages (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_messages_public ON public.site_messages (is_public_testimonial) WHERE is_public_testimonial = true;

-- 4. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.demo_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_messages ENABLE ROW LEVEL SECURITY;

-- Demo bookings: Anyone can submit a demo request
CREATE POLICY "Anyone can submit a demo booking" ON public.demo_bookings
  FOR INSERT
  WITH CHECK (true);

-- Demo bookings: Only admins can view and manage bookings
CREATE POLICY "Admins manage demo bookings" ON public.demo_bookings
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Site messages: Anyone can submit a message or comment
CREATE POLICY "Anyone can submit a site message or comment" ON public.site_messages
  FOR INSERT
  WITH CHECK (true);

-- Site messages: Public can view approved testimonials/comments
CREATE POLICY "Public can view approved testimonials" ON public.site_messages
  FOR SELECT
  USING (is_public_testimonial = true);

-- Site messages: Only admins can view all and manage messages
CREATE POLICY "Admins manage site messages" ON public.site_messages
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
