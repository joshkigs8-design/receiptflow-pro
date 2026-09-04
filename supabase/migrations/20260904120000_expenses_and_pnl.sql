-- Migration: Property Expenses and P&L Tracking
CREATE TABLE IF NOT EXISTS public.expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  landlord_id uuid NOT NULL DEFAULT auth.uid(),
  property_id uuid REFERENCES public.properties(id) ON DELETE SET NULL,
  category text NOT NULL DEFAULT 'other' CHECK (category IN ('repairs', 'salaries', 'electricity', 'water', 'garbage', 'security', 'taxes', 'maintenance', 'other')),
  amount numeric(12,2) NOT NULL CHECK (amount > 0),
  expense_date date NOT NULL DEFAULT CURRENT_DATE,
  vendor text,
  receipt_image_url text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_expenses_landlord_id ON public.expenses (landlord_id);
CREATE INDEX IF NOT EXISTS idx_expenses_property_id ON public.expenses (property_id);
CREATE INDEX IF NOT EXISTS idx_expenses_expense_date ON public.expenses (expense_date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON public.expenses (category);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Landlords can view their own expenses" ON public.expenses
  FOR SELECT USING (auth.uid() = landlord_id);

CREATE POLICY "Landlords can insert their own expenses" ON public.expenses
  FOR INSERT WITH CHECK (auth.uid() = landlord_id);

CREATE POLICY "Landlords can update their own expenses" ON public.expenses
  FOR UPDATE USING (auth.uid() = landlord_id);

CREATE POLICY "Landlords can delete their own expenses" ON public.expenses
  FOR DELETE USING (auth.uid() = landlord_id);
