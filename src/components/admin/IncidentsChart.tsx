"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ChartDataPoint {
  month: string;
  hallucinations: number;
  jailbreaks: number;
}

interface IncidentsChartProps {
  data: ChartDataPoint[];
}

export function IncidentsChart({ data }: IncidentsChartProps) {
  return (
    <div className="rounded-xl border border-violet-900/30 bg-gradient-to-br from-slate-900 to-slate-900/50 p-6">
      <h3 className="mb-6 text-lg font-semibold text-violet-100">
        Incidents Prevented (Last 6 Months)
      </h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="month"
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
            />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #475569",
                borderRadius: "8px",
                color: "#e2e8f0",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="hallucinations"
              name="Hallucinations Caught"
              stroke="#f97316"
              strokeWidth={2}
              dot={{ fill: "#f97316", strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="jailbreaks"
              name="Jailbreaks Blocked"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ fill: "#8b5cf6", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

