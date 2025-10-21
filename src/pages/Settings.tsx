import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { 
  User, 
  Lock, 
  Globe, 
  Bell, 
  TrendingUp, 
  ArrowLeft,
  Loader2,
  Upload
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DESIGN_TOKENS } from '@/lib/design-tokens';

const Settings = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(['common', 'forms']);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    avatar_url: '',
    language: 'es',
    level: '',
    risk_tolerance: '',
    interested_assets: [] as string[],
    notification_preferences: {
      email: true,
      push: true,
      sms: false
    }
  });
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (user?.profile) {
      const userProfile = user.profile as any; // Type assertion for extended profile fields
      setProfile({
        first_name: user.profile.first_name || '',
        last_name: user.profile.last_name || '',
        email: user.email || '',
        phone: user.profile.phone || '',
        avatar_url: user.profile.avatar_url || '',
        language: userProfile.language || i18n.language || 'es',
        level: userProfile.level || '',
        risk_tolerance: userProfile.risk_tolerance || '',
        interested_assets: userProfile.interested_assets || [],
        notification_preferences: userProfile.notification_preferences || {
          email: true,
          push: true,
          sms: false
        }
      });
    }
  }, [user, authLoading, navigate, i18n.language]);

  const handleProfileUpdate = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone: profile.phone,
          avatar_url: profile.avatar_url,
          language: profile.language,
          level: profile.level,
          risk_tolerance: profile.risk_tolerance,
          interested_assets: profile.interested_assets,
          notification_preferences: profile.notification_preferences
        })
        .eq('user_id', user.id);

      if (error) throw error;

      // Update language
      if (profile.language !== i18n.language) {
        i18n.changeLanguage(profile.language);
      }

      toast({
        title: 'Perfil actualizado',
        description: 'Tus cambios han sido guardados exitosamente',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el perfil',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordData.new || !passwordData.confirm) {
      toast({
        title: 'Error',
        description: 'Por favor completa todos los campos',
        variant: 'destructive'
      });
      return;
    }

    if (passwordData.new !== passwordData.confirm) {
      toast({
        title: 'Error',
        description: 'Las contraseñas no coinciden',
        variant: 'destructive'
      });
      return;
    }

    if (passwordData.new.length < 8) {
      toast({
        title: 'Error',
        description: 'La contraseña debe tener al menos 8 caracteres',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.new
      });

      if (error) throw error;

      toast({
        title: 'Contraseña actualizada',
        description: 'Tu contraseña ha sido cambiada exitosamente',
      });

      setPasswordData({ current: '', new: '', confirm: '' });
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        title: 'Error',
        description: 'No se pudo cambiar la contraseña',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className={cn(DESIGN_TOKENS.container.narrow, DESIGN_TOKENS.spacing.section.full)}>

        <div className={cn(DESIGN_TOKENS.spacing.section.mobile)}>
          <h1 className="text-3xl font-bold text-foreground">Configuración de Cuenta</h1>
          <p className="text-muted-foreground mt-2">
            Administra tu perfil y preferencias
          </p>
        </div>

        <div className={cn(DESIGN_TOKENS.spacing.gap.md, "flex flex-col")}>
          {/* Perfil */}
          <Card>
            <CardHeader>
              <div className={cn("flex items-center", DESIGN_TOKENS.spacing.gap.sm)}>
                <User className={cn(DESIGN_TOKENS.icon.md, "text-primary")} />
                <CardTitle>Información Personal</CardTitle>
              </div>
              <CardDescription>
                Actualiza tu información de perfil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile.avatar_url} />
                  <AvatarFallback className="text-2xl">
                    {profile.first_name?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Cambiar foto
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    JPG, PNG o GIF (máx. 2MB)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">Nombre</Label>
                  <Input
                    id="first_name"
                    value={profile.first_name}
                    onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_name">Apellido</Label>
                  <Input
                    id="last_name"
                    value={profile.last_name}
                    onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  El email no se puede cambiar
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="+1234567890"
                />
              </div>

              <Button onClick={handleProfileUpdate} disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Guardar cambios
              </Button>
            </CardContent>
          </Card>

          {/* Contraseña */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                <CardTitle>Seguridad</CardTitle>
              </div>
              <CardDescription>
                Cambia tu contraseña de acceso
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new_password">Nueva contraseña</Label>
                <Input
                  id="new_password"
                  type="password"
                  value={passwordData.new}
                  onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                  placeholder="Mínimo 8 caracteres"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm_password">Confirmar contraseña</Label>
                <Input
                  id="confirm_password"
                  type="password"
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                  placeholder="Repite la contraseña"
                />
              </div>

              <Button onClick={handlePasswordChange} disabled={loading} variant="outline">
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Cambiar contraseña
              </Button>
            </CardContent>
          </Card>

          {/* Preferencias */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                <CardTitle>Preferencias</CardTitle>
              </div>
              <CardDescription>
                Configura tu idioma y región
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Idioma</Label>
                <Select
                  value={profile.language}
                  onValueChange={(value) => setProfile({ ...profile, language: value })}
                >
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="pt">Português</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleProfileUpdate} disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Guardar preferencias
              </Button>
            </CardContent>
          </Card>

          {/* Notificaciones */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle>Notificaciones</CardTitle>
              </div>
              <CardDescription>
                Administra cómo quieres recibir notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email_notif">Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Recibe actualizaciones por email
                  </p>
                </div>
                <Switch
                  id="email_notif"
                  checked={profile.notification_preferences.email}
                  onCheckedChange={(checked) =>
                    setProfile({
                      ...profile,
                      notification_preferences: {
                        ...profile.notification_preferences,
                        email: checked
                      }
                    })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push_notif">Push</Label>
                  <p className="text-sm text-muted-foreground">
                    Notificaciones en el navegador
                  </p>
                </div>
                <Switch
                  id="push_notif"
                  checked={profile.notification_preferences.push}
                  onCheckedChange={(checked) =>
                    setProfile({
                      ...profile,
                      notification_preferences: {
                        ...profile.notification_preferences,
                        push: checked
                      }
                    })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sms_notif">SMS</Label>
                  <p className="text-sm text-muted-foreground">
                    Mensajes de texto importantes
                  </p>
                </div>
                <Switch
                  id="sms_notif"
                  checked={profile.notification_preferences.sms}
                  onCheckedChange={(checked) =>
                    setProfile({
                      ...profile,
                      notification_preferences: {
                        ...profile.notification_preferences,
                        sms: checked
                      }
                    })
                  }
                />
              </div>

              <Button onClick={handleProfileUpdate} disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Guardar notificaciones
              </Button>
            </CardContent>
          </Card>

          {/* Perfil de Trading */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle>Perfil de Trading</CardTitle>
              </div>
              <CardDescription>
                Configura tus preferencias de trading
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="level">Nivel de experiencia</Label>
                <Select
                  value={profile.level}
                  onValueChange={(value) => setProfile({ ...profile, level: value })}
                >
                  <SelectTrigger id="level">
                    <SelectValue placeholder="Selecciona tu nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Principiante</SelectItem>
                    <SelectItem value="intermediate">Intermedio</SelectItem>
                    <SelectItem value="advanced">Avanzado</SelectItem>
                    <SelectItem value="expert">Experto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="risk_tolerance">Tolerancia al riesgo</Label>
                <Select
                  value={profile.risk_tolerance}
                  onValueChange={(value) => setProfile({ ...profile, risk_tolerance: value })}
                >
                  <SelectTrigger id="risk_tolerance">
                    <SelectValue placeholder="Selecciona tu tolerancia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baja - Conservador</SelectItem>
                    <SelectItem value="medium">Media - Moderado</SelectItem>
                    <SelectItem value="high">Alta - Agresivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleProfileUpdate} disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Guardar perfil de trading
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
