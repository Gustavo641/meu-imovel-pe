import type { Lead } from '@meu-imovel-pe/shared';

interface LeadTemperatureProps {
  lead: Lead;
  size?: 'sm' | 'md' | 'lg';
}

export function LeadTemperature({ lead, size = 'md' }: LeadTemperatureProps) {
  const getTemperature = (): { label: string; color: string; bgColor: string; emoji: string } => {
    const createdAt = new Date(lead.created_at);
    const now = new Date();
    const daysOld = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));

    if (lead.status === 'venda_concluida') {
      return { label: 'Fechado', color: '#00BE6A', bgColor: 'rgba(0, 190, 106, 0.15)', emoji: '✅' };
    } else if (lead.status === 'negociacao' || lead.status === 'proposta') {
      return { label: 'Quente', color: '#F92240', bgColor: 'rgba(249, 34, 64, 0.15)', emoji: '🔥' };
    } else if (lead.status === 'em_atendimento' || lead.status === 'visita_agendada') {
      return { label: 'Morno', color: '#F9BD01', bgColor: 'rgba(249, 189, 1, 0.15)', emoji: '🌤️' };
    } else if (daysOld > 30) {
      return { label: 'Frio', color: '#00AEEE', bgColor: 'rgba(0, 174, 238, 0.15)', emoji: '❄️' };
    } else {
      return { label: 'Morno', color: '#F9BD01', bgColor: 'rgba(249, 189, 1, 0.15)', emoji: '🌤️' };
    }
  };

  const temp = getTemperature();
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span
      className={`${sizeClasses[size]} rounded-sm font-semibold inline-block tracking-wide uppercase badge-base`}
      style={{
        backgroundColor: temp.bgColor,
        color: temp.color,
        border: `1px solid ${temp.color}4D`
      }}
    >
      {temp.emoji} {temp.label}
    </span>
  );
}

export function getPriorityColor(temperature: string): string {
  const colors: { [key: string]: string } = {
    'Fechado': '#00BE6A',
    'Quente': '#F92240',
    'Morno': '#F9BD01',
    'Frio': '#00AEEE'
  };
  return colors[temperature] || '#9DA5B1';
}
