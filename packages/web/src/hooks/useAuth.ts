import { create } from 'zustand';
import { supabase, getCurrentUser, signOut as supabaseSignOut } from '../services/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthStore {
  user: User | null;
  loading: boolean;
  error: string | null;
  initAuth: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  error: null,

  initAuth: async () => {
    try {
      set({ loading: true, error: null });
      const user = await getCurrentUser();
      set({ user, loading: false });
    } catch (error) {
      set({ error: String(error), loading: false });
    }
  },

  signOut: async () => {
    try {
      await supabaseSignOut();
      set({ user: null });
    } catch (error) {
      set({ error: String(error) });
    }
  },
}));

// Subscribe to auth state changes
supabase.auth.onAuthStateChange((_event, session) => {
  useAuthStore.setState({ user: session?.user ?? null });
});
