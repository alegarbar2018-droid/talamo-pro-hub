import React from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminBreadcrumbs } from './AdminBreadcrumbs';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useQuery } from '@tanstack/react-query';
import { getCurrentAdminRole } from '@/lib/auth-admin';
import { Loader2 } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Check admin role
  const { data: adminRole, isLoading: roleLoading } = useQuery({
    queryKey: ['admin-role', user?.id],
    queryFn: getCurrentAdminRole,
    enabled: !!user,
  });

  if (loading || roleLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal" />
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect if not admin
  if (!adminRole || adminRole === 'USER') {
    return <Navigate to="/" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <main className="flex-1 p-6 pt-4">
            <AdminBreadcrumbs />
            <div className="mt-4">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};