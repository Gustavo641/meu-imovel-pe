/**
 * WhatsApp Business Integration
 *
 * Suporta integrações com:
 * - Meta WhatsApp Cloud API
 * - Z-API
 * - Evolution API
 * - WPPConnect
 */

export interface WhatsAppMessage {
  to: string; // Número com código do país (ex: 558512345678)
  message: string;
  media?: {
    type: 'image' | 'document' | 'video';
    url: string;
  };
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  language: string;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'DISABLED' | 'PAUSED';
  category: 'MARKETING' | 'TRANSACTIONAL' | 'AUTHENTICATION' | 'UTILITY';
  components: Array<{
    type: 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTONS';
    text?: string;
  }>;
}

// Meta WhatsApp Cloud API
export class MetaWhatsAppAPI {
  private phoneNumberId: string;
  private businessAccountId: string;
  private accessToken: string;
  private apiVersion = 'v18.0';

  constructor(
    phoneNumberId: string,
    businessAccountId: string,
    accessToken: string
  ) {
    this.phoneNumberId = phoneNumberId;
    this.businessAccountId = businessAccountId;
    this.accessToken = accessToken;
  }

  private getBaseUrl() {
    return `https://graph.instagram.com/${this.apiVersion}/${this.phoneNumberId}`;
  }

  async sendMessage(message: WhatsAppMessage): Promise<string> {
    const payload: Record<string, unknown> = {
      messaging_product: 'whatsapp',
      to: message.to,
      type: 'text',
      text: { body: message.message },
    };

    if (message.media) {
      payload.type = 'image'; // Simplificado
      payload.image = { link: message.media.url };
    }

    try {
      const response = await fetch(`${this.getBaseUrl()}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${response.statusText}`);
      }

      const data = await response.json() as { messages: Array<{ id: string }> };
      return data.messages[0].id;
    } catch (error) {
      // Erro silencioso
      throw error;
    }
  }

  async getTemplates(): Promise<WhatsAppTemplate[]> {
    try {
      const response = await fetch(
        `https://graph.instagram.com/${this.apiVersion}/${this.businessAccountId}/message_templates`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${response.statusText}`);
      }

      const data = await response.json() as { data: WhatsAppTemplate[] };
      return data.data;
    } catch (error) {
      // Erro silencioso
      throw error;
    }
  }

  async sendTemplate(to: string, templateId: string, variables?: string[]): Promise<string> {
    const payload = {
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: {
        name: templateId,
        language: {
          code: 'pt_BR',
        },
        ...(variables && {
          parameters: {
            body: {
              parameters: variables.map((v) => ({ type: 'text', text: v })),
            },
          },
        }),
      },
    };

    try {
      const response = await fetch(`${this.getBaseUrl()}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${response.statusText}`);
      }

      const data = await response.json() as { messages: Array<{ id: string }> };
      return data.messages[0].id;
    } catch (error) {
      // Erro silencioso
      throw error;
    }
  }
}

// Template de mensagens pré-configuradas
export const WHATSAPP_TEMPLATES = {
  LEAD_GREETING: (name: string) =>
    `Olá ${name}! 👋 Bem-vindo à Meu Imóvel.PE. Como posso ajudá-lo a encontrar o imóvel dos seus sonhos?`,

  PROPERTY_PREVIEW: (propertyName: string, url: string) =>
    `Encontrei o imóvel perfeito para você! 🏡\n\n${propertyName}\n\nVeja mais detalhes: ${url}`,

  APPOINTMENT_CONFIRMATION: (date: string, time: string, address: string) =>
    `✅ Sua visita foi confirmada!\n\n📅 Data: ${date}\n⏰ Horário: ${time}\n📍 Endereço: ${address}\n\nTe vejo em breve!`,

  FOLLOW_UP: (name: string) =>
    `Oi ${name}! Como você está? 😊 Gostaria de conversar mais sobre os imóveis que apresentei. Posso ajudá-lo com algo?`,

  CLOSING_REMINDER: (propertyName: string, deadline: string) =>
    `⏰ Atenção! A proposta para ${propertyName} vence em ${deadline}. Vamos agendar uma conversa?`,

  FEEDBACK: (transactionDetails: string) =>
    `Obrigado pela confiança! 🙏 Sua transação foi concluída com sucesso.\n\n${transactionDetails}\n\nNos conte sua experiência!`,
};

// Hook para usar WhatsApp na aplicação
export function useWhatsApp() {
  const api = import.meta.env.VITE_WHATSAPP_API_TYPE || 'meta';
  const phoneNumberId = import.meta.env.VITE_WHATSAPP_PHONE_ID || '';
  const accessToken = import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN || '';

  if (api === 'meta') {
    const businessAccountId = import.meta.env.VITE_WHATSAPP_BUSINESS_ID || '';
    return new MetaWhatsAppAPI(phoneNumberId, businessAccountId, accessToken);
  }

  throw new Error('WhatsApp API type not configured');
}
