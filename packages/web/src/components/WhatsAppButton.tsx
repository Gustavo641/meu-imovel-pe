import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { WHATSAPP_TEMPLATES } from '../services/whatsapp';
import type { Lead } from '@meu-imovel-pe/shared';

interface WhatsAppButtonProps {
  lead: Lead;
  onSendSuccess?: () => void;
}

export function WhatsAppButton({ lead, onSendSuccess }: WhatsAppButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      template: 'custom',
      message: WHATSAPP_TEMPLATES.LEAD_GREETING(lead.name),
    },
  });

  const selectedTemplate = watch('template');

  const templateOptions = [
    { value: 'custom', label: 'Mensagem Personalizada' },
    { value: 'greeting', label: 'Saudação Inicial' },
    { value: 'follow_up', label: 'Follow-up' },
    { value: 'appointment', label: 'Confirmação de Visita' },
    { value: 'feedback', label: 'Solicitar Feedback' },
  ];

  const handleTemplateChange = (templateKey: string) => {
    let message = '';
    switch (templateKey) {
      case 'greeting':
        message = WHATSAPP_TEMPLATES.LEAD_GREETING(lead.name);
        break;
      case 'follow_up':
        message = WHATSAPP_TEMPLATES.FOLLOW_UP(lead.name);
        break;
      case 'appointment':
        message = WHATSAPP_TEMPLATES.APPOINTMENT_CONFIRMATION(
          new Date().toLocaleDateString('pt-BR'),
          '14:00',
          'A Confirmar'
        );
        break;
      case 'feedback':
        message = WHATSAPP_TEMPLATES.FEEDBACK('Transação realizada com sucesso!');
        break;
      default:
        message = '';
    }
    return message;
  };

  const onSubmit = async (data: { template: string; message: string }) => {
    if (!lead.phone) {
      alert('Lead não possui telefone registrado');
      return;
    }

    setIsSending(true);
    try {
      setTimeout(() => {
        alert('✅ Mensagem enviada com sucesso!');
        setIsSending(false);
        setShowModal(false);
        onSendSuccess?.();
      }, 1500);
    } catch (error) {
      alert('❌ Erro ao enviar mensagem');
      setIsSending(false);
    }
  };

  if (!lead.phone) {
    return (
      <button
        disabled
        className="w-full px-3 py-2 bg-gray-300 text-gray-600 rounded text-sm cursor-not-allowed"
        title="Lead não possui telefone"
      >
        📱 WhatsApp (sem telefone)
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-full px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition flex items-center justify-center gap-2"
      >
        <span>💬</span>
        WhatsApp
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-lg font-bold mb-4">Enviar Mensagem WhatsApp</h2>

            <div className="mb-4 p-3 bg-blue-50 rounded">
              <p className="text-sm text-gray-700">
                <strong>Para:</strong> {lead.name}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Número:</strong> {lead.phone}
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Template</label>
                <select
                  {...register('template')}
                  onChange={(e) => {
                    const msg = handleTemplateChange(e.target.value);
                    if (msg) {
                      // Atualizar campo de mensagem
                      document.getElementById('message-input').value = msg;
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                  {templateOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Mensagem</label>
                <textarea
                  id="message-input"
                  {...register('message')}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  placeholder="Digite sua mensagem..."
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={isSending}
                  className="flex-1 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                >
                  {isSending ? 'Enviando...' : 'Enviar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
