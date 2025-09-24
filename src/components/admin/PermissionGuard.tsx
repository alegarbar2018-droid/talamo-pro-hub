/**
 * Permission-based access control component for admin features
 */
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { hasAdminPermission, getCurrentAdminRole } from '@/lib/auth-admin';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface PermissionGuardProps {
  resource: string;
  action: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiredRoles?: string[];
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  resource,
  action,
  children,
  fallback,
  requiredRoles = [],
}) => {
  const { data: userRole, isLoading: roleLoading } = useQuery({
    queryKey: ['admin-role'],
    queryFn: getCurrentAdminRole,
  });

  const { data: hasPermission, isLoading: permissionLoading } = useQuery({
    queryKey: ['admin-permission', resource, action],
    queryFn: () => hasAdminPermission(resource, action),
    enabled: !!userRole,
  });

  if (roleLoading || permissionLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-teal" />
        <span className="ml-2 text-muted-foreground">Verificando permisos...</span>
      </div>
    );
  }

  // Check role-based access if required roles are specified
  if (requiredRoles.length > 0 && userRole && !requiredRoles.includes(userRole)) {
    return fallback || (
      <Alert className="border-warning/20 bg-warning/10">
        <AlertTriangle className="h-4 w-4 text-warning" />
        <AlertDescription>
          No tiene los permisos necesarios para acceder a esta funcionalidad.
          Roles requeridos: {requiredRoles.join(', ')}
        </AlertDescription>
      </Alert>
    );
  }

  // Check permission-based access
  if (!hasPermission) {
    return fallback || (
      <Alert className="border-destructive/20 bg-destructive/10">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        <AlertDescription>
          Acceso denegado. No tiene permisos para realizar la acción '{action}' en el recurso '{resource}'.
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
};