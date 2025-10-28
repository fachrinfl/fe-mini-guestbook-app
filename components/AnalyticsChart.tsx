"use client";

import { HourlyAnalytics } from "@/lib/types";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface AnalyticsChartProps {
  data: HourlyAnalytics[];
}

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  const chartData = data.map((item) => ({
    hour: new Date(item.hour).getHours(),
    count: item.count,
    label: new Date(item.hour).toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: true,
    }),
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey="hour"
            tickFormatter={(value) => `${value}:00`}
            className="text-xs"
          />
          <YAxis className="text-xs" />
          <Tooltip
            labelFormatter={(value) => `Hour: ${value}:00`}
            formatter={(value) => [value, "Guests"]}
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              fontSize: "12px",
            }}
          />
          <Bar
            dataKey="count"
            fill="#3b82f6"
            radius={[2, 2, 0, 0]}
            className="opacity-80"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
