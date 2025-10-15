import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ConnectAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ConnectAccountModal = ({ open, onOpenChange }: ConnectAccountModalProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    login: '',
    investorPassword: '',
    server: '',
    platform: 'mt5',
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const connectMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { data: result, error } = await supabase.functions.invoke('audit-connect-account', {
        body: data,
      });

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      toast({
        title: t('tools.audit.account_connected', 'Cuenta conectada'),
        description: t('tools.audit.account_connected_desc', 'Tu cuenta ha sido conectada exitosamente'),
      });
      queryClient.invalidateQueries({ queryKey: ['audit-accounts'] });
      onOpenChange(false);
      setFormData({ login: '', investorPassword: '', server: '', platform: 'mt5' });
    },
    onError: (error: any) => {
      toast({
        title: t('tools.audit.connect_error', 'Error al conectar'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    connectMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-surface border-line">
        <DialogHeader>
          <DialogTitle>{t('tools.audit.connect_title', 'Conectar Cuenta MT4/MT5')}</DialogTitle>
          <DialogDescription>
            {t('tools.audit.connect_desc', 'Ingresa los datos de tu cuenta. Solo se usará el investor password (modo lectura).')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="login">{t('tools.audit.account_number', 'Número de Cuenta')}</Label>
            <Input
              id="login"
              value={formData.login}
              onChange={e => setFormData({ ...formData, login: e.target.value })}
              placeholder="12345678"
              required
            />
          </div>

          <div>
            <Label htmlFor="investorPassword">{t('tools.audit.investor_password', 'Investor Password')}</Label>
            <Input
              id="investorPassword"
              type="password"
              value={formData.investorPassword}
              onChange={e => setFormData({ ...formData, investorPassword: e.target.value })}
              placeholder="••••••••"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              {t('tools.audit.read_only', 'Solo lectura - no puede ejecutar órdenes')}
            </p>
          </div>

          <div>
            <Label htmlFor="server">{t('tools.audit.server', 'Servidor')}</Label>
            <Input
              id="server"
              value={formData.server}
              onChange={e => setFormData({ ...formData, server: e.target.value })}
              placeholder="ExnessInternational-MT5Real"
              required
            />
          </div>

          <div>
            <Label htmlFor="platform">{t('tools.audit.platform', 'Plataforma')}</Label>
            <Select
              value={formData.platform}
              onValueChange={value => setFormData({ ...formData, platform: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mt4">MetaTrader 4</SelectItem>
                <SelectItem value="mt5">MetaTrader 5</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              {t('common.cancel', 'Cancelar')}
            </Button>
            <Button type="submit" disabled={connectMutation.isPending} className="bg-teal hover:bg-teal/90">
              {connectMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {t('tools.audit.connect', 'Conectar')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
