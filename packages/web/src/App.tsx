import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { useAuthStore } from './hooks/useAuth';
import { LoginForm } from './components/LoginForm';
import { Dashboard } from './pages/Dashboard';
import { Leads } from './pages/Leads';
import { Calendar } from './pages/Calendar';
import './styles/globals.css';

const queryClient = new QueryClient();

function AppContent() {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const initAuth = useAuthStore((state) => state.initAuth);
  const signOut = useAuthStore((state) => state.signOut);
  const [active, setActive] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoginForm />
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Meu Imóvel.PE</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user.email}</span>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm text-red-600 hover:text-red-700"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="md:col-span-1">
          <nav className="space-y-2 sticky top-24">
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
              label="Agenda"
              active={active === 'calendar'}
              onClick={() => setActive('calendar')}
            />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="md:col-span-3">
          {active === 'dashboard' && <Dashboard />}
          {active === 'leads' && <Leads />}
          {active === 'calendar' && <Calendar />}
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
      className={`w-full text-left px-4 py-2 rounded-lg transition ${
        active
          ? 'bg-blue-600 text-white'
          : 'text-gray-700 hover:bg-gray-100'
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
