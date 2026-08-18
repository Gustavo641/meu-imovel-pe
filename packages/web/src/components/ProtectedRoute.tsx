import { ReactNode } from 'react';
import { useHasPermission } from '../hooks/usePermissions';

interface ProtectedRouteProps {
  children: ReactNode;
  resource: string;
  action?: 'view' | 'edit' | 'export';
  fallback?: ReactNode;
}

export function ProtectedRoute({
  children,
  resource,
  action = 'view',
  fallback
}: ProtectedRouteProps) {
  const hasPermission = useHasPermission(resource, action);

  if (!hasPermission) {
    return fallback || <AccessDenied resource={resource} />;
  }

  return <>{children}</>;
}

export function AccessDenied({ resource }: { resource: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-display font-bold text-foreground">
          🔒 Acesso Negado
        </h1>
        <p className="text-muted-foreground text-lg">
          Você não tem permissão para acessar <span className="font-semibold">{resource}</span>
        </p>
        <p className="text-muted-foreground text-sm">
          Se acredita que isso é um erro, entre em contato com o administrador.
        </p>
        <div className="pt-4">
          <a
            href="/dashboard"
            className="inline-block px-6 py-2 btn-primary rounded-lg font-medium"
          >
            ← Voltar ao Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
