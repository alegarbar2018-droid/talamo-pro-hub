import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ContractSpecCard } from "./ContractSpecCard";
import { ContractSpecDrawer } from "./ContractSpecDrawer";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import type { ContractSpec } from "@/hooks/useContractSpec";

export function ContractSpecifications() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [showSpecDrawer, setShowSpecDrawer] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const { data: specs, isLoading } = useQuery({
    queryKey: ["contract-specifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contract_specifications")
        .select("*")
        .eq("status", "active")
        .order("symbol", { ascending: true });
      
      if (error) throw error;
      return data as ContractSpec[];
    },
  });

  const handleViewDetails = (symbol: string) => {
    setSelectedSymbol(symbol);
    setShowSpecDrawer(true);
  };

  const filteredSpecs = specs?.filter((spec) => {
    const matchesSearch = 
      spec.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spec.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = 
      activeTab === "all" || 
      spec.asset_class === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const assetClasses = [...new Set(specs?.map(s => s.asset_class) || [])];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por símbolo o nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="all">Todos</TabsTrigger>
            {assetClasses.map((assetClass) => (
              <TabsTrigger key={assetClass} value={assetClass} className="capitalize">
                {assetClass}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-64" />
                ))}
              </div>
            ) : filteredSpecs && filteredSpecs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSpecs.map((spec) => (
                  <ContractSpecCard
                    key={spec.id}
                    spec={spec}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No se encontraron especificaciones
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <ContractSpecDrawer
        symbol={selectedSymbol}
        open={showSpecDrawer}
        onOpenChange={setShowSpecDrawer}
      />
    </div>
  );
}
