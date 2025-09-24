export type SignalRow = {
  name: string;
  pf: number;
  dd: number;
  winRate: number;
  rMultiple: number;
  sample: number;
};

export const SIGNALS: SignalRow[] = [
  { name: "Breakout H1", pf: 1.8, dd: 9.5, winRate: 46, rMultiple: 1.7, sample: 480 },
  { name: "Reversión M15", pf: 1.4, dd: 6.2, winRate: 54, rMultiple: 1.2, sample: 620 },
  { name: "Tendencia D1", pf: 2.1, dd: 12.3, winRate: 41, rMultiple: 2.0, sample: 310 }
];