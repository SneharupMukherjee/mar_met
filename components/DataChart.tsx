'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { MetricRow } from '@/lib/data/types';

export function DataChart({ data }: { data: MetricRow[] }) {
  const compact = Object.values(
    data.reduce<Record<string, { channel: string; spend: number; revenue: number }>>((acc, row) => {
      if (!acc[row.channel]) acc[row.channel] = { channel: row.channel, spend: 0, revenue: 0 };
      acc[row.channel].spend += row.spend;
      acc[row.channel].revenue += row.revenue;
      return acc;
    }, {})
  );

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer>
        <BarChart data={compact}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="channel" stroke="#cbd5e1" />
          <YAxis stroke="#cbd5e1" />
          <Tooltip />
          <Bar dataKey="spend" fill="#38bdf8" />
          <Bar dataKey="revenue" fill="#22c55e" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
