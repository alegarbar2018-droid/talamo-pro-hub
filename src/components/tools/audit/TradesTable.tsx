import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Download, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface TradesTableProps {
  trades: Array<{
    ticket: string;
    symbol: string;
    type: string;
    volume: number;
    open_time: string;
    close_time: string | null;
    open_price: number;
    close_price: number | null;
    profit: number | null;
  }>;
}

export const TradesTable = ({ trades }: TradesTableProps) => {
  const { t } = useTranslation();
  const [symbolFilter, setSymbolFilter] = useState('');

  const filteredTrades = trades.filter(t =>
    t.symbol.toLowerCase().includes(symbolFilter.toLowerCase())
  );

  const exportCSV = () => {
    const csv = [
      ['Ticket', 'Symbol', 'Type', 'Volume', 'Open Time', 'Close Time', 'Open Price', 'Close Price', 'Profit'],
      ...filteredTrades.map(t => [
        t.ticket,
        t.symbol,
        t.type,
        t.volume,
        t.open_time,
        t.close_time || '',
        t.open_price,
        t.close_price || '',
        t.profit || '',
      ]),
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trades_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (trades.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {t('tools.audit.no_trades', 'No hay operaciones disponibles')}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t('tools.audit.filter_symbol', 'Filtrar por símbolo...')}
            value={symbolFilter}
            onChange={e => setSymbolFilter(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={exportCSV}>
          <Download className="w-4 h-4 mr-2" />
          {t('tools.audit.export_csv', 'Exportar CSV')}
        </Button>
      </div>

      <div className="border border-line/30 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-surface/50">
              <TableHead>Ticket</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Volume</TableHead>
              <TableHead>Open</TableHead>
              <TableHead>Close</TableHead>
              <TableHead className="text-right">Profit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTrades.map(trade => (
              <TableRow key={trade.ticket}>
                <TableCell className="font-mono text-xs">{trade.ticket}</TableCell>
                <TableCell className="font-semibold">{trade.symbol}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      trade.type === 'buy' ? 'bg-profit/20 text-profit' : 'bg-loss/20 text-loss'
                    }`}
                  >
                    {trade.type.toUpperCase()}
                  </span>
                </TableCell>
                <TableCell className="text-right tabular-nums">{trade.volume}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(trade.open_time).toLocaleString()}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {trade.close_time ? new Date(trade.close_time).toLocaleString() : '-'}
                </TableCell>
                <TableCell
                  className={`text-right tabular-nums font-semibold ${
                    trade.profit && trade.profit > 0 ? 'text-profit' : 'text-loss'
                  }`}
                >
                  {trade.profit ? `$${trade.profit.toFixed(2)}` : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
