/**
 * Production-grade confirmation dialog for high-risk admin operations
 * Implements MFA, reason collection, and impact assessment
 */
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  Clock, 
  Users,
  FileText,
  Loader2 
} from 'lucide-react';
import { SecurityContext, ActionRisk } from '@/lib/admin-rbac';

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  action: string;
  risk: ActionRisk;
  securityContext: SecurityContext;
  impactSummary?: {
    affectedUsers?: number;
    affectedResources?: number;
    estimatedDowntime?: string;
    reversible?: boolean;
  };
  onConfirm: (data: {
    reason?: string;
    mfaToken?: string;
    understood: boolean;
  }) => Promise<void>;
  loading?: boolean;
}

const riskConfig = {
  LOW: { color: 'bg-green-500', label: 'Bajo Riesgo', icon: Shield },
  MEDIUM: { color: 'bg-yellow-500', label: 'Riesgo Medio', icon: AlertTriangle },
  HIGH: { color: 'bg-orange-500', label: 'Alto Riesgo', icon: AlertTriangle },
  CRITICAL: { color: 'bg-red-500', label: 'Riesgo Crítico', icon: AlertTriangle },
};

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  action,
  risk,
  securityContext,
  impactSummary,
  onConfirm,
  loading = false,
}) => {
  const [reason, setReason] = useState('');
  const [mfaToken, setMfaToken] = useState('');
  const [understood, setUnderstood] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const riskInfo = riskConfig[risk];
  const RiskIcon = riskInfo.icon;

  const handleConfirm = async () => {
    if (securityContext.requiresReason && !reason.trim()) {
      return;
    }
    if (securityContext.requiresMFA && !mfaToken.trim()) {
      return;
    }
    if (!understood) {
      return;
    }

    setSubmitting(true);
    try {
      await onConfirm({
        reason: reason.trim() || undefined,
        mfaToken: mfaToken.trim() || undefined,
        understood,
      });
      
      // Reset form
      setReason('');
      setMfaToken('');
      setUnderstood(false);
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  const canProceed = 
    (!securityContext.requiresReason || reason.trim()) &&
    (!securityContext.requiresMFA || mfaToken.trim()) &&
    understood;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-lg">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${riskInfo.color}`}>
              <RiskIcon className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <AlertDialogTitle className="text-lg">{title}</AlertDialogTitle>
              <Badge variant="outline" className="mt-1">
                {riskInfo.label}
              </Badge>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="space-y-4">
          <AlertDialogDescription className="text-sm text-muted-foreground">
            {description}
          </AlertDialogDescription>

          {/* Impact Summary */}
          {impactSummary && (
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1 text-sm">
                  <div className="font-medium">Impacto estimado:</div>
                  {impactSummary.affectedUsers && (
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3" />
                      <span>{impactSummary.affectedUsers} usuarios afectados</span>
                    </div>
                  )}
                  {impactSummary.affectedResources && (
                    <div className="flex items-center gap-2">
                      <FileText className="h-3 w-3" />
                      <span>{impactSummary.affectedResources} recursos afectados</span>
                    </div>
                  )}
                  {impactSummary.estimatedDowntime && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      <span>Tiempo estimado: {impactSummary.estimatedDowntime}</span>
                    </div>
                  )}
                  {impactSummary.reversible !== undefined && (
                    <div className="flex items-center gap-2">
                      <span className={impactSummary.reversible ? 'text-green-600' : 'text-red-600'}>
                        {impactSummary.reversible ? '✓ Reversible' : '⚠ No reversible'}
                      </span>
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Security Requirements */}
          <div className="space-y-3">
            {securityContext.requiresReason && (
              <div className="space-y-2">
                <Label htmlFor="reason" className="text-sm font-medium">
                  Motivo de la acción *
                </Label>
                <Textarea
                  id="reason"
                  placeholder="Explique por qué es necesaria esta acción..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="resize-none"
                  rows={3}
                />
              </div>
            )}

            {securityContext.requiresMFA && (
              <div className="space-y-2">
                <Label htmlFor="mfa" className="text-sm font-medium">
                  Código de autenticación (MFA) *
                </Label>
                <Input
                  id="mfa"
                  type="text"
                  placeholder="000000"
                  value={mfaToken}
                  onChange={(e) => setMfaToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-center tracking-widest font-mono"
                  maxLength={6}
                />
                <p className="text-xs text-muted-foreground">
                  Ingrese el código de 6 dígitos de su aplicación de autenticación
                </p>
              </div>
            )}

            {securityContext.requiresDualApproval && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Esta acción requiere aprobación dual. Se enviará una solicitud a otro administrador.
                </AlertDescription>
              </Alert>
            )}

            {securityContext.sessionTimeout && (
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Sesión limitada a {Math.floor(securityContext.sessionTimeout / 60000)} minutos por seguridad.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Understanding Confirmation */}
          <div className="flex items-start space-x-2 p-4 border rounded-lg">
            <Checkbox
              id="understand"
              checked={understood}
              onCheckedChange={(checked) => setUnderstood(!!checked)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="understand"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Entiendo las consecuencias de esta acción
              </Label>
              <p className="text-xs text-muted-foreground">
                Confirmo que he revisado el impacto y las implicaciones de seguridad.
              </p>
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={submitting}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant={risk === 'CRITICAL' ? 'destructive' : 'default'}
              onClick={handleConfirm}
              disabled={!canProceed || submitting}
            >
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {securityContext.requiresDualApproval ? 'Solicitar Aprobación' : 'Confirmar'}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};