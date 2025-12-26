import {
  Shield,
  AlertTriangle,
  ShieldAlert,
  Activity,
} from "lucide-react";
import { MetricCard } from "./MetricCard";
import type { MetricsWithTrend } from "~/types/database";

interface MetricsGridProps {
  metrics: MetricsWithTrend | null;
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  if (!metrics) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-[140px] animate-pulse rounded-xl border border-border bg-card"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="stagger-children grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Safety Score"
        value={metrics.safety_score}
        change={metrics.safety_score_change}
        changeLabel="vs last month"
        icon={Shield}
        iconColor="success"
        format="percentage"
      />
      <MetricCard
        title="Hallucinations"
        value={metrics.hallucinations_count}
        change={metrics.hallucinations_change}
        changeLabel="vs last month"
        icon={AlertTriangle}
        iconColor="warning"
        invertTrend
      />
      <MetricCard
        title="Jailbreak Attempts"
        value={metrics.jailbreak_attempts}
        change={metrics.jailbreak_change}
        changeLabel="vs last month"
        icon={ShieldAlert}
        iconColor="destructive"
        invertTrend
      />
      <MetricCard
        title="Requests Processed"
        value={metrics.requests_processed}
        change={metrics.requests_change}
        changeLabel="vs last month"
        icon={Activity}
        iconColor="default"
      />
    </div>
  );
}

