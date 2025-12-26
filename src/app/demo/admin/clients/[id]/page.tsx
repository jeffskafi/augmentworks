import Link from "next/link";
import { ArrowLeft, Building2, Mail, Calendar, DollarSign, Zap, Circle, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";

// Mock client data
const mockClient = {
  id: "1",
  company_name: "Acme Corp",
  email: "contact@acmecorp.com",
  created_at: "2024-07-01T00:00:00Z",
  project: {
    id: "p1",
    name: "Acme AI Assistant",
    status: "monitoring" as const,
    monthly_contract_value: 2500,
  },
  metrics: {
    safety_score: 94,
    hallucinations_count: 12,
    jailbreak_attempts: 3,
    requests_processed: 145230,
  },
  tasks: [
    { id: "t1", title: "Implement Jailbreak Detection v2", status: "in_progress" as const, due_date: "2024-12-30" },
    { id: "t2", title: "RAG Accuracy Improvement", status: "in_progress" as const, due_date: "2025-01-15" },
    { id: "t3", title: "Q4 Performance Report", status: "todo" as const, due_date: "2025-01-05" },
    { id: "t4", title: "Initial Security Audit", status: "done" as const, due_date: "2024-07-15" },
  ],
  invoices: [
    { id: "i1", description: "December Monitoring", amount: 2500, status: "pending" as const, due_date: "2024-12-31" },
    { id: "i2", description: "November Monitoring", amount: 2500, status: "paid" as const, due_date: "2024-11-30" },
  ],
  total_invoiced: 15000,
};

const statusColors = {
  onboarding: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  audit: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  monitoring: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  completed: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

const taskStatusIcons = {
  todo: Circle,
  in_progress: Clock,
  done: CheckCircle2,
};

const taskStatusColors = {
  todo: "text-slate-400",
  in_progress: "text-amber-400",
  done: "text-emerald-400",
};

export default function DemoClientDetailPage() {
  return (
    <div className="min-h-screen p-8">
      {/* Demo Banner */}
      <div className="mb-6 flex items-center gap-2 rounded-lg bg-violet-600/20 px-4 py-2 text-sm text-violet-300">
        <span className="size-2 rounded-full bg-violet-400" />
        Admin Demo Mode – This is a preview with mock data
      </div>

      {/* Back Button */}
      <Button
        variant="ghost"
        asChild
        className="mb-6 text-violet-400 hover:bg-violet-600/10 hover:text-violet-200"
      >
        <Link href="/demo/admin/clients">
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
                {mockClient.company_name}
              </h1>
              <div className="mt-1 flex items-center gap-4 text-sm text-violet-400/70">
                <span className="flex items-center gap-1">
                  <Mail className="size-4" />
                  {mockClient.email}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="size-4" />
                  Joined {new Date(mockClient.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <Badge
            variant="outline"
            className={cn("text-sm", statusColors[mockClient.project.status])}
          >
            {mockClient.project.status}
          </Badge>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-lg bg-slate-800/50 p-4">
            <p className="text-sm text-violet-400/70">Project</p>
            <p className="font-medium text-violet-100">{mockClient.project.name}</p>
          </div>
          <div className="rounded-lg bg-slate-800/50 p-4">
            <p className="text-sm text-violet-400/70">Contract Value</p>
            <p className="font-medium text-violet-100 flex items-center gap-1">
              <DollarSign className="size-4" />
              {mockClient.project.monthly_contract_value.toLocaleString()}/mo
            </p>
          </div>
          <div className="rounded-lg bg-slate-800/50 p-4">
            <p className="text-sm text-violet-400/70">Total Invoiced</p>
            <p className="font-medium text-violet-100">
              ${mockClient.total_invoiced.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg bg-slate-800/50 p-4">
            <p className="text-sm text-violet-400/70">Active Tasks</p>
            <p className="font-medium text-violet-100">
              {mockClient.tasks.filter((t) => t.status !== "done").length}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Phase Selector */}
          <div className="rounded-xl border border-violet-900/30 bg-gradient-to-br from-slate-900 to-slate-900/50 p-6">
            <h3 className="text-lg font-semibold text-violet-100 mb-4">
              Project Phase
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-violet-200">Current Phase</Label>
                <Select defaultValue={mockClient.project.status}>
                  <SelectTrigger className="border-violet-900/50 bg-slate-800 text-violet-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-violet-900/50 bg-slate-900">
                    <SelectItem value="onboarding" className="text-amber-400">Onboarding</SelectItem>
                    <SelectItem value="audit" className="text-blue-400">Audit</SelectItem>
                    <SelectItem value="monitoring" className="text-emerald-400">Active Monitoring</SelectItem>
                    <SelectItem value="completed" className="text-slate-400">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Visual timeline */}
              <div className="flex items-center gap-2 pt-4">
                <div className="size-3 rounded-full bg-violet-600/50" />
                <div className="h-0.5 flex-1 bg-violet-600/50" />
                <div className="size-3 rounded-full bg-violet-600/50" />
                <div className="h-0.5 flex-1 bg-violet-600/50" />
                <div className="size-3 rounded-full bg-violet-500 ring-2 ring-violet-500/30" />
                <div className="h-0.5 flex-1 bg-slate-700" />
                <div className="size-3 rounded-full bg-slate-700" />
              </div>
              <div className="flex justify-between text-xs text-violet-400/50">
                <span>Onboarding</span>
                <span>Audit</span>
                <span>Monitoring</span>
                <span>Complete</span>
              </div>
            </div>
          </div>

          {/* Metrics Injector */}
          <div className="rounded-xl border border-violet-900/30 bg-gradient-to-br from-slate-900 to-slate-900/50 p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="rounded-lg bg-violet-600/20 p-2">
                <Zap className="size-5 text-violet-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-violet-100">
                  Metrics Injector
                </h3>
                <p className="text-sm text-violet-400/70">
                  Wizard of Oz mode - Update what the client sees
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-violet-200">Safety Score (0-100)</Label>
                <Input
                  type="number"
                  defaultValue={mockClient.metrics.safety_score}
                  className="border-violet-900/50 bg-slate-800 text-violet-100"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-violet-200">Hallucinations Count</Label>
                <Input
                  type="number"
                  defaultValue={mockClient.metrics.hallucinations_count}
                  className="border-violet-900/50 bg-slate-800 text-violet-100"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-violet-200">Jailbreak Attempts Blocked</Label>
                <Input
                  type="number"
                  defaultValue={mockClient.metrics.jailbreak_attempts}
                  className="border-violet-900/50 bg-slate-800 text-violet-100"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-violet-200">Requests Processed</Label>
                <Input
                  type="number"
                  defaultValue={mockClient.metrics.requests_processed}
                  className="border-violet-900/50 bg-slate-800 text-violet-100"
                />
              </div>
            </div>

            <Button className="w-full mt-4 bg-violet-600 text-white hover:bg-violet-700">
              <Zap className="mr-2 size-4" />
              Inject Metrics
            </Button>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Tasks */}
          <div className="rounded-xl border border-violet-900/30 bg-gradient-to-br from-slate-900 to-slate-900/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-violet-100">Tasks</h3>
              <Button
                size="sm"
                className="gap-1 bg-violet-600 text-white hover:bg-violet-700"
              >
                Add Task
              </Button>
            </div>
            <div className="space-y-2">
              {mockClient.tasks.map((task) => {
                const Icon = taskStatusIcons[task.status];
                return (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 rounded-lg bg-slate-800/30 p-3"
                  >
                    <Icon
                      className={cn("size-5 mt-0.5 shrink-0", taskStatusColors[task.status])}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          task.status === "done"
                            ? "text-violet-400/60 line-through"
                            : "text-violet-200"
                        )}
                      >
                        {task.title}
                      </p>
                      <p className="text-xs text-violet-400/50 mt-1">
                        Due: {new Date(task.due_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Invoices */}
          <div className="rounded-xl border border-violet-900/30 bg-gradient-to-br from-slate-900 to-slate-900/50 p-6">
            <h3 className="text-lg font-semibold text-violet-100 mb-4">
              Recent Invoices
            </h3>
            <div className="space-y-3">
              {mockClient.invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between rounded-lg bg-slate-800/30 p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-violet-200">
                      {invoice.description}
                    </p>
                    <p className="text-xs text-violet-400/60">
                      Due: {new Date(invoice.due_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-violet-100">
                      ${invoice.amount.toLocaleString()}
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
          </div>
        </div>
      </div>
    </div>
  );
}

