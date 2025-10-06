import React from 'react';
import { useTranslation } from 'react-i18next';
import { PermissionGuard } from '@/components/admin/PermissionGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings as SettingsIcon } from 'lucide-react';
import { toast } from 'sonner';

export const AdminSettings: React.FC = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = React.useState({
    mfaRequired: false,
    maintenanceMode: false,
    allowRegistrations: true,
    emailNotifications: true,
  });

  React.useEffect(() => {
    const stored = localStorage.getItem('admin-settings');
    if (stored) {
      setSettings(JSON.parse(stored));
    }
  }, []);

  const handleToggle = (key: keyof typeof settings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    localStorage.setItem('admin-settings', JSON.stringify(newSettings));
    toast.success(t('admin.settings.saved'));
  };

  return (
    <PermissionGuard resource="settings" action="manage" requiredRoles={['ADMIN']}>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <SettingsIcon className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">{t('admin.settings.title')}</h1>
            <p className="text-muted-foreground mt-1">{t('admin.settings.subtitle')}</p>
          </div>
        </div>

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.settings.security.title')}</CardTitle>
              <CardDescription>{t('admin.settings.security.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="mfa-required" className="flex flex-col gap-1">
                  <span>{t('admin.settings.security.mfa_required')}</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {t('admin.settings.security.mfa_required_desc')}
                  </span>
                </Label>
                <Switch
                  id="mfa-required"
                  checked={settings.mfaRequired}
                  onCheckedChange={() => handleToggle('mfaRequired')}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('admin.settings.system.title')}</CardTitle>
              <CardDescription>{t('admin.settings.system.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="maintenance" className="flex flex-col gap-1">
                  <span>{t('admin.settings.system.maintenance_mode')}</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {t('admin.settings.system.maintenance_mode_desc')}
                  </span>
                </Label>
                <Switch
                  id="maintenance"
                  checked={settings.maintenanceMode}
                  onCheckedChange={() => handleToggle('maintenanceMode')}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="registrations" className="flex flex-col gap-1">
                  <span>{t('admin.settings.system.allow_registrations')}</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {t('admin.settings.system.allow_registrations_desc')}
                  </span>
                </Label>
                <Switch
                  id="registrations"
                  checked={settings.allowRegistrations}
                  onCheckedChange={() => handleToggle('allowRegistrations')}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('admin.settings.notifications.title')}</CardTitle>
              <CardDescription>{t('admin.settings.notifications.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notif" className="flex flex-col gap-1">
                  <span>{t('admin.settings.notifications.email')}</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {t('admin.settings.notifications.email_desc')}
                  </span>
                </Label>
                <Switch
                  id="email-notif"
                  checked={settings.emailNotifications}
                  onCheckedChange={() => handleToggle('emailNotifications')}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PermissionGuard>
  );
};

export default AdminSettings;
