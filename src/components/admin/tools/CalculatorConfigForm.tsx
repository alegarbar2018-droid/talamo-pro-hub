import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator } from "lucide-react";

const calculatorSchema = z.object({
  calculator_id: z.string().min(1, "ID es requerido").toLowerCase(),
  name: z.string().min(1, "Nombre es requerido"),
  description: z.string().min(10, "Descripción muy corta"),
  category: z.string().min(1, "Categoría es requerida"),
  icon: z.string().min(1, "Icono es requerido"),
  status: z.enum(["active", "coming_soon", "inactive"]).default("active"),
  position: z.coerce.number().int().min(0).default(0),
  requires_contracts: z.boolean().default(false),
  input_fields: z.string().min(1, "Input fields es requerido"),
  calculation_logic: z.string().min(1, "Calculation logic es requerido"),
  output_format: z.string().min(1, "Output format es requerido"),
});

type CalculatorFormValues = z.infer<typeof calculatorSchema>;

interface CalculatorConfigFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function CalculatorConfigForm({ onSuccess, onCancel }: CalculatorConfigFormProps) {
  const { toast } = useToast();
  const [previewMode, setPreviewMode] = useState(false);
  
  const form = useForm<CalculatorFormValues>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      category: "Básicas",
      icon: "Calculator",
      status: "active",
      position: 0,
      requires_contracts: false,
      input_fields: JSON.stringify([
        {
          id: "account_balance",
          label: "Saldo de cuenta",
          type: "number",
          unit: "USD",
          default: 10000,
          min: 0,
          required: true
        }
      ], null, 2),
      calculation_logic: JSON.stringify({
        formula: "{{account_balance}} * {{risk_percent}} / 100 / ({{stop_loss_pips}} * {{pip_value}})",
        variables: ["account_balance", "risk_percent", "stop_loss_pips", "pip_value"]
      }, null, 2),
      output_format: JSON.stringify({
        label: "Tamaño de posición recomendado",
        unit: "lotes",
        decimals: 2,
        format: "number"
      }, null, 2),
    },
  });

  const onSubmit = async (data: CalculatorFormValues) => {
    try {
      // Parse JSON fields
      const parsedData = {
        ...data,
        input_fields: JSON.parse(data.input_fields),
        calculation_logic: JSON.parse(data.calculation_logic),
        output_format: JSON.parse(data.output_format),
      };

      const { error } = await supabase
        .from("calculator_configs")
        .insert([parsedData as any]);

      if (error) throw error;

      toast({
        title: "Calculadora creada",
        description: `${data.name} ha sido agregada exitosamente`,
      });
      onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const watchedData = form.watch();

  return (
    <div className="space-y-6">
      {/* Toggle Preview */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Nueva Calculadora</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setPreviewMode(!previewMode)}
        >
          {previewMode ? "Editar" : "Vista Previa"}
        </Button>
      </div>

      {previewMode ? (
        /* Preview */
        <Card className="border-primary/30">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>{watchedData.name}</CardTitle>
                <CardDescription>{watchedData.category}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{watchedData.description}</p>
            <div className="text-xs text-muted-foreground">
              <p>Estado: <strong>{watchedData.status}</strong></p>
              <p>Requiere contratos: <strong>{watchedData.requires_contracts ? "Sí" : "No"}</strong></p>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Form */
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="calculator_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID (slug)</FormLabel>
                    <FormControl>
                      <Input placeholder="risk-calculator" {...field} />
                    </FormControl>
                    <FormDescription>Único, sin espacios, minúsculas</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Calculadora de Riesgo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <FormControl>
                      <Input placeholder="Básicas" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icono (Lucide)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Calculator">Calculator</SelectItem>
                        <SelectItem value="Target">Target</SelectItem>
                        <SelectItem value="Activity">Activity</SelectItem>
                        <SelectItem value="DollarSign">DollarSign</SelectItem>
                        <SelectItem value="TrendingUp">TrendingUp</SelectItem>
                        <SelectItem value="BarChart3">BarChart3</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Activo</SelectItem>
                        <SelectItem value="coming_soon">Próximamente</SelectItem>
                        <SelectItem value="inactive">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Posición (orden)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Calcula el tamaño de posición óptimo basado en tu gestión de riesgo"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requires_contracts"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Requiere especificaciones de contrato</FormLabel>
                    <FormDescription>
                      Si necesita datos de contract_specifications (pip value, contract size, etc.)
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="input_fields"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Input Fields (JSON)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder='[{"id": "balance", "label": "Saldo", "type": "number"}]'
                      rows={6}
                      className="font-mono text-xs"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Array de campos de entrada con id, label, type, unit, default, min, required
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="calculation_logic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Calculation Logic (JSON)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder='{"formula": "{{a}} * {{b}}", "variables": ["a", "b"]}'
                      rows={4}
                      className="font-mono text-xs"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Objeto con formula (usando variables entre llaves dobles) y array de variables
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="output_format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Output Format (JSON)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder='{"label": "Resultado", "unit": "lotes", "decimals": 2}'
                      rows={4}
                      className="font-mono text-xs"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Objeto con label, unit, decimals, format
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit">
                Crear Calculadora
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
