import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { UserProgressView } from "@/components/admin/UserProgressView";
import { CreateUserDialog } from "@/components/admin/CreateUserDialog";
import { EditUserForms } from "@/components/admin/EditUserForms";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, Edit, UserCheck, UserX, Filter, Trash, Ban, ShieldCheck, Key, UserPlus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { AdminRole, updateAdminUserRole, getCurrentAdminRole } from "@/lib/auth-admin";
import { Skeleton } from "@/components/ui/skeleton";
import {
  maskSensitiveData,
  MaskingOptions,
  checkRateLimit,
  logSecurityEvent,
  generateCorrelationId,
} from "@/lib/admin-security";
import { checkPermission } from "@/lib/admin-rbac";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface UserWithProfile {
  id: string;
  user_id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  phone?: string;
  created_at: string;
  admin_users: {
    role: AdminRole;
  } | null;
  affiliations: {
    is_affiliated: boolean;
    partner_id: string;
  } | null;
}

export const AdminUsers: React.FC = () => {
  const { t } = useTranslation(["admin", "table", "forms"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [affiliationFilter, setAffiliationFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<UserWithProfile | null>(null);
  const [currentAdminRole, setCurrentAdminRole] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  // Get current admin role for data masking
  const { data: adminRole } = useQuery({
    queryKey: ["current-admin-role"],
    queryFn: getCurrentAdminRole,
  });

  // Fetch users with profiles and admin roles using Edge Function
  const { data: usersData, isLoading } = useQuery({
    queryKey: ["admin-users", searchTerm, roleFilter, affiliationFilter],
    queryFn: async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { data, error } = await supabase.functions.invoke("admin-users-list", {
        body: {
          q: searchTerm,
          role: roleFilter,
          affiliation: affiliationFilter,
          page: 1,
          perPage: 100,
        },
      });

      if (error) throw error;
      if (!data.ok) throw new Error(data.error);

      return data;
    },
  });

  const users = usersData?.items || [];

  // Update user role mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AdminRole }) => {
      const { data, error } = await supabase.functions.invoke("admin-users-assign-role", {
        body: { userId, role },
      });
      if (error) throw error;
      if (!data.ok) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      toast({
        title: t("admin:toasts.role_updated"),
        description: t("admin:toasts.role_updated_desc"),
      });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error) => {
      toast({
        title: t("admin:toasts.error"),
        description: t("admin:toasts.role_update_error"),
        variant: "destructive",
      });
    },
  });

  // Ban user mutation
  const banUserMutation = useMutation({
    mutationFn: async ({ userId, until }: { userId: string; until?: string }) => {
      const { data, error } = await supabase.functions.invoke("admin-users-ban", {
        body: { userId, until },
      });
      if (error) throw error;
      if (!data.ok) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      toast({
        title: t("admin:toasts.user_banned"),
      });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error) => {
      toast({
        title: t("admin:toasts.error"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Unban user mutation
  const unbanUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await supabase.functions.invoke("admin-users-unban", {
        body: { userId },
      });
      if (error) throw error;
      if (!data.ok) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      toast({
        title: t("admin:toasts.user_unbanned"),
      });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error) => {
      toast({
        title: t("admin:toasts.error"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Soft delete user mutation
  const softDeleteMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await supabase.functions.invoke("admin-users-soft-delete", {
        body: { userId },
      });
      if (error) throw error;
      if (!data.ok) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      toast({
        title: t("admin:toasts.user_deleted"),
        variant: "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error) => {
      toast({
        title: t("admin:toasts.error"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await supabase.functions.invoke("admin-users-reset-password", {
        body: { userId },
      });
      if (error) throw error;
      if (!data.ok) throw new Error(data.error);
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: t("admin:toasts.password_reset_sent"),
        description: `Email enviado a ${data.email}`,
      });
    },
    onError: (error) => {
      toast({
        title: t("admin:toasts.error"),
        description: t("admin:toasts.password_reset_error"),
        variant: "destructive",
      });
    },
  });

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "default";
      case "ANALYST":
        return "secondary";
      case "CONTENT":
        return "outline";
      case "SUPPORT":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "ADMIN":
        return t("admin:users.roles.admin");
      case "ANALYST":
        return t("admin:users.roles.analyst");
      case "CONTENT":
        return t("admin:users.roles.content");
      case "SUPPORT":
        return t("admin:users.roles.support");
      default:
        return t("admin:users.roles.user");
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
          <h1 className="text-3xl font-bold tracking-tight">{t("admin:users.title")}</h1>
          <p className="text-muted-foreground">{t("admin:users.subtitle")}</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          {t("admin:users.actions.create")}
        </Button>
      </div>

      {/* Create User Dialog */}
      <CreateUserDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("admin:users.search")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder={t("admin:users.filters.role")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("admin:users.filters.all_roles")}</SelectItem>
                <SelectItem value="ADMIN">{t("admin:users.roles.admin")}</SelectItem>
                <SelectItem value="ANALYST">{t("admin:users.roles.analyst")}</SelectItem>
                <SelectItem value="CONTENT">{t("admin:users.roles.content")}</SelectItem>
                <SelectItem value="SUPPORT">{t("admin:users.roles.support")}</SelectItem>
                <SelectItem value="USER">{t("admin:users.roles.user")}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={affiliationFilter} onValueChange={setAffiliationFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder={t("admin:users.filters.affiliation")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("admin:users.filters.all")}</SelectItem>
                <SelectItem value="affiliated">{t("admin:users.filters.affiliated")}</SelectItem>
                <SelectItem value="unaffiliated">{t("admin:users.filters.unaffiliated")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t("admin:users.list_title")}</CardTitle>
          <CardDescription>
            {users?.length || 0} {t("admin:users.found")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("table:columns.user")}</TableHead>
                <TableHead>{t("table:columns.email")}</TableHead>
                <TableHead>{t("table:columns.role")}</TableHead>
                <TableHead>{t("table:columns.affiliation")}</TableHead>
                <TableHead>{t("table:columns.registration")}</TableHead>
                <TableHead>{t("table:columns.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar_url} />
                        <AvatarFallback>{user.first_name?.[0] || "User"}</AvatarFallback>
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
                    <span className="text-sm text-muted-foreground">{user.email || "—"}</span>
                  </TableCell>

                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.admin_users?.role || "USER")}>
                      {getRoleLabel(user.admin_users?.role || "USER")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.affiliations?.is_affiliated ? (
                      <div className="flex items-center space-x-2">
                        <UserCheck className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{t("admin:users.details.verified")}</span>
                        {user.affiliations.partner_id && (
                          <Badge variant="outline" className="text-xs">
                            {user.affiliations.partner_id}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <UserX className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{t("admin:users.details.not_verified")}</span>
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
                          <Button variant="ghost" size="sm" onClick={() => setSelectedUser(user)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="overflow-y-auto max-h-screen">
                          <SheetHeader>
                            <SheetTitle>{t("admin:users.details.title")}</SheetTitle>
                            <SheetDescription>{t("admin:users.details.subtitle")}</SheetDescription>
                          </SheetHeader>

                          {selectedUser && (
                            <div className="space-y-6 mt-6">
                              <div className="flex items-center space-x-4">
                                <Avatar className="h-16 w-16">
                                  <AvatarImage src={selectedUser.avatar_url} />
                                  <AvatarFallback className="text-lg">
                                    {selectedUser.first_name?.[0] || "U"}
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
                                  <label className="text-sm font-medium">{t("admin:users.details.admin_role")}</label>
                                  <Select
                                    value={selectedUser.admin_users?.role || "USER"}
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
                                      <SelectItem value="USER">{t("admin:users.roles.user")}</SelectItem>
                                      <SelectItem value="SUPPORT">{t("admin:users.roles.support")}</SelectItem>
                                      <SelectItem value="CONTENT">{t("admin:users.roles.content")}</SelectItem>
                                      <SelectItem value="ANALYST">{t("admin:users.roles.analyst")}</SelectItem>
                                      <SelectItem value="ADMIN">{t("admin:users.roles.admin")}</SelectItem>
                                    </SelectContent>
                                  </Select>
                                 </div>

                                 <Separator className="my-4" />

                                 {/* Edit Identity & Profile */}
                                 <EditUserForms user={selectedUser} />

                                 <Separator className="my-4" />

                                 {/* Admin Actions */}
                                <div className="space-y-2">
                                  <h4 className="text-sm font-semibold mb-2">{t("admin:users.actions.title")}</h4>

                                  {/* Ban User */}
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="outline" className="w-full justify-start" size="sm">
                                        <Ban className="h-4 w-4 mr-2" />
                                        {t("admin:users.actions.ban")}
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>{t("admin:users.actions.ban_title")}</DialogTitle>
                                        <DialogDescription>
                                          {t("admin:users.actions.ban_description")}
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="grid gap-2">
                                        <Button
                                          onClick={() => {
                                            const until = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
                                            banUserMutation.mutate({ userId: selectedUser.user_id, until });
                                          }}
                                          disabled={banUserMutation.isPending}
                                        >
                                          24 {t("admin:users.actions.hours")}
                                        </Button>
                                        <Button
                                          onClick={() => {
                                            const until = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
                                            banUserMutation.mutate({ userId: selectedUser.user_id, until });
                                          }}
                                          disabled={banUserMutation.isPending}
                                        >
                                          7 {t("admin:users.actions.days")}
                                        </Button>
                                        <Button
                                          onClick={() => {
                                            const until = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
                                            banUserMutation.mutate({ userId: selectedUser.user_id, until });
                                          }}
                                          disabled={banUserMutation.isPending}
                                        >
                                          30 {t("admin:users.actions.days")}
                                        </Button>
                                        <Button
                                          variant="destructive"
                                          onClick={() => banUserMutation.mutate({ userId: selectedUser.user_id })}
                                          disabled={banUserMutation.isPending}
                                        >
                                          {t("admin:users.actions.indefinite")}
                                        </Button>
                                      </div>
                                    </DialogContent>
                                  </Dialog>

                                  {/* Unban User */}
                                  <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    size="sm"
                                    onClick={() => unbanUserMutation.mutate(selectedUser.user_id)}
                                    disabled={unbanUserMutation.isPending}
                                  >
                                    <ShieldCheck className="h-4 w-4 mr-2" />
                                    {t("admin:users.actions.unban")}
                                  </Button>

                                  {/* Reset Password */}
                                  <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    size="sm"
                                    onClick={() => resetPasswordMutation.mutate(selectedUser.user_id)}
                                    disabled={resetPasswordMutation.isPending}
                                  >
                                    <Key className="h-4 w-4 mr-2" />
                                    {t("admin:users.actions.reset_password")}
                                  </Button>

                                  <Separator className="my-4" />

                                  {/* Soft Delete */}
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="destructive" className="w-full justify-start" size="sm">
                                        <Trash className="h-4 w-4 mr-2" />
                                        {t("admin:users.actions.delete")}
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>{t("admin:users.actions.delete_title")}</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          {t("admin:users.actions.delete_description")}
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>{t("forms:cancel")}</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => softDeleteMutation.mutate(selectedUser.user_id)}
                                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                          {t("admin:users.actions.confirm_delete")}
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>

                                <Separator className="my-4" />

                                <div>
                                  <label className="text-sm font-medium">
                                    {t("admin:users.details.affiliation_status")}
                                  </label>
                                  <div className="mt-2 p-3 border rounded-lg">
                                    {selectedUser.affiliations?.is_affiliated ? (
                                      <div className="flex items-center space-x-2">
                                        <UserCheck className="h-4 w-4 text-green-500" />
                                        <span className="text-sm">{t("admin:users.details.verified")}</span>
                                        {selectedUser.affiliations.partner_id && (
                                          <Badge variant="outline">ID: {selectedUser.affiliations.partner_id}</Badge>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="flex items-center space-x-2">
                                        <UserX className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">
                                          {t("admin:users.details.not_verified")}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* User Progress Section */}
                                <div className="mt-6 pt-6 border-t">
                                  <h4 className="text-sm font-medium mb-4">Academy Progress</h4>
                                  <UserProgressView userId={selectedUser.user_id} />
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
