-- Seeding test data for Meu Imóvel.PE CRM
-- Run this in Supabase SQL Editor to populate test data

-- Insert test user (you need to create auth user first via Supabase UI)
-- This assumes you have a user with ID: replace-with-actual-user-uuid
-- Instructions: Create a user in Supabase Auth first, copy their UUID, and replace 'test-user-uuid' below

-- Insert test profile
INSERT INTO public.profiles (id, name, email, phone)
VALUES ('test-user-uuid', 'Serafim Tester', 'tester@meuimovel.pe', '85987654321')
ON CONFLICT DO NOTHING;

-- Insert test leads with various statuses and creation dates
INSERT INTO public.leads (id, user_id, name, email, phone, origin, status, investment_range, city, property_type, notes)
VALUES
  -- Hot leads (negociacao/proposta)
  ('lead-hot-1', 'test-user-uuid', 'João Silva', 'joao@email.com', '8598765432', 'instagram', 'negociacao', '400-600k', 'Recife', 'apartamento', 'Cliente muito interessado em apartamento de 3 quartos'),
  ('lead-hot-2', 'test-user-uuid', 'Maria Santos', 'maria@email.com', '8591234567', 'indicacao', 'proposta', '500-800k', 'Caruaru', 'casa', 'Proposta enviada em 15/08/2026'),

  -- Warm leads (em_atendimento/visita_agendada)
  ('lead-warm-1', 'test-user-uuid', 'Carlos Costa', 'carlos@email.com', '8597654321', 'facebook', 'em_atendimento', '300-500k', 'Pernambuco', 'terreno', 'Primeira conversa realizada'),
  ('lead-warm-2', 'test-user-uuid', 'Ana Oliveira', 'ana@email.com', '8598712345', 'site', 'visita_agendada', '600-900k', 'Olinda', 'casa', 'Visita agendada para 19/08/2026 às 14:00'),

  -- Cold leads (created recently but without much interaction)
  ('lead-cold-1', 'test-user-uuid', 'Pedro Mendes', 'pedro@email.com', '8599876543', 'olx', 'primeiro_contato', '200-400k', 'Jaboatão', 'apartamento', NULL),
  ('lead-cold-2', 'test-user-uuid', 'Lucia Ferreira', 'lucia@email.com', '8592468135', 'whatsapp', 'qualificado', '800k-1.2m', 'Recife', 'apartamento', 'Lead qualificado após entrevista'),

  -- Closed leads (venda_concluida)
  ('lead-closed-1', 'test-user-uuid', 'Roberto Alves', 'roberto@email.com', '8591357924', 'indicacao', 'venda_concluida', '1.2m+', 'Porto de Galinhas', 'casa', 'Venda finalizada em 10/08/2026')
ON CONFLICT DO NOTHING;

-- Optional: Insert some lead interactions
INSERT INTO public.lead_interactions (id, lead_id, type, notes, created_by)
VALUES
  ('interaction-1', 'lead-hot-1', 'whatsapp', 'Cliente enviou foto de referência do imóvel desejado', 'test-user-uuid'),
  ('interaction-2', 'lead-hot-1', 'ligacao', 'Confirmação da reunião de amanhã', 'test-user-uuid'),
  ('interaction-3', 'lead-warm-1', 'email', 'Envio de lista de imóveis disponíveis', 'test-user-uuid'),
  ('interaction-4', 'lead-warm-2', 'ligacao', 'Confirmação de visita agendada', 'test-user-uuid'),
  ('interaction-5', 'lead-cold-1', 'whatsapp', 'Primeira abordagem via WhatsApp', 'test-user-uuid'),
  ('interaction-6', 'lead-closed-1', 'nota', 'Cliente muito satisfeito com o imóvel', 'test-user-uuid')
ON CONFLICT DO NOTHING;
