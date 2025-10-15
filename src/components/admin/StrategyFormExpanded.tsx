import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, Plus, X, AlertTriangle } from 'lucide-react';
import { parseStrategySyntaxGuide, validateAvatarURL } from '@/lib/parseStrategySyntax';
import type { CopyStrategy } from '@/modules/copy/types';

const strategySchema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres').max(100, 'Máximo 100 caracteres'),
  description: z.string().min(10, 'Mínimo 10 caracteres').max(500, 'Máximo 500 caracteres'),
  photo_url: z.string().url('URL inválida').optional().or(z.literal('')),
  account_type: z.enum(['Social Standard', 'Pro']),
  strategy_equity: z.number().positive('Debe ser mayor a 0'),
  min_investment: z.number().min(10, 'Mínimo $10'),
  performance_fee_pct: z.number().min(0).max(100),
  leverage: z.number().int().positive(),
  billing_period: z.enum(['Weekly', 'Monthly', 'Quarterly']),
  symbols: z.array(z.string()).min(1, 'Al menos 1 símbolo'),
  external_link: z.string().url('URL inválida'),
  risk_band: z.enum(['Conservador', 'Moderado', 'Agresivo']).optional(),
  profit_factor: z.number().optional(),
  max_drawdown: z.number().optional(),
  win_rate: z.number().optional(),
  cagr: z.number().optional(),
  total_trades: z.number().int().optional(),
});

type StrategyFormData = z.infer<typeof strategySchema>;

interface StrategyFormExpandedProps {
  onSuccess: () => void;
  onCancel: () => void;
  strategy?: Partial<CopyStrategy>;
}

