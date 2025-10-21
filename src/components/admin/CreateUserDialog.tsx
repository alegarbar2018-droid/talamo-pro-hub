import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { AdminRole } from "@/lib/auth-admin";
import { Loader2 } from "lucide-react";

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateUserDialog: React.FC<CreateUserDialogProps> = ({ open, onOpenChange }) => {
  const { t } = useTranslation(["admin", "forms"]);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
    role: "USER" as AdminRole,
    invite: false,
    email_confirm: false,
    affiliation: "",
  });

  const createUserMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { data: result, error } = await supabase.functions.invoke("admin-users-create", {
        body: {
          email: data.email,
          password: data.invite ? undefined : data.password,
          invite: data.invite,
          email_confirm: data.email_confirm,
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone || undefined,
          role: data.role,
          affiliation: data.affiliation || undefined,
        },
      });
      if (error) throw error;
      if (!result.ok) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      toast({
        title: t("admin:toasts.user_created"),
        description: formData.invite
          ? t("admin:toasts.user_invited_desc")
          : t("admin:toasts.user_created_desc"),
      });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      onOpenChange(false);
      setFormData({
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        phone: "",
        role: "USER",
        invite: false,
        email_confirm: false,
        affiliation: "",
      });
    },
    onError: (error: any) => {
      toast({
        title: t("admin:toasts.error"),
        description: error.message || t("admin:toasts.user_create_error"),
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      toast({
        title: t("admin:toasts.error"),
        description: t("forms:errors.email_required"),
        variant: "destructive",
      });
      return;
    }
    if (!formData.invite && !formData.password) {
      toast({
        title: t("admin:toasts.error"),
        description: t("forms:errors.password_required"),
        variant: "destructive",
      });
      return;
    }
    createUserMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("admin:users.actions.create")}</DialogTitle>
          <DialogDescription>{t("admin:users.create_desc")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">{t("forms:fields.email")}</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          {/* Invite switch */}
          <div className="flex items-center space-x-2">
            <Switch
              id="invite"
              checked={formData.invite}
              onCheckedChange={(checked) => setFormData({ ...formData, invite: checked })}
            />
            <Label htmlFor="invite">{t("admin:users.send_invitation")}</Label>
          </div>

          {/* Password (only if not invite) */}
          {!formData.invite && (
            <>
              <div className="space-y-2">
                <Label htmlFor="password">{t("forms:fields.password")}</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!formData.invite}
                  minLength={8}
                />
              </div>

              {/* Email confirm switch */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="email_confirm"
                  checked={formData.email_confirm}
                  onCheckedChange={(checked) => setFormData({ ...formData, email_confirm: checked })}
                />
                <Label htmlFor="email_confirm">{t("admin:users.confirm_email_immediately")}</Label>
              </div>
            </>
          )}

          {/* Name fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">{t("forms:fields.first_name")}</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">{t("forms:fields.last_name")}</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">{t("forms:fields.phone")}</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role">{t("admin:users.details.admin_role")}</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value as AdminRole })}
            >
              <SelectTrigger>
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

          {/* Affiliation (optional) */}
          <div className="space-y-2">
            <Label htmlFor="affiliation">{t("admin:users.details.partner_id")}</Label>
            <Input
              id="affiliation"
              value={formData.affiliation}
              onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
              placeholder="Optional"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common:actions.cancel")}
            </Button>
            <Button type="submit" disabled={createUserMutation.isPending}>
              {createUserMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {formData.invite ? t("admin:users.actions.send_invite") : t("admin:users.actions.create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
