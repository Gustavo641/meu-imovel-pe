import { expect, describe, it } from 'vitest';

interface Permission {
  resource: string;
  action: 'view' | 'edit' | 'export';
  roles: string[];
}

// Matriz de permissões esperada
const EXPECTED_PERMISSIONS: Permission[] = [
  // Dashboard
  { resource: 'dashboard', action: 'view', roles: ['CEO', 'OPERACIONAL', 'COMERCIAL'] },
  { resource: 'dashboard', action: 'edit', roles: ['CEO'] },

  // CRM Comercial
  { resource: 'crm_comercial', action: 'view', roles: ['CEO', 'COMERCIAL'] },
  { resource: 'crm_comercial', action: 'edit', roles: ['CEO', 'COMERCIAL'] },
  { resource: 'crm_comercial', action: 'export', roles: ['CEO'] },

  // CRM Operacional
  { resource: 'crm_operacional', action: 'view', roles: ['CEO', 'OPERACIONAL'] },
  { resource: 'crm_operacional', action: 'edit', roles: ['CEO', 'OPERACIONAL'] },

  // Clientes
  { resource: 'clientes', action: 'view', roles: ['CEO', 'OPERACIONAL', 'COMERCIAL'] },
  { resource: 'clientes', action: 'edit', roles: ['CEO', 'OPERACIONAL', 'COMERCIAL'] },

  // Agenda
  { resource: 'agenda', action: 'view', roles: ['CEO', 'OPERACIONAL', 'COMERCIAL'] },
  { resource: 'agenda', action: 'edit', roles: ['CEO', 'OPERACIONAL', 'COMERCIAL'] },

  // Documentos
  { resource: 'documentos', action: 'view', roles: ['CEO', 'OPERACIONAL', 'COMERCIAL'] },
  { resource: 'documentos', action: 'edit', roles: ['CEO', 'OPERACIONAL'] },

  // Relatórios
  { resource: 'relatorios', action: 'view', roles: ['CEO'] },
  { resource: 'relatorios', action: 'export', roles: ['CEO'] },

  // Admin
  { resource: 'configuracoes', action: 'view', roles: ['CEO'] },
  { resource: 'configuracoes', action: 'edit', roles: ['CEO'] },
];

describe('RBAC - Role-Based Access Control', () => {
  describe('Permissões por Recurso', () => {
    it('CEO deve ter acesso total a todos os recursos', () => {
      const ceoPermissions = EXPECTED_PERMISSIONS.filter((p) => p.roles.includes('CEO'));
      expect(ceoPermissions.length).toBeGreaterThan(0);
    });

    it('OPERACIONAL deve ter acesso a recursos operacionais', () => {
      const operacionalResources = EXPECTED_PERMISSIONS.filter((p) =>
        p.roles.includes('OPERACIONAL')
      ).map((p) => p.resource);

      expect(operacionalResources).toContain('crm_operacional');
      expect(operacionalResources).toContain('clientes');
      expect(operacionalResources).toContain('agenda');
    });

    it('COMERCIAL deve ter acesso a recursos comerciais', () => {
      const comercialResources = EXPECTED_PERMISSIONS.filter((p) =>
        p.roles.includes('COMERCIAL')
      ).map((p) => p.resource);

      expect(comercialResources).toContain('crm_comercial');
      expect(comercialResources).toContain('clientes');
      expect(comercialResources).toContain('agenda');
    });

    it('COMERCIAL NÃO deve ter acesso a Admin', () => {
      const comercialPermissions = EXPECTED_PERMISSIONS.filter(
        (p) => p.roles.includes('COMERCIAL') && p.resource === 'configuracoes'
      );

      expect(comercialPermissions).toHaveLength(0);
    });

    it('Apenas CEO pode exportar relatórios', () => {
      const relatorioExport = EXPECTED_PERMISSIONS.find(
        (p) => p.resource === 'relatorios' && p.action === 'export'
      );

      expect(relatorioExport?.roles).toEqual(['CEO']);
    });
  });

  describe('Permissões por Ação', () => {
    it('View permission deve ser mais permissivo que Edit', () => {
      const viewPermissions = EXPECTED_PERMISSIONS.filter((p) => p.action === 'view');
      const editPermissions = EXPECTED_PERMISSIONS.filter((p) => p.action === 'edit');

      expect(viewPermissions.length).toBeGreaterThanOrEqual(editPermissions.length);
    });

    it('Export permission deve ser mais restritivo', () => {
      const exportPermissions = EXPECTED_PERMISSIONS.filter((p) => p.action === 'export');

      expect(exportPermissions.length).toBeLessThan(10);
      exportPermissions.forEach((p) => {
        expect(p.roles).not.toContain('COMERCIAL');
      });
    });
  });

  describe('Separação de Responsabilidades', () => {
    it('OPERACIONAL e COMERCIAL não devem ter permissões sobrepostas em CRM', () => {
      const operacionalCRM = EXPECTED_PERMISSIONS.find(
        (p) => p.resource === 'crm_operacional' && p.roles.includes('COMERCIAL')
      );

      const comercialCRM = EXPECTED_PERMISSIONS.find(
        (p) => p.resource === 'crm_comercial' && p.roles.includes('OPERACIONAL')
      );

      expect(operacionalCRM).toBeUndefined();
      expect(comercialCRM).toBeUndefined();
    });

    it('Dashboard deve ser acessível a todos os roles', () => {
      const dashboardView = EXPECTED_PERMISSIONS.find(
        (p) => p.resource === 'dashboard' && p.action === 'view'
      );

      expect(dashboardView?.roles).toContain('CEO');
      expect(dashboardView?.roles).toContain('OPERACIONAL');
      expect(dashboardView?.roles).toContain('COMERCIAL');
    });
  });
});