export const StrategyFormExpanded = ({ onSuccess, onCancel, strategy }: StrategyFormExpandedProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showSyntaxGuide, setShowSyntaxGuide] = useState(false);
  const [syntaxInput, setSyntaxInput] = useState('');
  const [currentSymbol, setCurrentSymbol] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(strategy?.trader_avatar_url);
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<StrategyFormData>({
    resolver: zodResolver(strategySchema),
    defaultValues: {
      name: strategy?.name || '',
      description: strategy?.description || '',
      trader_name: strategy?.trader_name || '',
      trader_bio: strategy?.trader_bio || '',
      trader_avatar_url: strategy?.trader_avatar_url || '',
      account_type: strategy?.account_type || 'Social Standard',
      strategy_equity: strategy?.strategy_equity || 1000,
      min_investment: strategy?.min_investment || 10,
      performance_fee_pct: strategy?.performance_fee_pct || 20,
      leverage: strategy?.leverage || 100,
      billing_period: strategy?.billing_period || 'monthly',
      symbols_traded: strategy?.symbols_traded || [],
      strategy_link: strategy?.strategy_link || '',
      risk_band: strategy?.risk_band,
      profit_factor: strategy?.profit_factor,
      max_drawdown: strategy?.max_drawdown,
      win_rate: strategy?.win_rate,
      total_trades: strategy?.total_trades,
    }
  });
  
  const symbols = watch('symbols_traded') || [];
  
  const handleAvatarUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Error',
        description: 'Solo se permiten archivos de imagen',
        variant: 'destructive'
      });
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) { // 2MB
      toast({
        title: 'Error',
        description: 'La imagen no debe superar 2MB',
        variant: 'destructive'
      });
      return;
    }
    
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };
  
  const uploadAvatar = async (): Promise<string | undefined> => {
    if (!avatarFile) return avatarPreview;
    
    const fileName = `${Date.now()}-${avatarFile.name}`;
    const { data, error } = await supabase.storage
      .from('copy-trading-avatars')
      .upload(fileName, avatarFile);
    
    if (error) {
      console.error('Error uploading avatar:', error);
      return undefined;
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('copy-trading-avatars')
      .getPublicUrl(data.path);
    
    return publicUrl;
  };
  
  const handleAddSymbol = () => {
    if (!currentSymbol.trim()) return;
    
    const upper = currentSymbol.toUpperCase().trim();
    if (!symbols.includes(upper)) {
      setValue('symbols', [...symbols, upper]);
      setCurrentSymbol('');
    }
  };
  
  const handleRemoveSymbol = (symbol: string) => {
    setValue('symbols', symbols.filter(s => s !== symbol));
  };
  
  const handleImportSyntax = () => {
    try {
      const parsed = parseStrategySyntaxGuide(syntaxInput, syntaxInput.includes('```') ? 'markdown' : 'yaml');
      
      // Aplicar valores parseados al form
      Object.entries(parsed).forEach(([key, value]) => {
        if (value !== undefined && key !== 'id' && key !== 'slug' && key !== 'status' && key !== 'created_at' && key !== 'updated_at') {
          setValue(key as any, value);
        }
      });
      
      if (parsed.trader_avatar_url) {
        setAvatarPreview(parsed.trader_avatar_url);
      }
      
      setShowSyntaxGuide(false);
      toast({
        title: 'Importado',
        description: 'Datos cargados desde Syntax Guide'
      });
    } catch (error: any) {
      toast({
        title: 'Error al parsear',
        description: error.message || 'Formato inválido',
        variant: 'destructive'
      });
    }
  };
  
  const onSubmit = async (data: StrategyFormData) => {
    setIsLoading(true);
    
    try {
      // Upload avatar si hay uno nuevo
      const photoUrl = await uploadAvatar();
      
      if (photoUrl && !validateAvatarURL(photoUrl)) {
        toast({
          title: 'Error',
          description: 'La URL del avatar debe ser del bucket copy-trading-avatars',
          variant: 'destructive'
        });
        setIsLoading(false);
        return;
      }
      
      // Generar slug
      const slug = data.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      // Agregar UTM al external_link
      const utmParams = new URLSearchParams({
        utm_source: 'talamo',
        utm_medium: 'copy',
        utm_campaign: 'dir'
      });
      const separator = data.external_link.includes('?') ? '&' : '?';
      const externalLinkWithUTM = `${data.external_link}${separator}${utmParams.toString()}`;
      
      const payload = {
        ...data,
        slug,
        photo_url: photoUrl || null,
        external_link: externalLinkWithUTM,
        cumulative_return_series: null, // TODO: Editor JSON separado
        status: 'draft'
      };
      
      if (strategy?.id) {
        // Update
        const { error } = await supabase
          .from('copy_strategies' as any)
          .update(payload as any)
          .eq('id', strategy.id);
        
        if (error) throw error;
        
        toast({
          title: 'Actualizado',
          description: 'Estrategia actualizada correctamente'
        });
      } else {
        // Insert
        const { error } = await supabase
          .from('copy_strategies' as any)
          .insert(payload as any);
        
        if (error) throw error;
        
        toast({
          title: 'Creado',
          description: 'Estrategia creada correctamente'
        });
      }
      
      onSuccess();
    } catch (error: any) {
      console.error('Error saving strategy:', error);
      toast({
        title: 'Error',
        description: error.message || 'Error al guardar',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Syntax Guide Import */}
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowSyntaxGuide(true)}
            className="gap-2"
          >
            <FileText className="h-4 w-4" />
            Importar desde Syntax Guide
          </Button>
        </div>
        
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Información Básica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre *</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="description">Descripción * (10-500 caracteres)</Label>
              <Textarea id="description" {...register('description')} rows={3} />
              {errors.description && <p className="text-xs text-destructive mt-1">{errors.description.message}</p>}
            </div>
            
            <div>
              <Label>Avatar del Trader</Label>
              <div className="flex items-center gap-4 mt-2">
                {avatarPreview && (
                  <img src={avatarPreview} alt="Preview" className="w-16 h-16 rounded-full object-cover" />
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Máx 2MB. Se subirá al bucket copy-trading-avatars</p>
            </div>
          </CardContent>
        </Card>
        
        {/* Account & Investment */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cuenta e Inversión</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="account_type">Tipo de Cuenta *</Label>
              <Select
                value={watch('account_type')}
                onValueChange={(v) => setValue('account_type', v as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Social Standard">Social Standard</SelectItem>
                  <SelectItem value="Pro">Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="strategy_equity">Equity de Estrategia (USD) *</Label>
              <Input
                id="strategy_equity"
                type="number"
                step="0.01"
                {...register('strategy_equity', { valueAsNumber: true })}
              />
              {errors.strategy_equity && <p className="text-xs text-destructive mt-1">{errors.strategy_equity.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="min_investment">Inversión Mínima (USD) *</Label>
              <Input
                id="min_investment"
                type="number"
                step="0.01"
                {...register('min_investment', { valueAsNumber: true })}
              />
              {errors.min_investment && <p className="text-xs text-destructive mt-1">{errors.min_investment.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="performance_fee_pct">Fee de Performance (%) *</Label>
              <Input
                id="performance_fee_pct"
                type="number"
                step="0.01"
                {...register('performance_fee_pct', { valueAsNumber: true })}
              />
              {errors.performance_fee_pct && <p className="text-xs text-destructive mt-1">{errors.performance_fee_pct.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="leverage">Apalancamiento *</Label>
              <Input
                id="leverage"
                type="number"
                placeholder="100 para 1:100"
                {...register('leverage', { valueAsNumber: true })}
              />
              {errors.leverage && <p className="text-xs text-destructive mt-1">{errors.leverage.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="billing_period">Período de Facturación *</Label>
              <Select
                value={watch('billing_period')}
                onValueChange={(v) => setValue('billing_period', v as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Weekly">Semanal</SelectItem>
                  <SelectItem value="Monthly">Mensual</SelectItem>
                  <SelectItem value="Quarterly">Trimestral</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        {/* Symbols & Link */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Símbolos y Link Externo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Símbolos Operados *</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={currentSymbol}
                  onChange={(e) => setCurrentSymbol(e.target.value)}
                  placeholder="XAUUSD"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSymbol())}
                />
                <Button type="button" onClick={handleAddSymbol} size="icon" variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {symbols.map(symbol => (
                  <Badge key={symbol} variant="secondary" className="gap-1">
                    {symbol}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveSymbol(symbol)}
                    />
                  </Badge>
                ))}
              </div>
              {errors.symbols && <p className="text-xs text-destructive mt-1">{errors.symbols.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="external_link">Link a Estrategia en Exness *</Label>
              <Input id="external_link" {...register('external_link')} />
              <p className="text-xs text-muted-foreground mt-1">Se agregarán parámetros UTM automáticamente</p>
              {errors.external_link && <p className="text-xs text-destructive mt-1">{errors.external_link.message}</p>}
            </div>
          </CardContent>
        </Card>
        
        {/* KPIs & Risk */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">KPIs y Clasificación de Riesgo (Opcionales)</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="risk_band">Banda de Riesgo</Label>
              <Select
                value={watch('risk_band') || ''}
                onValueChange={(v) => setValue('risk_band', v === '' ? undefined : v as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Auto-calculado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Auto-calculado</SelectItem>
                  <SelectItem value="Conservador">Conservador</SelectItem>
                  <SelectItem value="Moderado">Moderado</SelectItem>
                  <SelectItem value="Agresivo">Agresivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="profit_factor">Profit Factor</Label>
              <Input
                id="profit_factor"
                type="number"
                step="0.01"
                {...register('profit_factor', { valueAsNumber: true })}
              />
            </div>
            
            <div>
              <Label htmlFor="max_drawdown">Max Drawdown (%)</Label>
              <Input
                id="max_drawdown"
                type="number"
                step="0.01"
                {...register('max_drawdown', { valueAsNumber: true })}
              />
            </div>
            
            <div>
              <Label htmlFor="win_rate">Win Rate (%)</Label>
              <Input
                id="win_rate"
                type="number"
                step="0.01"
                {...register('win_rate', { valueAsNumber: true })}
              />
            </div>
            
            <div>
              <Label htmlFor="cagr">CAGR (%)</Label>
              <Input
                id="cagr"
                type="number"
                step="0.01"
                {...register('cagr', { valueAsNumber: true })}
              />
            </div>
            
            <div>
              <Label htmlFor="total_trades">Total Trades</Label>
              <Input
                id="total_trades"
                type="number"
                {...register('total_trades', { valueAsNumber: true })}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Actions */}
        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Guardando...' : strategy?.id ? 'Actualizar' : 'Crear'} Estrategia
          </Button>
        </div>
      </form>
      
      {/* Syntax Guide Dialog */}
      <Dialog open={showSyntaxGuide} onOpenChange={setShowSyntaxGuide}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Importar desde Syntax Guide</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Formato YAML o Markdown con bloque ```yaml. Ejemplo:<br />
                name: Estrategia Gold<br />
                description: Estrategia enfocada en oro<br />
                symbols: [XAUUSD, XAGUSD]<br />
                min_investment: 100
              </AlertDescription>
            </Alert>
            
            <Textarea
              value={syntaxInput}
              onChange={(e) => setSyntaxInput(e.target.value)}
              rows={12}
              placeholder="Pega aquí tu Syntax Guide..."
              className="font-mono text-xs"
            />
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowSyntaxGuide(false)}>
                Cancelar
              </Button>
              <Button onClick={handleImportSyntax}>
                Importar Datos
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
