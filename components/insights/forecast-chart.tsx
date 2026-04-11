'use client';

import { useId } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { formatCurrency } from '@/lib/utils/format';

interface MonthlyForecast {
  month: string;
  label: string;
  p10: number;
  p50: number;
  p90: number;
}

interface ForecastChartProps {
  forecast: MonthlyForecast[];
  currency?: string;
}

/**
 * Custom tooltip for the forecast chart.
 */
function ChartTooltip({
  active,
  payload,
  currency,
}: {
  active?: boolean;
  payload?: Array<{ payload: MonthlyForecast }>;
  currency: string;
}) {
  if (!active || !payload?.length || !payload[0]) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg p-3">
      <p className="text-sm font-medium text-zinc-100 mb-2">{data.label}</p>
      <div className="space-y-1">
        <div className="flex justify-between gap-4">
          <span className="text-xs text-zinc-400">Optimistic (P90)</span>
          <span className="text-xs font-medium text-emerald-400">
            {formatCurrency(data.p90, currency)}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-xs text-zinc-400">Expected (P50)</span>
          <span className="text-xs font-medium text-teal-400">
            {formatCurrency(data.p50, currency)}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-xs text-zinc-400">Conservative (P10)</span>
          <span className="text-xs font-medium text-amber-400">
            {formatCurrency(data.p10, currency)}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * ForecastChart - Displays P10/P50/P90 income forecast bands.
 */
export function ForecastChart({
  forecast,
  currency = 'USD',
}: ForecastChartProps) {
  const gradientId = useId();

  if (forecast.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-zinc-500">
        No forecast data available
      </div>
    );
  }

  // Prepare chart data with short month labels
  const chartData = forecast.map((f) => ({
    ...f,
    monthLabel: f.label.split(' ')[0], // "April" from "April 2026"
  }));

  // Calculate y-axis domain with padding
  const allValues = forecast.flatMap((f) => [f.p10, f.p50, f.p90]);
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  const padding = (maxValue - minValue) * 0.1 || 1000;
  const yMin = Math.max(0, Math.floor((minValue - padding) / 1000) * 1000);
  const yMax = Math.ceil((maxValue + padding) / 1000) * 1000;

  // Calculate average for reference line
  const avgP50 = forecast.reduce((sum, f) => sum + f.p50, 0) / forecast.length;

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            {/* Gradient for P90 band */}
            <linearGradient
              id={`p90Gradient-${gradientId}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.05} />
            </linearGradient>
            {/* Gradient for P10 band */}
            <linearGradient
              id={`p10Gradient-${gradientId}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="monthLabel"
            stroke="#52525b"
            tick={{ fill: '#a1a1aa', fontSize: 12 }}
            tickLine={{ stroke: '#52525b' }}
            axisLine={{ stroke: '#52525b' }}
          />

          <YAxis
            stroke="#52525b"
            tick={{ fill: '#a1a1aa', fontSize: 12 }}
            tickLine={{ stroke: '#52525b' }}
            axisLine={{ stroke: '#52525b' }}
            domain={[yMin, yMax]}
            tickFormatter={(value) => {
              if (value >= 1000) {
                return `$${(value / 1000).toFixed(0)}k`;
              }
              return `$${value}`;
            }}
          />

          <Tooltip
            content={<ChartTooltip currency={currency} />}
            cursor={{ stroke: '#52525b', strokeDasharray: '3 3' }}
          />

          {/* Reference line for average */}
          <ReferenceLine
            y={avgP50}
            stroke="#8b5cf6"
            strokeDasharray="5 5"
            strokeOpacity={0.5}
          />

          {/* P90 band (optimistic) */}
          <Area
            type="monotone"
            dataKey="p90"
            stroke="#14b8a6"
            strokeWidth={1}
            strokeOpacity={0.5}
            fill={`url(#p90Gradient-${gradientId})`}
            name="P90"
          />

          {/* P50 line (expected) */}
          <Area
            type="monotone"
            dataKey="p50"
            stroke="#14b8a6"
            strokeWidth={2}
            fill="none"
            name="P50"
          />

          {/* P10 band (conservative) - rendered as area to show lower bound */}
          <Area
            type="monotone"
            dataKey="p10"
            stroke="#f59e0b"
            strokeWidth={1}
            strokeOpacity={0.5}
            fill={`url(#p10Gradient-${gradientId})`}
            name="P10"
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-teal-500/30 border border-teal-500" />
          <span className="text-xs text-zinc-400">Optimistic (P90)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-teal-500" />
          <span className="text-xs text-zinc-400">Expected (P50)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-amber-500/30 border border-amber-500" />
          <span className="text-xs text-zinc-400">Conservative (P10)</span>
        </div>
      </div>
    </div>
  );
}
