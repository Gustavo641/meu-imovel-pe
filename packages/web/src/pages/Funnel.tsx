import { useState } from 'react';
import { Kanban } from '../components/Kanban';

interface LeadDetail {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export function Funnel() {
  const [selectedLead, setSelectedLead] = useState<LeadDetail | null>(null);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Funil de Vendas</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Kanban Board */}
        <div className="lg:col-span-3">
          <Kanban onSelectLead={(leadId) => {
            setSelectedLead({ id: leadId, name: 'Lead' });
          }} />
        </div>

        {/* Sidebar - Lead Details (Future Enhancement) */}
        {selectedLead && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-32 h-fit">
            <h3 className="text-lg font-bold mb-4">Detalhes do Lead</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Nome</label>
                <p className="text-lg font-semibold">{selectedLead.name}</p>
              </div>
              {selectedLead.email && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-sm">{selectedLead.email}</p>
                </div>
              )}
              {selectedLead.phone && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Telefone</label>
                  <p className="text-sm">{selectedLead.phone}</p>
                </div>
              )}
              <button
                onClick={() => setSelectedLead(null)}
                className="w-full mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
