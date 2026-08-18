import { Kanban } from '../components/Kanban';
import { ProtectedRoute } from '../components/ProtectedRoute';

const OPERATIONAL_STAGES = [
  'entrada_operacional',
  'contrato',
  'pagamento_pendente',
  'pagamento_efetivado',
  'evento_em_andamento',
  'pos_evento',
  'concluido'
];

export function CRMOperacional() {
  return (
    <ProtectedRoute resource="crm_operacional" action="view">
      <Kanban stages={OPERATIONAL_STAGES} pipeline="operacional" />
    </ProtectedRoute>
  );
}
