import { type LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn, formatNumber } from "~/lib/utils";
import { Card, CardContent } from "~/components/ui/card";

interface MetricCardProps {
  title: string;
  value: number | string;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  iconColor?: "default" | "success" | "warning" | "destructive";
  format?: "number" | "percentage" | "currency";
  invertTrend?: boolean; // For metrics where lower is better (e.g., hallucinations)
}

export function MetricCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  iconColor = "default",
  format = "number",
  invertTrend = false,
}: MetricCardProps) {
  const formattedValue =
    format === "percentage"
      ? `${value}%`
      : format === "currency"
        ? `$${formatNumber(Number(value))}`
        : formatNumber(Number(value));

  const trendDirection =
    change === undefined || change === 0
      ? "neutral"
      : invertTrend
        ? change < 0
          ? "up"
          : "down"
        : change > 0
          ? "up"
          : "down";

  const TrendIcon =
    trendDirection === "up"
      ? TrendingUp
      : trendDirection === "down"
        ? TrendingDown
        : Minus;

  const iconColorClasses = {
    default: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    destructive: "bg-destructive/10 text-destructive",
  };

  const trendColorClasses = {
    up: invertTrend
      ? "text-destructive bg-destructive/10"
      : "text-success bg-success/10",
    down: invertTrend
      ? "text-success bg-success/10"
      : "text-destructive bg-destructive/10",
    neutral: "text-muted-foreground bg-muted",
  };

  return (
    <Card className="relative overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/5">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight text-foreground">
              {formattedValue}
            </p>
            {change !== undefined && (
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                    trendColorClasses[trendDirection]
                  )}
                >
                  <TrendIcon className="size-3" />
                  {Math.abs(change)}%
                </span>
                {changeLabel && (
                  <span className="text-xs text-muted-foreground">
                    {changeLabel}
                  </span>
                )}
              </div>
            )}
          </div>
          <div
            className={cn(
              "flex size-12 items-center justify-center rounded-xl",
              iconColorClasses[iconColor]
            )}
          >
            <Icon className="size-6" />
          </div>
        </div>
      </CardContent>
      {/* Subtle gradient accent */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </Card>
  );
}

