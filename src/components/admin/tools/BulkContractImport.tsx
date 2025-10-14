import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, CheckCircle, FileText, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface BulkContractImportProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const SYNTAX_GUIDE = `# SYNTAX GUIDE para Bulk Import de Contratos
# Formato: Un contrato por bloque, separados por "---"

SYMBOL:                    # Ejemplo: EURUSD
  name: string             # Ejemplo: "Euro vs US Dollar"
  asset_class: forex|crypto|indices|commodities|stocks
  contract_size: number    # Ejemplo: 100000
  pip_value: number        # Ejemplo: 10
  pip_position: number     # Ejemplo: 4 (decimales)
  min_lot: number          # Ejemplo: 0.01
  max_lot: number          # Ejemplo: 100
  spread_typical: number   # Ejemplo: 0.00015 (opcional)
  margin_percentage: number # Ejemplo: 0.02 (opcional)
  leverage_max: number     # Ejemplo: 500
  status: active|inactive  # Default: active

---
# EJEMPLOS:

EURUSD:
  name: "Euro vs US Dollar"
  asset_class: forex
  contract_size: 100000
  pip_value: 10
  pip_position: 4
  min_lot: 0.01
  max_lot: 100
  spread_typical: 0.00015
  leverage_max: 500
  status: active

---

BTCUSD:
  name: "Bitcoin vs US Dollar"
  asset_class: crypto
  contract_size: 1
  pip_value: 1
  pip_position: 2
  min_lot: 0.01
  max_lot: 10
  spread_typical: 50
  leverage_max: 100
  status: active

---

US30:
  name: "Dow Jones Industrial Average"
  asset_class: indices
  contract_size: 10
  pip_value: 10
  pip_position: 0
  min_lot: 0.10
  max_lot: 50
  spread_typical: 2.5
  leverage_max: 200
  status: active`;

const BulkContractImport = ({ onSuccess, onCancel }: BulkContractImportProps) => {
  const [inputText, setInputText] = useState("");
  const [parsedContracts, setParsedContracts] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isValidated, setIsValidated] = useState(false);

  const parseYAML = (text: string) => {
    const blocks = text.split("---").filter(b => b.trim() && !b.trim().startsWith("#"));
    const contracts: any[] = [];
    const parseErrors: string[] = [];

    blocks.forEach((block, idx) => {
      try {
        const lines = block.trim().split("\n").filter(l => l.trim() && !l.trim().startsWith("#"));
        if (lines.length === 0) return;

        const symbolLine = lines[0];
        const symbol = symbolLine.split(":")[0].trim();
        
        const contract: any = { symbol, status: "active" };

        lines.slice(1).forEach(line => {
          const [key, ...valueParts] = line.split(":");
          const value = valueParts.join(":").trim().replace(/["']/g, "");
          const cleanKey = key.trim();

          if (["contract_size", "pip_value", "min_lot", "max_lot", "spread_typical", "margin_percentage", "leverage_max"].includes(cleanKey)) {
            contract[cleanKey] = parseFloat(value);
          } else if (cleanKey === "pip_position") {
            contract[cleanKey] = parseInt(value);
          } else {
            contract[cleanKey] = value;
          }
        });

        // Validar campos requeridos
        const required = ["name", "asset_class", "contract_size", "pip_value", "pip_position", "min_lot", "max_lot", "leverage_max"];
        const missing = required.filter(field => !contract[field]);
        
        if (missing.length > 0) {
          parseErrors.push(`Bloque ${idx + 1} (${symbol}): Faltan campos: ${missing.join(", ")}`);
        } else {
          contracts.push(contract);
        }
      } catch (error) {
        parseErrors.push(`Error en bloque ${idx + 1}: ${error}`);
      }
    });

    return { contracts, parseErrors };
  };

  const handleValidate = () => {
    const { contracts, parseErrors } = parseYAML(inputText);
    setParsedContracts(contracts);
    setErrors(parseErrors);
    setIsValidated(true);

    if (parseErrors.length === 0 && contracts.length > 0) {
      toast({
        title: "✅ Validación exitosa",
        description: `${contracts.length} contrato(s) listo(s) para importar`
      });
    }
  };

  const handleImport = async () => {
    if (parsedContracts.length === 0) return;

    try {
      const { error } = await supabase
        .from("contract_specifications")
        .insert(parsedContracts);

      if (error) throw error;

      toast({
        title: "✅ Importación exitosa",
        description: `${parsedContracts.length} contratos importados correctamente`
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error al importar",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="import" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="import">Importar</TabsTrigger>
          <TabsTrigger value="guide">Guía de Sintaxis</TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Pega tu texto estructurado aquí:
            </label>
            <Textarea
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setIsValidated(false);
              }}
              placeholder="EURUSD:&#10;  name: Euro vs US Dollar&#10;  asset_class: forex&#10;  ..."
              className="font-mono text-sm min-h-[300px]"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleValidate} variant="outline" className="flex-1">
              <FileText className="h-4 w-4 mr-2" />
              Validar Sintaxis
            </Button>
            <Button
              onClick={handleImport}
              disabled={!isValidated || parsedContracts.length === 0 || errors.length > 0}
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              Importar {parsedContracts.length > 0 && `(${parsedContracts.length})`}
            </Button>
          </div>

          {/* Errores */}
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-semibold mb-2">Errores encontrados:</div>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {errors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Preview */}
          {isValidated && parsedContracts.length > 0 && errors.length === 0 && (
            <Card className="border-success/50 bg-success/5">
              <CardHeader>
                <CardTitle className="text-success flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Preview: {parsedContracts.length} contrato(s) válido(s)
                </CardTitle>
                <CardDescription>Revisa los datos antes de importar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {parsedContracts.map((contract, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-background border border-line">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-foreground">{contract.symbol}</h4>
                      <div className="flex gap-2">
                        <Badge variant="outline">{contract.asset_class}</Badge>
                        <Badge variant={contract.status === "active" ? "default" : "secondary"}>
                          {contract.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Nombre:</span>
                        <p className="font-medium">{contract.name}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Contract Size:</span>
                        <p className="font-medium">{contract.contract_size}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Pip Value:</span>
                        <p className="font-medium">{contract.pip_value}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Leverage:</span>
                        <p className="font-medium">1:{contract.leverage_max}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="guide">
          <Card>
            <CardHeader>
              <CardTitle>Guía de Sintaxis YAML</CardTitle>
              <CardDescription>
                Usa este formato para importar múltiples contratos a la vez
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto font-mono whitespace-pre-wrap">
                {SYNTAX_GUIDE}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </div>
  );
};

export default BulkContractImport;
