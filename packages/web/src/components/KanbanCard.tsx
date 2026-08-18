import { useState } from 'react';
import { LEAD_ORIGINS, INVESTMENT_RANGES } from '@meu-imovel-pe/shared';
import type { Lead, LeadOrigin } from '@meu-imovel-pe/shared';

interface KanbanCardProps {
  lead: Lead;
  isDragging?: boolean;
  onDragStart?: (e: React.DragEvent, leadId: string) => void;
  onClick?: (leadId: string) => void;
}

export function KanbanCard({ lead, isDragging, onDragStart, onClick }: KanbanCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart?.(e, lead.id)}
      onClick={() => onClick?.(lead.id)}
      className={`bg-white rounded-lg border-l-4 border-blue-500 p-4 cursor-move transition-all hover:shadow-md ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-sm truncate flex-1">{lead.name}</h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowDetails(!showDetails);
          }}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          {showDetails ? '▼' : '▶'}
        </button>
      </div>

      {/* Contact Info */}
      <div className="text-xs text-gray-600 space-y-1 mb-3">
        {lead.email && <div>📧 {lead.email}</div>}
        {lead.phone && <div>📱 {lead.phone}</div>}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {lead.origin && (
          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
            {LEAD_ORIGINS[lead.origin as LeadOrigin]}
          </span>
        )}
        {lead.investment_range && (
          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded truncate">
            {INVESTMENT_RANGES[lead.investment_range as keyof typeof INVESTMENT_RANGES]}
          </span>
        )}
      </div>

      {/* Details (Expandable) */}
      {showDetails && (
        <div className="pt-3 border-t border-gray-200 text-xs text-gray-600 space-y-1">
          {lead.city && <div><strong>Cidade:</strong> {lead.city}</div>}
          {lead.neighborhood && <div><strong>Bairro:</strong> {lead.neighborhood}</div>}
          {lead.property_type && <div><strong>Tipo:</strong> {lead.property_type}</div>}
          {lead.family_income && <div><strong>Renda:</strong> {lead.family_income}</div>}
          {lead.notes && (
            <div className="mt-2 bg-gray-50 p-2 rounded">
              <strong>Notas:</strong> {lead.notes.substring(0, 100)}...
            </div>
          )}
        </div>
      )}

      {/* Footer - Lead ID for reference */}
      <div className="text-xs text-gray-400 mt-2 truncate">ID: {lead.id.substring(0, 8)}</div>
    </div>
  );
}
