import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCode, Shield, Key, Download, CheckCircle, AlertTriangle, Smartphone } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MFASetupProps {
  onClose?: () => void;
  onMFAEnabled?: () => void;
}

interface MFAStatus {
  enabled: boolean;
  setup_required: boolean;
}

const MFASetup = ({ onClose, onMFAEnabled }: MFASetupProps) => {
  const [currentTab, setCurrentTab] = useState("status");
  const [mfaStatus, setMfaStatus] = useState<MFAStatus>({ enabled: false, setup_required: true });
  const [setupData, setSetupData] = useState<{
    secret?: string;
    qrCode?: string;
    backupCodes?: string[];
  }>({});
  const [verificationToken, setVerificationToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    checkMFAStatus();
  }, []);

  const checkMFAStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Check if user has MFA enabled
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('mfa_enabled, mfa_required')
        .eq('user_id', session.user.id)
        .single();

      if (adminUser) {
        setMfaStatus({
          enabled: adminUser.mfa_enabled || false,
          setup_required: adminUser.mfa_required || false
        });
      }
    } catch (error) {
      console.error('Failed to check MFA status:', error);
    }
  };

  const generateMFASetup = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');

      const response = await fetch(`https://xogbavprnnbfamcjrsel.supabase.co/functions/v1/admin-mfa-setup`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'generate' }),
      });

      const result = await response.json();

      if (!result.ok) {
        throw new Error(result.error || 'Failed to generate MFA setup');
      }

      setSetupData(result.data);
      setCurrentTab("setup");

      toast({
        title: "MFA Setup Generated",
        description: "Scan the QR code with your authenticator app",
      });

    } catch (error: any) {
      toast({
        title: "Setup Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyMFAToken = async () => {
    if (!/^\d{6}$/.test(verificationToken)) {
      toast({
        title: "Invalid Token",
        description: "Please enter a 6-digit code from your authenticator app",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');

      const response = await fetch(`https://xogbavprnnbfamcjrsel.supabase.co/functions/v1/admin-mfa-setup`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: 'verify', 
          token: verificationToken 
        }),
      });

      const result = await response.json();

      if (!result.ok) {
        throw new Error(result.error || 'Token verification failed');
      }

      setIsVerified(true);
      toast({
        title: "Token Verified",
        description: "Your authenticator is working correctly",
      });

    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const enableMFA = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');

      const response = await fetch(`https://xogbavprnnbfamcjrsel.supabase.co/functions/v1/admin-mfa-setup`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: 'enable', 
          token: verificationToken 
        }),
      });

      const result = await response.json();

      if (!result.ok) {
        throw new Error(result.error || 'Failed to enable MFA');
      }

      setMfaStatus(prev => ({ ...prev, enabled: true }));
      setCurrentTab("success");
      
      toast({
        title: "MFA Enabled",
        description: "Two-factor authentication is now active on your account",
      });

      onMFAEnabled?.();

    } catch (error: any) {
      toast({
        title: "Enable Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadBackupCodes = () => {
    if (!setupData.backupCodes) return;

    const codesText = setupData.backupCodes.map((code, index) => 
      `${index + 1}. ${code}`
    ).join('\n');

    const blob = new Blob([
      `Tálamo Pro Hub - MFA Backup Codes\n`,
      `Generated: ${new Date().toLocaleString()}\n\n`,
      `Keep these codes secure and offline:\n\n`,
      codesText,
      `\n\nEach code can only be used once.`
    ], { type: 'text/plain' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `talamo-mfa-backup-codes-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Autenticación de Dos Factores (2FA)
        </CardTitle>
        <CardDescription>
          Protege tu cuenta con autenticación de dos factores usando códigos TOTP
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="status">Estado</TabsTrigger>
            <TabsTrigger value="setup" disabled={!setupData.secret}>Configurar</TabsTrigger>
            <TabsTrigger value="verify" disabled={!setupData.secret}>Verificar</TabsTrigger>
            <TabsTrigger value="success" disabled={!mfaStatus.enabled}>Completado</TabsTrigger>
          </TabsList>

          <TabsContent value="status" className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {mfaStatus.enabled ? (
                  <span className="text-green-600">
                    2FA está habilitado en tu cuenta
                  </span>
                ) : mfaStatus.setup_required ? (
                  <span className="text-amber-600">
                    2FA es requerido para tu rol. Por favor configúralo ahora.
                  </span>
                ) : (
                  <span className="text-blue-600">
                    2FA está disponible para mejorar la seguridad
                  </span>
                )}
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Aplicación Requerida
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Necesitas una app como Google Authenticator, Authy, o 1Password
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Estado Actual
                </h3>
                <Badge variant={mfaStatus.enabled ? "default" : "secondary"} className="mt-2">
                  {mfaStatus.enabled ? "Habilitado" : "Deshabilitado"}
                </Badge>
              </div>
            </div>

            {!mfaStatus.enabled && (
              <Button 
                onClick={generateMFASetup} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Generando..." : "Configurar 2FA"}
              </Button>
            )}
          </TabsContent>

          <TabsContent value="setup" className="space-y-4">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold">Escanea el código QR</h3>
              
              {setupData.qrCode && (
                <div className="flex justify-center">
                  <div className="p-4 bg-white rounded-lg shadow-inner">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(setupData.qrCode)}`}
                      alt="QR Code for 2FA setup"
                      className="w-48 h-48"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  O ingresa este código manualmente:
                </p>
                <code className="block p-3 bg-muted rounded font-mono text-sm break-all">
                  {setupData.secret}
                </code>
              </div>

              <Alert>
                <QrCode className="h-4 w-4" />
                <AlertDescription>
                  Abre tu app de autenticación y escanea el código QR o ingresa el código manual
                </AlertDescription>
              </Alert>
            </div>

            <Button 
              onClick={() => setCurrentTab("verify")} 
              className="w-full"
            >
              Siguiente: Verificar
            </Button>
          </TabsContent>

          <TabsContent value="verify" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">
                Verifica tu autenticador
              </h3>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Código de 6 dígitos de tu app:
                </label>
                <Input
                  type="text"
                  placeholder="000000"
                  value={verificationToken}
                  onChange={(e) => setVerificationToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-center text-2xl tracking-widest"
                  maxLength={6}
                />
              </div>

              <Button 
                onClick={verifyMFAToken}
                disabled={isLoading || verificationToken.length !== 6}
                className="w-full"
              >
                {isLoading ? "Verificando..." : "Verificar Código"}
              </Button>

              {isVerified && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-green-600">
                    ¡Verificación exitosa! Ahora puedes habilitar 2FA.
                  </AlertDescription>
                </Alert>
              )}

              {isVerified && (
                <Button 
                  onClick={enableMFA}
                  disabled={isLoading}
                  className="w-full"
                  variant="default"
                >
                  {isLoading ? "Habilitando..." : "Habilitar 2FA"}
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="success" className="space-y-4">
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <h3 className="text-lg font-semibold text-green-600">
                ¡2FA Habilitado Exitosamente!
              </h3>
              <p className="text-muted-foreground">
                Tu cuenta ahora está protegida con autenticación de dos factores
              </p>

              {setupData.backupCodes && (
                <Alert>
                  <Download className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p>Guarda tus códigos de respaldo de forma segura:</p>
                      <Button 
                        onClick={downloadBackupCodes}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Descargar Códigos de Respaldo
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      {onClose && (
        <CardFooter>
          <Button 
            onClick={onClose}
            variant="outline"
            className="w-full"
          >
            Cerrar
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default MFASetup;