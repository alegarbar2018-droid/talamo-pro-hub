import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PermissionGuard } from "@/components/admin/PermissionGuard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Calculator, DollarSign, Upload } from "lucide-react";
import { ContractSpecForm } from "@/components/admin/tools/ContractSpecForm";
import { FormulaForm } from "@/components/admin/tools/FormulaForm";
import { CalculatorConfigForm } from "@/components/admin/tools/CalculatorConfigForm";
import BulkContractImport from "@/components/admin/tools/BulkContractImport";

const AdminTools = () => {
  const [activeTab, setActiveTab] = useState("contracts");
  const [isNewContractModalOpen, setIsNewContractModalOpen] = useState(false);
  const [isNewFormulaModalOpen, setIsNewFormulaModalOpen] = useState(false);
  const [isNewCalculatorModalOpen, setIsNewCalculatorModalOpen] = useState(false);
  const [isBulkImportModalOpen, setIsBulkImportModalOpen] = useState(false);

  // Fetch contracts
  const { data: contracts, isLoading: contractsLoading, refetch: refetchContracts } = useQuery({
    queryKey: ["admin-contract-specs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contract_specifications")
        .select("*")
        .order("symbol", { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  // Fetch formulas
  const { data: formulas, isLoading: formulasLoading, refetch: refetchFormulas } = useQuery({
    queryKey: ["admin-trading-formulas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trading_formulas")
        .select("*")
        .order("category", { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  // Fetch calculator configs
  const { data: calculators, isLoading: calculatorsLoading, refetch: refetchCalculators } = useQuery({
    queryKey: ["admin-calculator-configs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("calculator_configs")
        .select("*")
        .order("position", { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  return (
    <PermissionGuard resource="tools" action="manage">
      <div className="container mx-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Gestión de Herramientas</h1>
              <p className="text-muted-foreground mt-1">
                Administra contratos, fórmulas y configuraciones de calculadoras
              </p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="contracts">
                <DollarSign className="h-4 w-4 mr-2" />
                Contratos
              </TabsTrigger>
              <TabsTrigger value="formulas">
                <FileText className="h-4 w-4 mr-2" />
                Fórmulas
              </TabsTrigger>
              <TabsTrigger value="calculators">
                <Calculator className="h-4 w-4 mr-2" />
                Calculadoras
              </TabsTrigger>
            </TabsList>

            {/* Contracts Tab */}
            <TabsContent value="contracts" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Especificaciones de Contratos</h3>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsBulkImportModalOpen(true)}>
                    <Upload className="h-4 w-4 mr-2" />
                    Importar Múltiples
                  </Button>
                  <Button onClick={() => setIsNewContractModalOpen(true)}>
                    Nuevo Contrato
                  </Button>
                </div>
              </div>

              {contractsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-40" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {contracts?.map((contract) => (
                    <Card key={contract.id} className="border-line">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{contract.symbol}</CardTitle>
                          <Badge variant={contract.status === "active" ? "default" : "secondary"}>
                            {contract.status}
                          </Badge>
                        </div>
                        <CardDescription>{contract.name}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Clase:</span>
                          <span className="font-medium capitalize">{contract.asset_class}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Pip Value:</span>
                          <span className="font-medium">${contract.pip_value}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Contract Size:</span>
                          <span className="font-medium">{contract.contract_size}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Leverage:</span>
                          <span className="font-medium">1:{contract.leverage_max}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Formulas Tab */}
            <TabsContent value="formulas" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Fórmulas de Trading</h3>
                <Button onClick={() => setIsNewFormulaModalOpen(true)}>
                  Nueva Fórmula
                </Button>
              </div>

              {formulasLoading ? (
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-32" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {formulas?.map((formula) => (
                    <Card key={formula.id} className="border-line">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base">{formula.name}</CardTitle>
                            <CardDescription className="mt-1">{formula.description}</CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Badge>{formula.category}</Badge>
                            <Badge variant="outline">{formula.difficulty}</Badge>
                            <Badge variant={formula.status === "published" ? "default" : "secondary"}>
                              {formula.status}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="p-3 rounded-lg bg-muted/50 font-mono text-sm">
                          {formula.formula_plain}
                        </div>
                        {formula.explanation && (
                          <p className="text-sm text-muted-foreground mt-3">{formula.explanation}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Calculators Tab */}
            <TabsContent value="calculators" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Configuraciones de Calculadoras</h3>
                <Button onClick={() => setIsNewCalculatorModalOpen(true)}>
                  Nueva Calculadora
                </Button>
              </div>

              {calculatorsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-32" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {calculators?.map((calc) => (
                    <Card key={calc.id} className="border-line">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base">{calc.name}</CardTitle>
                            <CardDescription className="mt-1">{calc.description}</CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Badge>{calc.category}</Badge>
                            <Badge variant={calc.status === "active" ? "default" : "secondary"}>
                              {calc.status}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">ID:</span>
                          <span className="font-mono text-xs">{calc.calculator_id}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Modals */}
          <Dialog open={isNewContractModalOpen} onOpenChange={setIsNewContractModalOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nueva Especificación de Contrato</DialogTitle>
              <DialogDescription>
                Define las características del contrato para cálculos precisos
              </DialogDescription>
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

        <Dialog open={isBulkImportModalOpen} onOpenChange={setIsBulkImportModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Importación Masiva de Contratos</DialogTitle>
              <DialogDescription>
                Importa múltiples contratos usando formato estructurado (YAML)
              </DialogDescription>
            </DialogHeader>
            <BulkContractImport
              onSuccess={() => {
                setIsBulkImportModalOpen(false);
                refetchContracts();
              }}
              onCancel={() => setIsBulkImportModalOpen(false)}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={isNewFormulaModalOpen} onOpenChange={setIsNewFormulaModalOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nueva Fórmula</DialogTitle>
              <DialogDescription>
                Agrega una fórmula de trading a la biblioteca
              </DialogDescription>
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

        <Dialog open={isNewCalculatorModalOpen} onOpenChange={setIsNewCalculatorModalOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nueva Calculadora</DialogTitle>
              <DialogDescription>
                Configura una nueva calculadora para los usuarios
              </DialogDescription>
            </DialogHeader>
            <CalculatorConfigForm
              onSuccess={() => {
                setIsNewCalculatorModalOpen(false);
                refetchCalculators();
              }}
              onCancel={() => setIsNewCalculatorModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
        </div>
    </PermissionGuard>
  );
};

export default AdminTools;
