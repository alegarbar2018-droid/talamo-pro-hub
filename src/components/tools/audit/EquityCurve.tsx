import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush } from 'recharts';

interface EquityCurveProps {
  data: Array<{
    time: string;
    balance: number;
    equity: number;
  }>;
}

export const EquityCurve = ({ data }: EquityCurveProps) => {
  const chartData = data.map(d => ({
    ...d,
    time: new Date(d.time).toLocaleDateString(),
  }));

  if (data.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center text-muted-foreground">
        No hay datos de equity disponibles
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" />
        <XAxis
          dataKey="time"
          stroke="hsl(var(--muted-foreground))"
          tick={{ fontSize: 12 }}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `$${value.toLocaleString()}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--surface))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '0.5rem',
          }}
          formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
        />
        <Line
          type="monotone"
          dataKey="equity"
          stroke="hsl(185, 100%, 38%)"
          strokeWidth={2}
          dot={false}
          name="Equity"
        />
        <Line
          type="monotone"
          dataKey="balance"
          stroke="hsl(var(--muted-foreground))"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={false}
          name="Balance"
        />
        <Brush
          dataKey="time"
          height={30}
          stroke="hsl(185, 100%, 38%)"
          fill="hsl(var(--surface))"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
