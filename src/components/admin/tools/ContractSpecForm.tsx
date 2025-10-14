import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const contractSchema = z.object({
  symbol: z.string().min(1, "Símbolo es requerido").toUpperCase(),
  name: z.string().min(1, "Nombre es requerido"),
  asset_class: z.enum(["forex", "crypto", "indices", "commodities", "stocks"]),
  contract_size: z.coerce.number().positive("Debe ser mayor a 0"),
  pip_value: z.coerce.number().positive("Debe ser mayor a 0"),
  pip_position: z.coerce.number().int().min(0),
  min_lot: z.coerce.number().positive().default(0.01),
  max_lot: z.coerce.number().positive().default(100),
  spread_typical: z.coerce.number().positive().optional(),
  margin_percentage: z.coerce.number().positive().optional(),
  leverage_max: z.coerce.number().int().positive().default(500),
  status: z.enum(["active", "inactive"]).default("active"),
});

type ContractFormValues = z.infer<typeof contractSchema>;

interface ContractSpecFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function ContractSpecForm({ onSuccess, onCancel }: ContractSpecFormProps) {
  const { toast } = useToast();
  const form = useForm<ContractFormValues>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      asset_class: "forex",
      pip_position: 4,
      min_lot: 0.01,
      max_lot: 100,
      leverage_max: 500,
      status: "active",
    },
  });

  const onSubmit = async (data: ContractFormValues) => {
    try {
      const { error } = await supabase
        .from("contract_specifications")
        .insert([data as any]);

      if (error) throw error;

      toast({
        title: "Contrato creado",
        description: `${data.symbol} ha sido agregado exitosamente`,
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="symbol"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Símbolo</FormLabel>
                <FormControl>
                  <Input placeholder="EURUSD" {...field} />
                </FormControl>
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
                  <Input placeholder="Euro vs US Dollar" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="asset_class"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Clase de Activo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="forex">Forex</SelectItem>
                    <SelectItem value="crypto">Crypto</SelectItem>
                    <SelectItem value="indices">Índices</SelectItem>
                    <SelectItem value="commodities">Commodities</SelectItem>
                    <SelectItem value="stocks">Acciones</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contract_size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tamaño de Contrato</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="100000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pip_value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor del Pip</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pip_position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Posición del Pip</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="4" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="spread_typical"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Spread Típico</FormLabel>
                <FormControl>
                  <Input type="number" step="0.00001" placeholder="0.00015" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="leverage_max"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apalancamiento Máximo</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="500" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            Crear Contrato
          </Button>
        </div>
      </form>
    </Form>
  );
}