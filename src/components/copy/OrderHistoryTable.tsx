import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { StrategyOrder } from "@/modules/copy/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/locale";
import { format } from "date-fns";
import { ArrowUp, ArrowDown } from "lucide-react";

interface OrderHistoryTableProps {
  strategyId: string;
}

export function OrderHistoryTable({ strategyId }: OrderHistoryTableProps) {
  const { t, i18n } = useTranslation();
  const [orders, setOrders] = useState<StrategyOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [strategyId]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('copy_strategy_orders')
        .select('*')
        .eq('strategy_id', strategyId)
        .order('opened_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setOrders((data || []) as StrategyOrder[]);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {t("copy.strategy.no_orders")}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("copy.strategy.symbol")}</TableHead>
            <TableHead>{t("copy.strategy.type")}</TableHead>
            <TableHead>{t("copy.strategy.volume")}</TableHead>
            <TableHead>{t("copy.strategy.open_price")}</TableHead>
            <TableHead>{t("copy.strategy.close_price")}</TableHead>
            <TableHead>{t("copy.strategy.profit_loss")}</TableHead>
            <TableHead>{t("copy.strategy.status")}</TableHead>
            <TableHead>{t("copy.strategy.date")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.symbol}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {order.order_type === 'buy' ? (
                    <ArrowUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className="capitalize">{order.order_type}</span>
                </div>
              </TableCell>
              <TableCell>{order.volume.toFixed(2)}</TableCell>
              <TableCell>{formatCurrency(order.open_price, i18n.language)}</TableCell>
              <TableCell>
                {order.close_price 
                  ? formatCurrency(order.close_price, i18n.language)
                  : '-'}
              </TableCell>
              <TableCell>
                {order.profit_loss !== null && order.profit_loss !== undefined ? (
                  <span className={order.profit_loss >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {order.profit_loss >= 0 ? '+' : ''}
                    {formatCurrency(order.profit_loss, i18n.language)}
                  </span>
                ) : '-'}
              </TableCell>
              <TableCell>
                <Badge 
                  variant={
                    order.status === 'closed' ? 'secondary' : 
                    order.status === 'open' ? 'default' : 
                    'outline'
                  }
                >
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {format(new Date(order.opened_at), 'dd/MM/yyyy HH:mm')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
