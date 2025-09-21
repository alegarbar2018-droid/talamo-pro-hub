import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Eye, Edit, UserCheck, UserX, Filter } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { AdminRole, updateAdminUserRole, logAdminAction, getCurrentAdminRole } from '@/lib/auth-admin';
import { Skeleton } from '@/components/ui/skeleton';
import { maskSensitiveData, MaskingOptions } from '@/lib/admin-security';
import { checkPermission } from '@/lib/admin-rbac';

interface UserWithProfile {
  id: string;
  email: string;
  created_at: string;
  profiles: {
    first_name: string;
    last_name: string;
    avatar_url: string;
    phone: string;
  } | null;
  admin_users: {
    role: AdminRole;
  } | null;
  affiliations: {
    is_affiliated: boolean;
    partner_id: string;
  } | null;
}

export const AdminUsers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [affiliationFilter, setAffiliationFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<UserWithProfile | null>(null);
  const [currentAdminRole, setCurrentAdminRole] = useState<string | null>(null);
  
  const queryClient = useQueryClient();

  // Get current admin role for data masking
  const { data: adminRole } = useQuery({
    queryKey: ['current-admin-role'],
    queryFn: getCurrentAdminRole,
  });

  // Fetch users with profiles and admin roles
  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users', searchTerm, roleFilter, affiliationFilter],
    queryFn: async () => {
      // Check permissions for viewing user data
      const canViewFullProfiles = await checkPermission('users', 'read');
      const canViewSensitiveData = await checkPermission('users', 'read_sensitive');
      
      if (!canViewFullProfiles) {
        throw new Error('Insufficient permissions to view user profiles');
      }

      let query = supabase
        .from('profiles')
        .select(`
          id,
          user_id,
          first_name,
          last_name,
          avatar_url,
          email,
          phone,
          created_at,
          admin_users!left(role),
          affiliations!left(is_affiliated, partner_id)
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (searchTerm) {
        query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Apply data masking based on admin role and permissions
      const maskingOptions: MaskingOptions = {
        maskEmail: !canViewSensitiveData && adminRole !== 'ADMIN',
        maskPhone: !canViewSensitiveData && adminRole !== 'ADMIN',
        maskName: adminRole === 'SUPPORT' || adminRole === 'ANALYST',
      };

      const maskedData = data.map(user => maskSensitiveData(user, maskingOptions));

      // Filter by role
      let filteredData = maskedData;
      if (roleFilter !== 'all') {
        filteredData = data.filter(user => {
          const userRole = (user as any).admin_users?.role || 'USER';
          return userRole === roleFilter;
        });
      }

      // Filter by affiliation
      if (affiliationFilter !== 'all') {
        filteredData = filteredData.filter(user => {
          const isAffiliated = (user as any).affiliations?.is_affiliated || false;
          return affiliationFilter === 'affiliated' ? isAffiliated : !isAffiliated;
        });
      }

      return filteredData as any;
    },
  });

  // Update user role mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AdminRole }) => {
      // First check if admin_users record exists
      const { data: existingAdmin } = await supabase
        .from('admin_users')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (existingAdmin) {
        return updateAdminUserRole(userId, role);
      } else {
        // Create new admin_users record
        const { data, error } = await supabase
          .from('admin_users')
          .insert({ user_id: userId, role })
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: (data, variables) => {
      toast({
        title: 'Rol actualizado',
        description: `El rol del usuario ha sido actualizado a ${variables.role}`,
      });
      
      logAdminAction('user.role_updated', `User:${variables.userId}`, { 
        newRole: variables.role 
      });
      
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el rol del usuario',
        variant: 'destructive',
      });
    },
  });

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'default';
      case 'ANALYST': return 'secondary';
      case 'CONTENT': return 'outline';
      case 'SUPPORT': return 'secondary';
      default: return 'outline';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Administrador';
      case 'ANALYST': return 'Analista';
      case 'CONTENT': return 'Contenido';
      case 'SUPPORT': return 'Soporte';
      default: return 'Usuario';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
          <p className="text-muted-foreground">
            Gestión de usuarios y roles administrativos
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los roles</SelectItem>
                <SelectItem value="ADMIN">Administrador</SelectItem>
                <SelectItem value="ANALYST">Analista</SelectItem>
                <SelectItem value="CONTENT">Contenido</SelectItem>
                <SelectItem value="SUPPORT">Soporte</SelectItem>
                <SelectItem value="USER">Usuario</SelectItem>
              </SelectContent>
            </Select>

            <Select value={affiliationFilter} onValueChange={setAffiliationFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por afiliación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="affiliated">Afiliados</SelectItem>
                <SelectItem value="unaffiliated">No afiliados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
          <CardDescription>
            {users?.length || 0} usuario(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Afiliación</TableHead>
                <TableHead>Registro</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                       <Avatar className="h-8 w-8">
                         <AvatarImage src={user.avatar_url} />
                         <AvatarFallback>
                           {user.first_name?.[0] || 'U'}
                         </AvatarFallback>
                       </Avatar>
                       <div>
                         <p className="font-medium">
                           {user.first_name} {user.last_name}
                         </p>
                         <p className="text-sm text-muted-foreground">{user.phone}</p>
                       </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.admin_users?.role || 'USER')}>
                      {getRoleLabel(user.admin_users?.role || 'USER')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.affiliations?.is_affiliated ? (
                      <div className="flex items-center space-x-2">
                        <UserCheck className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Verificado</span>
                        {user.affiliations.partner_id && (
                          <Badge variant="outline" className="text-xs">
                            {user.affiliations.partner_id}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <UserX className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Sin verificar</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle>Detalles del Usuario</SheetTitle>
                            <SheetDescription>
                              Información completa y opciones de gestión
                            </SheetDescription>
                          </SheetHeader>
                          
                          {selectedUser && (
                            <div className="space-y-6 mt-6">
                               <div className="flex items-center space-x-4">
                                 <Avatar className="h-16 w-16">
                                   <AvatarImage src={selectedUser.avatar_url} />
                                   <AvatarFallback className="text-lg">
                                     {selectedUser.first_name?.[0] || 'U'}
                                   </AvatarFallback>
                                 </Avatar>
                                 <div>
                                   <h3 className="font-semibold text-lg">
                                     {selectedUser.first_name} {selectedUser.last_name}
                                   </h3>
                                   <p className="text-muted-foreground">{selectedUser.phone}</p>
                                   {selectedUser.email && (
                                     <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                                   )}
                                 </div>
                               </div>

                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium">Rol Administrativo</label>
                                  <Select
                                    value={selectedUser.admin_users?.role || 'USER'}
                                    onValueChange={(value) => {
                                      updateRoleMutation.mutate({
                                        userId: selectedUser.id,
                                        role: value as AdminRole,
                                      });
                                    }}
                                  >
                                    <SelectTrigger className="w-full mt-1">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="USER">Usuario</SelectItem>
                                      <SelectItem value="SUPPORT">Soporte</SelectItem>
                                      <SelectItem value="CONTENT">Contenido</SelectItem>
                                      <SelectItem value="ANALYST">Analista</SelectItem>
                                      <SelectItem value="ADMIN">Administrador</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <label className="text-sm font-medium">Estado de Afiliación</label>
                                  <div className="mt-2 p-3 border rounded-lg">
                                    {selectedUser.affiliations?.is_affiliated ? (
                                      <div className="flex items-center space-x-2">
                                        <UserCheck className="h-4 w-4 text-green-500" />
                                        <span className="text-sm">Verificado con Exness</span>
                                        {selectedUser.affiliations.partner_id && (
                                          <Badge variant="outline">
                                            ID: {selectedUser.affiliations.partner_id}
                                          </Badge>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="flex items-center space-x-2">
                                        <UserX className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">
                                          No verificado
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </SheetContent>
                      </Sheet>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};