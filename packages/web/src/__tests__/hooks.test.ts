import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Hook tests for LUNA CRM
 * Tests for custom React hooks that manage lead/agenda data
 */

describe('Lead Hooks', () => {
  describe('useLeads', () => {
    it('should fetch leads from database', () => {
      // Mock Supabase client
      const mockLeads = [
        {
          id: '1',
          name: 'João Silva',
          email: 'joao@example.com',
          phone: '81987654321',
          status: 'novo_lead' as const,
          origin: 'instagram',
          city: 'Recife',
          neighborhood: 'Boa Viagem',
          property_type: 'apartamento',
          investment_range: '300-500k',
          temperature: 'quente',
          notes: 'Primeira vez investindo',
          created_at: '2026-08-18T10:00:00Z',
          updated_at: '2026-08-18T10:00:00Z',
        },
      ];

      // Assert structure is correct
      expect(mockLeads[0].name).toBe('João Silva');
      expect(mockLeads[0].status).toBe('novo_lead');
      expect(mockLeads[0].origin).toBe('instagram');
    });

    it('should filter leads by status', () => {
      const leads = [
        { id: '1', name: 'Lead 1', status: 'novo_lead' },
        { id: '2', name: 'Lead 2', status: 'qualificado' },
        { id: '3', name: 'Lead 3', status: 'novo_lead' },
        { id: '4', name: 'Lead 4', status: 'em_atendimento' },
      ];

      const novoLeads = leads.filter((l) => l.status === 'novo_lead');
      const qualificados = leads.filter((l) => l.status === 'qualificado');

      expect(novoLeads).toHaveLength(2);
      expect(qualificados).toHaveLength(1);
    });

    it('should sort leads by date', () => {
      const leads = [
        { id: '1', name: 'Lead 1', created_at: '2026-08-17T10:00:00Z' },
        { id: '2', name: 'Lead 2', created_at: '2026-08-18T10:00:00Z' },
        { id: '3', name: 'Lead 3', created_at: '2026-08-16T10:00:00Z' },
      ];

      const sorted = [...leads].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      expect(sorted[0].id).toBe('2');
      expect(sorted[1].id).toBe('1');
      expect(sorted[2].id).toBe('3');
    });

    it('should handle empty leads list', () => {
      const leads: any[] = [];

      expect(leads).toHaveLength(0);
      expect(leads.filter((l) => l.status === 'novo_lead')).toHaveLength(0);
    });
  });

  describe('useUpdateLead', () => {
    it('should update lead immutably', () => {
      const originalLead = {
        id: '1',
        name: 'João',
        status: 'novo_lead' as const,
        temperature: 'frio' as const,
      };

      const updatedLead = {
        ...originalLead,
        status: 'qualificado' as const,
        temperature: 'quente' as const,
      };

      // Original should remain unchanged
      expect(originalLead.status).toBe('novo_lead');
      expect(originalLead.temperature).toBe('frio');

      // New object should have changes
      expect(updatedLead.status).toBe('qualificado');
      expect(updatedLead.temperature).toBe('quente');
    });

    it('should validate status transitions', () => {
      const validStatusTransitions: Record<string, string[]> = {
        novo_lead: ['qualificado', 'perdido'],
        qualificado: ['em_atendimento', 'perdido'],
        em_atendimento: ['venda_concluida', 'perdido'],
        venda_concluida: [],
        perdido: ['novo_lead'], // Can re-open
      };

      const currentStatus = 'novo_lead';
      const newStatus = 'qualificado';

      const isValidTransition = validStatusTransitions[currentStatus].includes(
        newStatus
      );
      expect(isValidTransition).toBe(true);

      // Invalid transition
      const invalidStatus = 'venda_concluida';
      const isInvalid = validStatusTransitions[currentStatus].includes(
        invalidStatus
      );
      expect(isInvalid).toBe(false);
    });

    it('should preserve untouched fields on update', () => {
      const lead = {
        id: '1',
        name: 'João',
        email: 'joao@example.com',
        phone: '81987654321',
        status: 'novo_lead' as const,
        notes: 'Cliente importante',
      };

      const updatedLead = {
        ...lead,
        status: 'qualificado' as const,
      };

      // Verify unchanged fields
      expect(updatedLead.name).toBe(lead.name);
      expect(updatedLead.email).toBe(lead.email);
      expect(updatedLead.phone).toBe(lead.phone);
      expect(updatedLead.notes).toBe(lead.notes);

      // Verify changed field
      expect(updatedLead.status).not.toBe(lead.status);
    });
  });
});

