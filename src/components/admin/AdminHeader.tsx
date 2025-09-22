import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { getCurrentAdminRole } from '@/lib/auth-admin';
import { useTranslation } from 'react-i18next';

export const AdminHeader: React.FC = () => {
  const { user, signOut } = useAuth();
  const { t } = useTranslation(["admin", "common"]);
  
  const { data: adminRole } = useQuery({
    queryKey: ['admin-role', user?.id],
    queryFn: getCurrentAdminRole,
    enabled: !!user,
  });

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'default';
      case 'ANALYST':
        return 'secondary';
      case 'CONTENT':
        return 'outline';
      case 'SUPPORT':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return t("admin:users.roles.admin");
      case 'ANALYST':
        return t("admin:users.roles.analyst");
      case 'CONTENT':
        return t("admin:users.roles.content");
      case 'SUPPORT':
        return t("admin:users.roles.support");
      default:
        return t("admin:users.roles.user");
    }
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">{t("admin:title")}</h1>
          {adminRole && (
            <Badge variant={getRoleBadgeVariant(adminRole)} className="text-xs">
              {getRoleLabel(adminRole)}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <Home className="h-4 w-4 mr-2" />
              {t("admin:navigation.home")}
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profile?.avatar_url} alt={user?.email} />
                  <AvatarFallback>
                    {user?.profile?.first_name?.[0] || user?.email?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  {user?.profile?.first_name && (
                    <p className="font-medium">{user.profile.first_name} {user.profile.last_name}</p>
                  )}
                  <p className="w-[200px] truncate text-sm text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/dashboard">
                  <User className="mr-2 h-4 w-4" />
                  <span>{t("admin:navigation.profile")}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t("admin:navigation.logout")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};