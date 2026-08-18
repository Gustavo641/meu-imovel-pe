import { useState } from 'react';
import { KanbanCard } from './KanbanCard';
import { LEAD_STATUS_CONFIG } from '@meu-imovel-pe/shared';
import type { Lead, LeadStatus } from '@meu-imovel-pe/shared';

interface KanbanColumnProps {
  status: LeadStatus;
  leads: Lead[];
  onDropLead: (leadId: string, newStatus: LeadStatus) => void;
  isMoving?: boolean;
  onSelectLead?: (leadId: string) => void;
}

export function KanbanColumn({
  status,
  leads,
  onDropLead,
  isMoving,
  onSelectLead,
}: KanbanColumnProps) {
  const [dragOvered, setDragOvered] = useState(false);
  const config = LEAD_STATUS_CONFIG[status];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOvered(true);
  };

  const handleDragLeave = () => {
    setDragOvered(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOvered(false);

    const leadId = e.dataTransfer.getData('leadId');
    if (leadId) {
      onDropLead(leadId, status);
    }
  };

  return (
    <div
      className={`flex flex-col bg-gray-50 rounded-lg p-4 min-h-96 transition-colors ${
        dragOvered ? 'bg-blue-50 border-2 border-blue-300' : 'border border-gray-200'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Header */}
      <div className="mb-4 pb-3 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: config.color }}
          />
          <h3 className="font-semibold text-gray-900">{config.label}</h3>
        </div>
        <p className="text-sm text-gray-600">{leads.length} leads</p>
      </div>

      {/* Cards */}
      <div className="flex-1 space-y-3 overflow-y-auto">
        {leads.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
            Nenhum lead aqui
          </div>
        ) : (
          leads.map((lead) => (
            <div
              key={lead.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('leadId', lead.id);
              }}
            >
              <KanbanCard
                lead={lead}
                onClick={onSelectLead}
              />
            </div>
          ))
        )}
      </div>

      {/* Drop indicator */}
      {dragOvered && (
        <div className="mt-4 pt-4 border-t-2 border-blue-300 text-center text-sm text-blue-600">
          ↓ Soltar aqui
        </div>
      )}
    </div>
  );
}
