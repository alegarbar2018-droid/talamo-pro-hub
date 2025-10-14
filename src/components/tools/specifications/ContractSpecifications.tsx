import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ContractSpecCard } from "./ContractSpecCard";
import { useContractSpecs } from "@/hooks/useContractSpec";
import { Skeleton } from "@/components/ui/skeleton";

const ASSET_CLASSES = [
  { value: "all", label: "Todos" },
  { value: "forex", label: "Forex" },
  { value: "crypto", label: "Crypto" },
  { value: "indices", label: "Índices" },
  { value: "commodities", label: "Commodities" },
  { value: "stocks", label: "Acciones" }
];

export function ContractSpecifications() {
  const { data: specs, isLoading } = useContractSpecs();
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");

  const filteredSpecs = useMemo(() => {
    if (!specs) return [];

    return specs.filter((spec) => {
      const matchesSearch =
        spec.symbol.toLowerCase().includes(search.toLowerCase()) ||
        spec.name.toLowerCase().includes(search.toLowerCase());

      const matchesClass =
        selectedClass === "all" || spec.asset_class === selectedClass;

      return matchesSearch && matchesClass;
    });
  }, [specs, search, selectedClass]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal/10 text-teal border border-teal/20">
          <FileText className="h-4 w-4" />
          <span className="text-sm font-medium">Especificaciones de Contratos</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal to-teal/60 bg-clip-text text-transparent">
          Condiciones de Trading
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Consulta las especificaciones detalladas de cada instrumento: spreads,
          apalancamiento, costos y más.
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4"
      >
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por símbolo o nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Asset Class Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {ASSET_CLASSES.map((assetClass) => (
            <Badge
              key={assetClass.value}
              variant={selectedClass === assetClass.value ? "default" : "outline"}
              className="cursor-pointer transition-all hover:scale-105"
              onClick={() => setSelectedClass(assetClass.value)}
            >
              {assetClass.label}
            </Badge>
          ))}
        </div>
      </motion.div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : filteredSpecs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 space-y-4"
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-surface flex items-center justify-center">
            <FileText className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold">No se encontraron instrumentos</h3>
          <p className="text-muted-foreground">
            Intenta ajustar los filtros o la búsqueda
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredSpecs.map((spec, index) => (
            <motion.div
              key={spec.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ContractSpecCard spec={spec} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
