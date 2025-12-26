import { DollarSign, Users, AlertTriangle, Receipt } from "lucide-react";
import { StatsCard } from "~/components/admin/StatsCard";
import { IncidentsChart } from "~/components/admin/IncidentsChart";
import { ActivityFeed } from "~/components/admin/ActivityFeed";
import type { ActivityItem } from "~/types/database";

// Mock data for demo
const mockStats = {
  total_mrr: 15000,
  active_clients: 6,
  total_hallucinations_this_month: 87,
  pending_invoices_count: 4,
  pending_invoices_total: 12500,
};

const mockChartData = [
  { month: "Jul '24", hallucinations: 67, jailbreaks: 22 },
  { month: "Aug '24", hallucinations: 45, jailbreaks: 15 },
  { month: "Sep '24", hallucinations: 31, jailbreaks: 12 },
  { month: "Oct '24", hallucinations: 24, jailbreaks: 8 },
  { month: "Nov '24", hallucinations: 18, jailbreaks: 5 },
  { month: "Dec '24", hallucinations: 12, jailbreaks: 3 },
];

const mockActivities: ActivityItem[] = [
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

export default function DemoAdminCommandCenter() {
  return (
    <div className="min-h-screen p-8">
      {/* Demo Banner */}
      <div className="mb-6 flex items-center gap-2 rounded-lg bg-violet-600/20 px-4 py-2 text-sm text-violet-300">
        <span className="size-2 rounded-full bg-violet-400" />
        Admin Demo Mode – This is a preview with mock data
      </div>

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
          value={`$${mockStats.total_mrr.toLocaleString()}`}
          subtitle="Active contracts"
          icon={DollarSign}
        />
        <StatsCard
          title="Active Clients"
          value={mockStats.active_clients}
          subtitle="In monitoring phase"
          icon={Users}
        />
        <StatsCard
          title="Hallucinations Caught"
          value={mockStats.total_hallucinations_this_month}
          subtitle="This month"
          icon={AlertTriangle}
        />
        <StatsCard
          title="Pending Invoices"
          value={mockStats.pending_invoices_count}
          subtitle={`$${mockStats.pending_invoices_total.toLocaleString()} total`}
          icon={Receipt}
        />
      </div>

      {/* Chart and Activity Feed */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <IncidentsChart data={mockChartData} />
        </div>
        <div>
          <ActivityFeed activities={mockActivities} />
        </div>
      </div>
    </div>
  );
}

