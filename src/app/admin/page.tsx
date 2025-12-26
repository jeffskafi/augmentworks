import { DollarSign, Users, AlertTriangle, Receipt } from "lucide-react";
import { StatsCard } from "~/components/admin/StatsCard";
import { IncidentsChart } from "~/components/admin/IncidentsChart";
import { ActivityFeed } from "~/components/admin/ActivityFeed";
import { getAdminDashboardStats, getMetricsHistory } from "~/actions/admin";
import type { ActivityItem } from "~/types/database";

export default async function AdminCommandCenter() {
  const stats = await getAdminDashboardStats();
  const metricsHistory = await getMetricsHistory();

  // Process metrics for chart
  const chartData = processMetricsForChart(metricsHistory);

  // Mock activity feed for now (would come from an activity log table in production)
  const activities: ActivityItem[] = [
    {
      id: "1",
      type: "metrics_update",
      description: "Safety score improved to 94%",
      client_name: "Acme Corp",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: "2",
      type: "status_change",
      description: "Project moved to Monitoring phase",
      client_name: "TechStart Inc",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: "3",
      type: "invoice_paid",
      description: "Invoice #INV-2024-012 paid ($4,500)",
      client_name: "DataFlow Systems",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
    {
      id: "4",
      type: "login",
      description: "User logged in",
      client_name: "Acme Corp",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    },
  ];

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-violet-100">Command Center</h1>
        <p className="text-violet-400/70">
          Overview of all clients and system metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Monthly Recurring Revenue"
          value={`$${stats.total_mrr.toLocaleString()}`}
          subtitle="Active contracts"
          icon={DollarSign}
        />
        <StatsCard
          title="Active Clients"
          value={stats.active_clients}
          subtitle="In monitoring phase"
          icon={Users}
        />
        <StatsCard
          title="Hallucinations Caught"
          value={stats.total_hallucinations_this_month}
          subtitle="This month"
          icon={AlertTriangle}
        />
        <StatsCard
          title="Pending Invoices"
          value={stats.pending_invoices_count}
          subtitle={`$${stats.pending_invoices_total.toLocaleString()} total`}
          icon={Receipt}
        />
      </div>

      {/* Chart and Activity Feed */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <IncidentsChart data={chartData} />
        </div>
        <div>
          <ActivityFeed activities={activities} />
        </div>
      </div>
    </div>
  );
}

function processMetricsForChart(metrics: { report_month: string; hallucinations_count: number; jailbreak_attempts: number }[]) {
  // Group metrics by month and sum
  const monthlyData: Record<string, { hallucinations: number; jailbreaks: number }> = {};

  metrics.forEach((m) => {
    const month = new Date(m.report_month).toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    });

    monthlyData[month] ??= { hallucinations: 0, jailbreaks: 0 };

    monthlyData[month].hallucinations += m.hallucinations_count;
    monthlyData[month].jailbreaks += m.jailbreak_attempts;
  });

  // Convert to array format for chart
  return Object.entries(monthlyData).map(([month, data]) => ({
    month,
    hallucinations: data.hallucinations,
    jailbreaks: data.jailbreaks,
  }));
}

