import { cn } from "~/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-violet-900/30 bg-gradient-to-br from-slate-900 to-slate-900/50 p-6",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-violet-300/70">{title}</p>
          <p className="mt-2 text-3xl font-bold text-violet-50">{value}</p>
          {subtitle && (
            <p className="mt-1 text-sm text-violet-400/60">{subtitle}</p>
          )}
          {trend && (
            <p
              className={cn(
                "mt-2 text-sm font-medium",
                trend.isPositive ? "text-emerald-400" : "text-red-400"
              )}
            >
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              <span className="text-violet-400/60"> vs last month</span>
            </p>
          )}
        </div>
        <div className="rounded-lg bg-violet-600/20 p-3">
          <Icon className="size-6 text-violet-400" />
        </div>
      </div>
    </div>
  );
}

