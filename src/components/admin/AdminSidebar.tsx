import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Copy,
  Bot,
  Wrench,
  Trophy,
  MessageSquare,
  Share2,
  Zap,
  FileText,
  Settings,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getCurrentAdminRole, hasAdminPermission } from '@/lib/auth-admin';

const menuItems = [
  {
    section: 'Principal',
    items: [
      { title: 'Dashboard', url: '/admin', icon: LayoutDashboard, permissions: [] },
      { title: 'Usuarios', url: '/admin/users', icon: Users, permissions: ['users'] },
      { title: 'Afiliación', url: '/admin/affiliation', icon: UserCheck, permissions: ['affiliation'] },
    ],
  },
  {
    section: 'Contenidos',
    items: [
      { title: 'LMS', url: '/admin/lms', icon: BookOpen, permissions: ['lms'] },
      { title: 'Academia', url: '/admin/academy', icon: GraduationCap, permissions: ['academy'] },
      { title: 'Señales', url: '/admin/signals', icon: TrendingUp, permissions: ['signals'] },
      { title: 'Copy Trading', url: '/admin/copy', icon: Copy, permissions: ['copy'] },
      { title: 'EAs', url: '/admin/eas', icon: Bot, permissions: ['eas'] },
      { title: 'Herramientas', url: '/admin/tools', icon: Wrench, permissions: ['tools'] },
    ],
  },
  {
    section: 'Comunidad',
    items: [
      { title: 'Competencias', url: '/admin/competitions', icon: Trophy, permissions: ['competitions'] },
      { title: 'Foros', url: '/admin/community', icon: MessageSquare, permissions: ['community'] },
      { title: 'Referidos', url: '/admin/referrals', icon: Share2, permissions: ['referrals'] },
    ],
  },
  {
    section: 'Sistema',
    items: [
      { title: 'Analíticas', url: '/admin/analytics', icon: TrendingUp, permissions: ['analytics'] },
      { title: 'Integraciones', url: '/admin/integrations', icon: Zap, permissions: ['integrations'] },
      { title: 'Auditoría', url: '/admin/audit', icon: FileText, permissions: ['audit'] },
      { title: 'Configuración', url: '/admin/settings', icon: Settings, permissions: [] },
    ],
  },
];

export const AdminSidebar: React.FC = () => {
  const { open } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const { data: adminRole } = useQuery({
    queryKey: ['admin-role'],
    queryFn: getCurrentAdminRole,
  });

  const getNavClassName = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'bg-teal/10 text-teal border-r-2 border-teal' : 'hover:bg-muted/50';

  const canAccessItem = async (permissions: string[]) => {
    if (adminRole === 'ADMIN') return true;
    if (permissions.length === 0) return true;
    
    for (const permission of permissions) {
      if (await hasAdminPermission(permission, 'manage') || await hasAdminPermission(permission, 'read')) {
        return true;
      }
    }
    return false;
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarTrigger className="m-2 self-end" />
      
      <SidebarContent>
        <div className="p-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-to-br from-teal to-teal/60 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            {open && <span className="font-bold text-lg">Tálamo Admin</span>}
          </div>
        </div>

        {menuItems.map((section) => (
          <SidebarGroup key={section.section} className="px-2">
            {open && <SidebarGroupLabel>{section.section}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items
                  .filter(item => {
                    // Hide analytics for non-admin/analyst users
                    if (item.url === '/admin/analytics') {
                      return adminRole === 'ADMIN' || adminRole === 'ANALYST';
                    }
                    return true;
                  })
                  .map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        className={({ isActive }) => 
                          `${getNavClassName({ isActive })} ${!open ? 'w-full flex items-center justify-center' : ''}`
                        }
                      >
                        <item.icon className="h-4 w-4" />
                        {open && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
};