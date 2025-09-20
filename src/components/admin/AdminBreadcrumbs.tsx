import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ChevronRight } from 'lucide-react';

const routeLabels: Record<string, string> = {
  admin: 'Dashboard',
  users: 'Usuarios',
  affiliation: 'Afiliación',
  lms: 'LMS',
  academy: 'Academia',
  signals: 'Señales',
  copy: 'Copy Trading',
  eas: 'EAs',
  tools: 'Herramientas',
  competitions: 'Competencias',
  community: 'Comunidad',
  referrals: 'Referidos',
  integrations: 'Integraciones',
  audit: 'Auditoría',
  settings: 'Configuración',
};

export const AdminBreadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  // Remove 'admin' from the beginning and build breadcrumbs
  const adminIndex = pathSegments.indexOf('admin');
  const breadcrumbSegments = pathSegments.slice(adminIndex);

  if (breadcrumbSegments.length <= 1) {
    return null; // Don't show breadcrumbs on dashboard
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/admin">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {breadcrumbSegments.slice(1).map((segment, index) => {
          const isLast = index === breadcrumbSegments.length - 2;
          const path = `/admin/${breadcrumbSegments.slice(1, index + 2).join('/')}`;
          const label = routeLabels[segment] || segment;

          return (
            <React.Fragment key={segment}>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={path}>{label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};