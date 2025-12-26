import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, Mail, Calendar, DollarSign } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { MetricsInjector } from "~/components/admin/MetricsInjector";
import { PhaseSelector } from "~/components/admin/PhaseSelector";
import { TaskAssigner } from "~/components/admin/TaskAssigner";
import { getClientById, getClientTasks, getClientInvoices } from "~/actions/admin";
import { cn } from "~/lib/utils";

interface ClientDetailPageProps {
  params: Promise<{ id: string }>;
}

const statusColors = {
  onboarding: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  audit: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  monitoring: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  completed: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

export default async function ClientDetailPage({ params }: ClientDetailPageProps) {
  const { id } = await params;
  const client = await getClientById(id);

  if (!client) {
    notFound();
  }

  const primaryProject = client.projects[0];
  const tasks = primaryProject ? await getClientTasks(primaryProject.id) : [];
  const invoices = primaryProject ? await getClientInvoices(primaryProject.id) : [];

  return (
    <div className="min-h-screen p-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        asChild
        className="mb-6 text-violet-400 hover:bg-violet-600/10 hover:text-violet-200"
      >
        <Link href="/admin/clients">
          <ArrowLeft className="mr-2 size-4" />
          Back to Clients
        </Link>
      </Button>

      {/* Client Header */}
      <div className="mb-8 rounded-xl border border-violet-900/30 bg-gradient-to-br from-slate-900 to-slate-900/50 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-xl bg-violet-600/20">
              <Building2 className="size-8 text-violet-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-violet-100">
                {client.company_name ?? "Unnamed Company"}
              </h1>
              <div className="mt-1 flex items-center gap-4 text-sm text-violet-400/70">
                <span className="flex items-center gap-1">
                  <Mail className="size-4" />
                  {client.email}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="size-4" />
                  Joined {new Date(client.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          {primaryProject && (
            <Badge
              variant="outline"
              className={cn("text-sm", statusColors[primaryProject.status])}
            >
              {primaryProject.status}
            </Badge>
          )}
        </div>

        {/* Quick Stats */}
        {primaryProject && (
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <div className="rounded-lg bg-slate-800/50 p-4">
              <p className="text-sm text-violet-400/70">Project</p>
              <p className="font-medium text-violet-100">{primaryProject.name}</p>
            </div>
            <div className="rounded-lg bg-slate-800/50 p-4">
              <p className="text-sm text-violet-400/70">Contract Value</p>
              <p className="font-medium text-violet-100 flex items-center gap-1">
                <DollarSign className="size-4" />
                {primaryProject.monthly_contract_value?.toLocaleString() ?? "0"}/mo
              </p>
            </div>
            <div className="rounded-lg bg-slate-800/50 p-4">
              <p className="text-sm text-violet-400/70">Total Invoiced</p>
              <p className="font-medium text-violet-100">
                ${client.total_invoiced?.toLocaleString() ?? "0"}
              </p>
            </div>
            <div className="rounded-lg bg-slate-800/50 p-4">
              <p className="text-sm text-violet-400/70">Active Tasks</p>
              <p className="font-medium text-violet-100">
                {tasks.filter((t) => t.status !== "done").length}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      {primaryProject ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            <PhaseSelector
              projectId={primaryProject.id}
              currentStatus={primaryProject.status}
            />
            <MetricsInjector
              projectId={primaryProject.id}
              currentMetrics={client.latest_metrics}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <TaskAssigner projectId={primaryProject.id} tasks={tasks} />

            {/* Recent Invoices */}
            <div className="rounded-xl border border-violet-900/30 bg-gradient-to-br from-slate-900 to-slate-900/50 p-6">
              <h3 className="text-lg font-semibold text-violet-100 mb-4">
                Recent Invoices
              </h3>
              {invoices.length === 0 ? (
                <p className="text-sm text-violet-400/60">No invoices yet</p>
              ) : (
                <div className="space-y-3">
                  {invoices.slice(0, 5).map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between rounded-lg bg-slate-800/30 p-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-violet-200">
                          {invoice.description ?? "Invoice"}
                        </p>
                        <p className="text-xs text-violet-400/60">
                          Due: {new Date(invoice.due_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-violet-100">
                          ${Number(invoice.amount).toLocaleString()}
                        </p>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            invoice.status === "paid"
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                              : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                          )}
                        >
                          {invoice.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-violet-900/30 bg-gradient-to-br from-slate-900 to-slate-900/50 p-12 text-center">
          <p className="text-violet-400/70">
            No project found for this client. Create one to get started.
          </p>
        </div>
      )}
    </div>
  );
}

