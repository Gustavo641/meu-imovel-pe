-- Criar tabela de perfis estendida
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de leads
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  origin TEXT NOT NULL DEFAULT 'site',
  status TEXT NOT NULL DEFAULT 'novo_lead',
  investment_range TEXT,
  family_income TEXT,
  city TEXT,
  neighborhood TEXT,
  property_type TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_origin CHECK (origin IN ('instagram', 'facebook', 'olx', 'viva_real', 'whatsapp', 'indicacao', 'site', 'portal')),
  CONSTRAINT valid_status CHECK (status IN ('novo_lead', 'primeiro_contato', 'qualificado', 'em_atendimento', 'visita_agendada', 'proposta', 'negociacao', 'venda_concluida', 'perdido'))
);

-- Criar índices para leads
CREATE INDEX idx_leads_user_id ON public.leads(user_id);
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_user_status ON public.leads(user_id, status);
CREATE INDEX idx_leads_created_at ON public.leads(created_at DESC);

-- Criar tabela de interações
CREATE TABLE IF NOT EXISTS public.lead_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  notes TEXT,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_interaction_type CHECK (type IN ('ligacao', 'whatsapp', 'email', 'visita', 'proposta', 'nota'))
);

-- Criar índices para interações
CREATE INDEX idx_lead_interactions_lead_id ON public.lead_interactions(lead_id);
CREATE INDEX idx_lead_interactions_created_at ON public.lead_interactions(created_at DESC);

-- Criar tabela de imóveis
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  address TEXT,
  city TEXT,
  price DECIMAL(12, 2),
  type TEXT NOT NULL,
  bedrooms INT,
  bathrooms INT,
  area DECIMAL(10, 2),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para properties
CREATE INDEX idx_properties_user_id ON public.properties(user_id);
CREATE INDEX idx_properties_city ON public.properties(city);

-- Criar tabela de agendamentos
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'agendada',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_appointment_status CHECK (status IN ('agendada', 'confirmada', 'realizada', 'cancelada'))
);

-- Criar índices para appointments
CREATE INDEX idx_appointments_user_id ON public.appointments(user_id);
CREATE INDEX idx_appointments_scheduled_date ON public.appointments(scheduled_date);
CREATE INDEX idx_appointments_lead_id ON public.appointments(lead_id);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Políticas RLS para leads
CREATE POLICY "Users can view their own leads" ON public.leads
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert leads" ON public.leads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own leads" ON public.leads
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own leads" ON public.leads
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para lead_interactions
CREATE POLICY "Users can view interactions for their leads" ON public.lead_interactions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.leads WHERE leads.id = lead_interactions.lead_id AND leads.user_id = auth.uid())
  );

CREATE POLICY "Users can create interactions on their leads" ON public.lead_interactions
  FOR INSERT WITH CHECK (
    created_by = auth.uid() AND
    EXISTS (SELECT 1 FROM public.leads WHERE leads.id = lead_interactions.lead_id AND leads.user_id = auth.uid())
  );

-- Políticas RLS para properties
CREATE POLICY "Users can view their properties" ON public.properties
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert properties" ON public.properties
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their properties" ON public.properties
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their properties" ON public.properties
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para appointments
CREATE POLICY "Users can view their appointments" ON public.appointments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create appointments" ON public.appointments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their appointments" ON public.appointments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their appointments" ON public.appointments
  FOR DELETE USING (auth.uid() = user_id);
