import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContractSpecForm } from "@/components/admin/tools/ContractSpecForm";
import { FormulaForm } from "@/components/admin/tools/FormulaForm";
import { PermissionGuard } from "@/components/admin/PermissionGuard";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, FileText, Calculator, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AdminTools() {
  const [activeTab, setActiveTab] = useState("contracts");
  const [isNewContractModalOpen, setIsNewContractModalOpen] = useState(false);
  const [isNewFormulaModalOpen, setIsNewFormulaModalOpen] = useState(false);

  const { data: contracts, isLoading: loadingContracts, refetch: refetchContracts } = useQuery({
    queryKey: ["admin-contracts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contract_specifications")
        .select("*")
        .order("symbol", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: formulas, isLoading: loadingFormulas, refetch: refetchFormulas } = useQuery({
    queryKey: ["admin-formulas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trading_formulas")
        .select("*")
        .order("category", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: calculators, isLoading: loadingCalculators, refetch: refetchCalculators } = useQuery({
    queryKey: ["admin-calculators"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("calculator_configs")
        .select("*")
        .order("position", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  return (
    <PermissionGuard resource="tools" action="manage">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Herramientas</h1>
            <p className="text-muted-foreground mt-1">
              Administra contratos, fórmulas y configuraciones de calculadoras
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="contracts">
              <DollarSign className="w-4 h-4 mr-2" />
              Contratos
            </TabsTrigger>
            <TabsTrigger value="formulas">
              <FileText className="w-4 h-4 mr-2" />
              Fórmulas
            </TabsTrigger>
            <TabsTrigger value="calculators">
              <Calculator className="w-4 h-4 mr-2" />
              Calculadoras
            </TabsTrigger>
          </TabsList>

          {/* Contracts Tab */}
          <TabsContent value="contracts" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setIsNewContractModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Contrato
              </Button>
            </div>

            {loadingContracts ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {contracts?.map((contract) => (
                  <Card key={contract.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{contract.symbol}</CardTitle>
                        <Badge variant={contract.status === 'active' ? 'default' : 'secondary'}>
                          {contract.status}
                        </Badge>
                      </div>
                      <CardDescription>{contract.name}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm space-y-1">
                      <p><strong>Clase:</strong> {contract.asset_class}</p>
                      <p><strong>Pip Value:</strong> ${contract.pip_value}</p>
                      <p><strong>Contract Size:</strong> {contract.contract_size}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Formulas Tab */}
          <TabsContent value="formulas" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setIsNewFormulaModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Fórmula
              </Button>
            </div>

            {loadingFormulas ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            ) : (
              <div className="grid gap-4">
                {formulas?.map((formula) => (
                  <Card key={formula.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{formula.name}</CardTitle>
                        <div className="flex gap-2">
                          <Badge>{formula.category}</Badge>
                          <Badge variant="outline">{formula.difficulty}</Badge>
                        </div>
                      </div>
                      <CardDescription>{formula.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <code className="block p-3 bg-muted rounded text-sm">
                        {formula.formula_plain}
                      </code>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Calculators Tab */}
          <TabsContent value="calculators" className="space-y-4">
            {loadingCalculators ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : (
              <div className="grid gap-4">
                {calculators?.map((calc) => (
                  <Card key={calc.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{calc.name}</CardTitle>
                        <Badge>{calc.category}</Badge>
                      </div>
                      <CardDescription>{calc.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Contract Dialog */}
        <Dialog open={isNewContractModalOpen} onOpenChange={setIsNewContractModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nuevo Contrato</DialogTitle>
            </DialogHeader>
            <ContractSpecForm
              onSuccess={() => {
                setIsNewContractModalOpen(false);
                refetchContracts();
              }}
              onCancel={() => setIsNewContractModalOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Formula Dialog */}
        <Dialog open={isNewFormulaModalOpen} onOpenChange={setIsNewFormulaModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nueva Fórmula</DialogTitle>
            </DialogHeader>
            <FormulaForm
              onSuccess={() => {
                setIsNewFormulaModalOpen(false);
                refetchFormulas();
              }}
              onCancel={() => setIsNewFormulaModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </PermissionGuard>
  );
}