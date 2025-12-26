import { Activity, UserCheck, TrendingUp, CreditCard } from "lucide-react";
import type { ActivityItem } from "~/types/database";
import { cn } from "~/lib/utils";

interface ActivityFeedProps {
  activities: ActivityItem[];
}

const activityIcons = {
  login: UserCheck,
  status_change: Activity,
  metrics_update: TrendingUp,
  invoice_paid: CreditCard,
};

const activityColors = {
  login: "text-blue-400 bg-blue-400/10",
  status_change: "text-violet-400 bg-violet-400/10",
  metrics_update: "text-emerald-400 bg-emerald-400/10",
  invoice_paid: "text-amber-400 bg-amber-400/10",
};

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="rounded-xl border border-violet-900/30 bg-gradient-to-br from-slate-900 to-slate-900/50 p-6">
      <h3 className="mb-4 text-lg font-semibold text-violet-100">
        Recent Activity
      </h3>
      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-sm text-violet-400/60">No recent activity</p>
        ) : (
          activities.map((activity) => {
            const Icon = activityIcons[activity.type];
            const colorClass = activityColors[activity.type];
            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 rounded-lg bg-slate-800/30 p-3"
              >
                <div className={cn("rounded-lg p-2", colorClass)}>
                  <Icon className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-violet-100">
                    {activity.client_name}
                  </p>
                  <p className="text-sm text-violet-400/70">
                    {activity.description}
                  </p>
                </div>
                <span className="text-xs text-violet-400/50 whitespace-nowrap">
                  {formatTimeAgo(activity.timestamp)}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

