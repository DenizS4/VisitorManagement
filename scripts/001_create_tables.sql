-- Create guards table
CREATE TABLE IF NOT EXISTS public.guards (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  badge_number TEXT UNIQUE NOT NULL,
  position TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create visitors table
CREATE TABLE IF NOT EXISTS public.visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create visits table
CREATE TABLE IF NOT EXISTS public.visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id UUID NOT NULL REFERENCES public.visitors(id) ON DELETE CASCADE,
  guard_id UUID NOT NULL REFERENCES public.guards(id) ON DELETE CASCADE,
  visit_date TIMESTAMP WITH TIME ZONE NOT NULL,
  check_in_time TIMESTAMP WITH TIME ZONE,
  check_out_time TIMESTAMP WITH TIME ZONE,
  purpose TEXT NOT NULL,
  destination_floor TEXT,
  pass_card_number TEXT UNIQUE,
  status TEXT DEFAULT 'pending', -- pending, active, completed, cancelled
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pass cards table
CREATE TABLE IF NOT EXISTS public.pass_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID NOT NULL REFERENCES public.visits(id) ON DELETE CASCADE,
  card_number TEXT UNIQUE NOT NULL,
  card_color TEXT DEFAULT 'red',
  access_level TEXT DEFAULT 'visitor',
  issued_by UUID NOT NULL REFERENCES public.guards(id),
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active', -- active, revoked, expired
  document_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create documents table for file uploads
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  uploaded_by UUID NOT NULL REFERENCES public.guards(id),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.guards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pass_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for guards
CREATE POLICY "guards_select_own"
  ON public.guards FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "guards_insert_own"
  ON public.guards FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "guards_update_own"
  ON public.guards FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for visitors - all guards can view/create
CREATE POLICY "visitors_select_all"
  ON public.visitors FOR SELECT
  USING (true);

CREATE POLICY "visitors_insert_guard"
  ON public.visitors FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.guards WHERE id = auth.uid()));

-- RLS Policies for visits - guards can manage their own visits
CREATE POLICY "visits_select_own_or_visitor"
  ON public.visits FOR SELECT
  USING (guard_id = auth.uid() OR visitor_id IN (
    SELECT id FROM public.visitors WHERE id = visitor_id
  ));

CREATE POLICY "visits_insert_guard"
  ON public.visits FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.guards WHERE id = auth.uid()));

CREATE POLICY "visits_update_own"
  ON public.visits FOR UPDATE
  USING (guard_id = auth.uid());

-- RLS Policies for pass_cards - guards can view and create
CREATE POLICY "pass_cards_select_guard"
  ON public.pass_cards FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.guards WHERE id = auth.uid()));

CREATE POLICY "pass_cards_insert_guard"
  ON public.pass_cards FOR INSERT
  WITH CHECK (issued_by = auth.uid());

CREATE POLICY "pass_cards_update_guard"
  ON public.pass_cards FOR UPDATE
  USING (issued_by = auth.uid());

-- RLS Policies for documents - guards can manage their uploads
CREATE POLICY "documents_select_guard"
  ON public.documents FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.guards WHERE id = auth.uid()));

CREATE POLICY "documents_insert_guard"
  ON public.documents FOR INSERT
  WITH CHECK (uploaded_by = auth.uid());

CREATE POLICY "documents_delete_guard"
  ON public.documents FOR DELETE
  USING (uploaded_by = auth.uid());
