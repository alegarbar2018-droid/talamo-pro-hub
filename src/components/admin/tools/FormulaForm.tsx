import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const formulaSchema = z.object({
  name: z.string().min(1, "Nombre es requerido"),
  slug: z.string().min(1, "Slug es requerido").toLowerCase(),
  category: z.enum(["risk", "position_sizing", "profit_loss", "indicators", "money_management"]),
  description: z.string().min(10, "Descripción muy corta"),
  formula_plain: z.string().min(1, "Fórmula es requerida"),
  explanation: z.string().min(10, "Explicación es requerida"),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
  status: z.enum(["published", "draft"]).default("published"),
});

type FormulaFormValues = z.infer<typeof formulaSchema>;

interface FormulaFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function FormulaForm({ onSuccess, onCancel }: FormulaFormProps) {
  const { toast } = useToast();
  const form = useForm<FormulaFormValues>({
    resolver: zodResolver(formulaSchema),
    defaultValues: {
      category: "risk",
      difficulty: "beginner",
      status: "published",
    },
  });

  const onSubmit = async (data: FormulaFormValues) => {
    try {
      const { error } = await supabase
        .from("trading_formulas")
        .insert([{ ...data, variables: [] } as any]);

      if (error) throw error;

      toast({
        title: "Fórmula creada",
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Risk per Trade" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="risk-per-trade" {...field} />
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="risk">Gestión de Riesgo</SelectItem>
                    <SelectItem value="position_sizing">Tamaño de Posición</SelectItem>
                    <SelectItem value="profit_loss">Ganancias/Pérdidas</SelectItem>
                    <SelectItem value="indicators">Indicadores</SelectItem>
                    <SelectItem value="money_management">Administración del Dinero</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dificultad</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="beginner">Principiante</SelectItem>
                    <SelectItem value="intermediate">Intermedio</SelectItem>
                    <SelectItem value="advanced">Avanzado</SelectItem>
                  </SelectContent>
                </Select>
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
                <Input placeholder="Breve descripción de la fórmula" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="formula_plain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fórmula</FormLabel>
              <FormControl>
                <Input placeholder="Result = (A × B) / C" {...field} />
              </FormControl>
              <FormDescription>
                Escribe la fórmula en texto plano
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Explicación</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Explica cómo funciona la fórmula y cuándo usarla..."
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            Crear Fórmula
          </Button>
        </div>
      </form>
    </Form>
  );
}