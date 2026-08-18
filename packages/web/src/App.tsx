import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { useAuthStore } from './hooks/useAuth';
import { LoginForm } from './components/LoginForm';
import { SignupForm } from './components/SignupForm';
import { ForgotPasswordForm } from './components/ForgotPasswordForm';
import { Dashboard } from './pages/Dashboard';
import { Leads } from './pages/Leads';
import { Calendar } from './pages/Calendar';
import { Funnel } from './pages/Funnel';
import { Clientes } from './pages/Clientes';
import './styles/globals.css';

const queryClient = new QueryClient();

type AuthScreen = 'login' | 'signup' | 'forgot-password';

function AppContent() {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const initAuth = useAuthStore((state) => state.initAuth);
  const signOut = useAuthStore((state) => state.signOut);
  const [active, setActive] = useState('dashboard');
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');
  const navigate = useNavigate();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-foreground">Carregando...</div>;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        {authScreen === 'login' && (
          <LoginForm
            onSwitchToSignup={() => setAuthScreen('signup')}
            onSwitchToForgotPassword={() => setAuthScreen('forgot-password')}
          />
        )}
        {authScreen === 'signup' && (
          <SignupForm
            onSignupSuccess={() => setAuthScreen('login')}
            onSwitchToLogin={() => setAuthScreen('login')}
          />
        )}
        {authScreen === 'forgot-password' && (
          <ForgotPasswordForm
            onSwitchToLogin={() => setAuthScreen('login')}
          />
        )}
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-surface border-b border-sidebar-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-display font-bold bg-gradient-primary bg-clip-text text-transparent">
            LUNA CRM
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm text-destructive hover:text-destructive-foreground hover:bg-destructive hover:bg-opacity-10 rounded-md transition-all"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="md:col-span-1">
          <nav className="space-y-2 sticky top-24 bg-sidebar rounded-2xl p-4">
            <NavLink
              label="Dashboard"
              active={active === 'dashboard'}
              onClick={() => setActive('dashboard')}
            />
            <NavLink
              label="Gestão de Leads"
              active={active === 'leads'}
              onClick={() => setActive('leads')}
            />
            <NavLink
              label="Funil de Vendas"
              active={active === 'funnel'}
              onClick={() => setActive('funnel')}
            />
            <NavLink
              label="Agenda"
              active={active === 'calendar'}
              onClick={() => setActive('calendar')}
            />
            <NavLink
              label="Clientes"
              active={active === 'clientes'}
              onClick={() => setActive('clientes')}
            />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="md:col-span-3">
          {active === 'dashboard' && <Dashboard />}
          {active === 'leads' && <Leads />}
          {active === 'funnel' && <Funnel />}
          {active === 'calendar' && <Calendar />}
          {active === 'clientes' && <Clientes />}
        </main>
      </div>
    </div>
  );
}

interface NavLinkProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function NavLink({ label, active = false, onClick }: NavLinkProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
        active
          ? 'bg-sidebar-primary text-primary-foreground'
          : 'text-sidebar-foreground hover:bg-sidebar-accent'
      }`}
    >
      {label}
    </button>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<AppContent />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
