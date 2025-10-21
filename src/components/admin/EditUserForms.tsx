import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface UserWithProfile {
  id: string;
  user_id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  phone?: string;
  bio?: string;
  language?: string;
  affiliations: {
    is_affiliated: boolean;
    partner_id: string;
  } | null;
}

interface EditUserFormsProps {
  user: UserWithProfile;
}

export const EditUserForms: React.FC<EditUserFormsProps> = ({ user }) => {
  const { t } = useTranslation(["admin", "forms"]);
  const queryClient = useQueryClient();

  // Identity form state (solo email, phone va en perfil)
  const [identityData, setIdentityData] = useState({
    email: user.email || "",
    email_confirm: false,
  });

  // Profile form state
  const [profileData, setProfileData] = useState({
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    phone: user.phone || "",
    avatar_url: user.avatar_url || "",
    bio: user.bio || "",
    language: user.language || "es",
    affiliation: user.affiliations?.partner_id || "",
  });

  // Update identity mutation
  const updateIdentityMutation = useMutation({
    mutationFn: async (data: typeof identityData) => {
      const { data: result, error } = await supabase.functions.invoke("admin-users-update-identity", {
        body: {
          userId: user.user_id,
          email: data.email !== user.email ? data.email : undefined,
          email_confirm: data.email_confirm,
        },
      });
      if (error) throw error;
      if (!result.ok) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      toast({
        title: t("admin:toasts.identity_updated"),
        description: t("admin:toasts.identity_updated_desc"),
      });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error: any) => {
      toast({
        title: t("admin:toasts.error"),
        description: error.message || t("admin:toasts.identity_update_error"),
        variant: "destructive",
      });
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof profileData) => {
      const { data: result, error } = await supabase.functions.invoke("admin-users-update-profile", {
        body: {
          userId: user.user_id,
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
          avatar_url: data.avatar_url || null,
          bio: data.bio || null,
          language: data.language,
          affiliation: data.affiliation || null,
        },
      });
      if (error) throw error;
      if (!result.ok) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      toast({
        title: t("admin:toasts.profile_updated"),
        description: t("admin:toasts.profile_updated_desc"),
      });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error: any) => {
      toast({
        title: t("admin:toasts.error"),
        description: error.message || t("admin:toasts.profile_update_error"),
        variant: "destructive",
      });
    },
  });

  const handleIdentitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateIdentityMutation.mutate(identityData);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(profileData);
  };

  const emailChanged = identityData.email !== user.email;

  return (
    <div className="space-y-6">
      {/* Identity Form */}
      <div className="rounded-lg border bg-card p-4">
        <div className="mb-4">
          <h4 className="font-semibold text-base">{t("admin:users.identity_section")}</h4>
          <p className="text-sm text-muted-foreground mt-1">Datos de autenticación</p>
        </div>
        <form onSubmit={handleIdentitySubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="identity-email">{t("forms:fields.email")}</Label>
            <Input
              id="identity-email"
              type="email"
              value={identityData.email}
              onChange={(e) => setIdentityData({ ...identityData, email: e.target.value })}
            />
          </div>

          {emailChanged && (
            <>
              <div className="flex items-center space-x-2 p-3 bg-muted rounded-md">
                <Switch
                  id="email_confirm"
                  checked={identityData.email_confirm}
                  onCheckedChange={(checked) => setIdentityData({ ...identityData, email_confirm: checked })}
                />
                <Label htmlFor="email_confirm" className="text-sm cursor-pointer">
                  {t("admin:users.force_email_confirm")}
                </Label>
              </div>

              {!identityData.email_confirm && (
                <div className="text-sm text-amber-600 dark:text-amber-500 flex items-start gap-2">
                  <span>⚠️</span>
                  <span>{t("admin:users.email_confirmation_required")}</span>
                </div>
              )}
            </>
          )}

          <Button type="submit" disabled={updateIdentityMutation.isPending} className="w-full sm:w-auto">
            {updateIdentityMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("admin:users.actions.save_identity")}
          </Button>
        </form>
      </div>

      {/* Profile Form */}
      <div className="rounded-lg border bg-card p-4">
        <div className="mb-4">
          <h4 className="font-semibold text-base">{t("admin:users.profile_section")}</h4>
          <p className="text-sm text-muted-foreground mt-1">Información del usuario</p>
        </div>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="profile-first-name">{t("forms:fields.first_name")}</Label>
              <Input
                id="profile-first-name"
                value={profileData.first_name}
                onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-last-name">{t("forms:fields.last_name")}</Label>
              <Input
                id="profile-last-name"
                value={profileData.last_name}
                onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-phone">{t("forms:fields.phone")}</Label>
            <Input
              id="profile-phone"
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              placeholder="+52 55 1234 5678"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-avatar">{t("forms:fields.avatar_url")}</Label>
            <Input
              id="profile-avatar"
              type="url"
              value={profileData.avatar_url}
              onChange={(e) => setProfileData({ ...profileData, avatar_url: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-bio">{t("forms:fields.bio")}</Label>
            <Input
              id="profile-bio"
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              placeholder="Breve descripción..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="profile-language">{t("forms:fields.language")}</Label>
              <Input
                id="profile-language"
                value={profileData.language}
                onChange={(e) => setProfileData({ ...profileData, language: e.target.value })}
                placeholder="es"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-affiliation">{t("admin:users.details.partner_id")}</Label>
              <Input
                id="profile-affiliation"
                value={profileData.affiliation}
                onChange={(e) => setProfileData({ ...profileData, affiliation: e.target.value })}
                placeholder="Opcional"
              />
            </div>
          </div>

          <Button type="submit" disabled={updateProfileMutation.isPending} className="w-full sm:w-auto">
            {updateProfileMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("admin:users.actions.save_profile")}
          </Button>
        </form>
      </div>
    </div>
  );
};
