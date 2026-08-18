import { create } from 'zustand';
import { supabase } from '../services/supabase';

export type UserRole = 'CEO' | 'OPERACIONAL' | 'COMERCIAL';

interface Permission {
  resource: string;
  action: 'view' | 'edit' | 'export';
}

interface PermissionStore {
  role: UserRole | null;
  permissions: Permission[];
  seeAllDemands: boolean;
  loading: boolean;
  error: string | null;

  // Methods
  loadPermissions: (userId: string) => Promise<void>;
  hasPermission: (resource: string, action: 'view' | 'edit' | 'export') => boolean;
  canView: (resource: string) => boolean;
  canEdit: (resource: string) => boolean;
  canExport: (resource: string) => boolean;
  reset: () => void;
}

export const usePermissionStore = create<PermissionStore>((set, get) => ({
  role: null,
  permissions: [],
  seeAllDemands: false,
  loading: false,
  error: null,

  loadPermissions: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      // 1. Carregar perfil do usuário (role_id)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role_id')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      // 2. Carregar dados do cargo
      const { data: role, error: roleError } = await supabase
        .from('roles')
        .select('name, see_all_demands')
        .eq('id', profile.role_id)
        .single();

      if (roleError) throw roleError;

      // 3. Carregar permissões
      const { data: permissions, error: permError } = await supabase
        .from('role_permissions')
        .select('resource, action')
        .eq('role_id', profile.role_id);

      if (permError) throw permError;

      set({
        role: role.name as UserRole,
        permissions: permissions || [],
        seeAllDemands: role.see_all_demands,
        loading: false
      });
    } catch (error) {
      set({
        error: String(error),
        loading: false
      });
      // Erro ao carregar permissões
    }
  },

  hasPermission: (resource: string, action: 'view' | 'edit' | 'export') => {
    const { permissions } = get();
    return permissions.some(
      (p) => p.resource === resource && p.action === action
    );
  },

  canView: (resource: string) => {
    return get().hasPermission(resource, 'view');
  },

  canEdit: (resource: string) => {
    return get().hasPermission(resource, 'edit');
  },

  canExport: (resource: string) => {
    return get().hasPermission(resource, 'export');
  },

  reset: () => {
    set({
      role: null,
      permissions: [],
      seeAllDemands: false,
      loading: false,
      error: null
    });
  }
}));

// Hook customizado para verificação de permissão
export function useHasPermission(resource: string, action: 'view' | 'edit' | 'export' = 'view') {
  const hasPermission = usePermissionStore((state) => state.hasPermission);
  return hasPermission(resource, action);
}

// Hook para verificar se pode acessar módulo
export function useCanAccessModule(module: string) {
  return useHasPermission(module, 'view');
}