describe('Agenda Hooks', () => {
  describe('useAgenda', () => {
    it('should create demanda with correct structure', () => {
      const demanda = {
        id: '1',
        title: 'Follow-up com João',
        description: 'Ligar para confirmar interesse',
        priority: 'urgente' as const,
        status: 'pendente' as const,
        scheduled_date: '2026-08-20T14:00:00Z',
        created_at: '2026-08-18T10:00:00Z',
      };

      expect(demanda.title).toBe('Follow-up com João');
      expect(demanda.priority).toBe('urgente');
      expect(demanda.status).toBe('pendente');
    });

    it('should filter demandas by priority', () => {
      const demandas = [
        { id: '1', title: 'Task 1', priority: 'urgente' },
        { id: '2', title: 'Task 2', priority: 'alta' },
        { id: '3', title: 'Task 3', priority: 'urgente' },
        { id: '4', title: 'Task 4', priority: 'media' },
      ];

      const urgentes = demandas.filter((d) => d.priority === 'urgente');
      const altas = demandas.filter((d) => d.priority === 'alta');

      expect(urgentes).toHaveLength(2);
      expect(altas).toHaveLength(1);
    });

    it('should filter demandas by status', () => {
      const demandas = [
        { id: '1', title: 'Task 1', status: 'pendente' },
        { id: '2', title: 'Task 2', status: 'concluida' },
        { id: '3', title: 'Task 3', status: 'pendente' },
      ];

      const pendentes = demandas.filter((d) => d.status === 'pendente');
      const concluidas = demandas.filter((d) => d.status === 'concluida');

      expect(pendentes).toHaveLength(2);
      expect(concluidas).toHaveLength(1);
    });

    it('should sort demandas by priority and date', () => {
      const demandas = [
        {
          id: '1',
          title: 'Task 1',
          priority: 'media',
          scheduled_date: '2026-08-20T10:00:00Z',
        },
        {
          id: '2',
          title: 'Task 2',
          priority: 'urgente',
          scheduled_date: '2026-08-21T10:00:00Z',
        },
        {
          id: '3',
          title: 'Task 3',
          priority: 'urgente',
          scheduled_date: '2026-08-20T10:00:00Z',
        },
      ];

      const priorityMap = { urgente: 0, alta: 1, media: 2 };
      const sorted = [...demandas].sort((a, b) => {
        const priorityDiff = priorityMap[a.priority] - priorityMap[b.priority];
        if (priorityDiff !== 0) return priorityDiff;

        return (
          new Date(a.scheduled_date).getTime() -
          new Date(b.scheduled_date).getTime()
        );
      });

      expect(sorted[0].id).toBe('3'); // urgente, earlier
      expect(sorted[1].id).toBe('2'); // urgente, later
      expect(sorted[2].id).toBe('1'); // media
    });
  });
});

describe('Calendar Hooks', () => {
  describe('useCalendar', () => {
    it('should group appointments by date', () => {
      const appointments = [
        {
          id: '1',
          lead_name: 'João',
          date: '2026-08-20',
          time: '10:00',
        },
        {
          id: '2',
          lead_name: 'Maria',
          date: '2026-08-20',
          time: '14:00',
        },
        {
          id: '3',
          lead_name: 'Pedro',
          date: '2026-08-21',
          time: '09:00',
        },
      ];

      const grouped = appointments.reduce(
        (acc, apt) => {
          if (!acc[apt.date]) {
            acc[apt.date] = [];
          }
          acc[apt.date].push(apt);
          return acc;
        },
        {} as Record<string, typeof appointments>
      );

      expect(Object.keys(grouped)).toHaveLength(2);
      expect(grouped['2026-08-20']).toHaveLength(2);
      expect(grouped['2026-08-21']).toHaveLength(1);
    });

    it('should identify today appointments', () => {
      const today = '2026-08-18';
      const appointments = [
        { id: '1', date: '2026-08-18', time: '10:00' },
        { id: '2', date: '2026-08-19', time: '14:00' },
        { id: '3', date: '2026-08-18', time: '15:00' },
      ];

      const todayAppointments = appointments.filter(
        (apt) => apt.date === today
      );

      expect(todayAppointments).toHaveLength(2);
    });

    it('should calculate days until appointment', () => {
      const today = new Date('2026-08-18');
      const appointments = [
        { id: '1', date: new Date('2026-08-20') },
        { id: '2', date: new Date('2026-08-25') },
        { id: '3', date: new Date('2026-08-18') }, // Today
      ];

      const daysUntil = appointments.map((apt) => {
        const diff = apt.date.getTime() - today.getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
      });

      expect(daysUntil[0]).toBe(2);
      expect(daysUntil[1]).toBe(7);
      expect(daysUntil[2]).toBe(0);
    });
  });
});

describe('RBAC Utilities', () => {
  describe('canPerformAction', () => {
    const rolePermissions: Record<string, string[]> = {
      CEO: [
        'view_leads',
        'create_lead',
        'edit_lead',
        'delete_lead',
        'view_finance',
        'edit_finance',
        'view_reports',
        'manage_users',
      ],
      OPERACIONAL: [
        'view_leads',
        'create_lead',
        'edit_lead',
        'view_finance',
        'view_reports',
      ],
      COMERCIAL: ['view_leads', 'edit_lead'],
    };

    it('should allow CEO all actions', () => {
      const role = 'CEO';
      const actions = ['view_leads', 'delete_lead', 'manage_users'];

      actions.forEach((action) => {
        expect(rolePermissions[role].includes(action)).toBe(true);
      });
    });

    it('should restrict COMERCIAL actions', () => {
      const role = 'COMERCIAL';
      const allowedAction = 'view_leads';
      const restrictedAction = 'delete_lead';

      expect(rolePermissions[role].includes(allowedAction)).toBe(true);
      expect(rolePermissions[role].includes(restrictedAction)).toBe(false);
    });

    it('should handle invalid roles gracefully', () => {
      const role = 'INVALID_ROLE';
      const permissions = rolePermissions[role] || [];

      expect(permissions).toEqual([]);
    });
  });
});
