import { Kanban } from '../components/Kanban';
import { ProtectedRoute } from '../components/ProtectedRoute';

const COMMERCIAL_STAGES = [
  'lead',
  'primeiro_contato',
  'reuniao',
  'novo_evento',
  'proposta',
  'entrada_operacional',
  'comissoes_a_pagar',
  'comissoes_pagas'
];

export function CRMComercial() {
  return (
    <ProtectedRoute resource="crm_comercial" action="view">
      <Kanban stages={COMMERCIAL_STAGES} pipeline="comercial" />
    </ProtectedRoute>
  );
}
