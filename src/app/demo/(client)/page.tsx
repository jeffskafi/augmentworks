import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

import { Header } from "~/components/dashboard/Header";
import { MetricsGrid } from "~/components/dashboard/MetricsGrid";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";

import {
  mockUser,
  mockProject,
  mockMetricsWithTrend,
  mockTasks,
  mockInvoices,
} from "~/lib/mock-data";
import { cn, formatCurrency, formatDate, formatRelativeDate } from "~/lib/utils";
import type { Task, Invoice, ProjectStatus } from "~/types/database";

const statusConfig: Record<
  ProjectStatus,
  { label: string; color: string; progress: number }
> = {
  onboarding: {
    label: "Onboarding",
    color: "bg-warning text-warning-foreground",
    progress: 25,
  },
  audit: {
    label: "Security Audit",
    color: "bg-primary text-primary-foreground",
    progress: 50,
  },
  monitoring: {
    label: "Active Monitoring",
    color: "bg-success text-success-foreground",
    progress: 75,
  },
  completed: {
    label: "Completed",
    color: "bg-muted text-muted-foreground",
    progress: 100,
  },
};

function TaskItem({ task }: { task: Task }) {
  const isOverdue = task.due_date && new Date(task.due_date) < new Date();
  const statusIcons = {
    todo: Clock,
    in_progress: AlertCircle,
    done: CheckCircle2,
  };
  const Icon = statusIcons[task.status];

  return (
    <div className="group flex items-center gap-4 rounded-lg border border-border bg-card/50 p-4 transition-all hover:bg-card">
      <div
        className={cn(
          "flex size-8 items-center justify-center rounded-full",
          task.status === "done"
            ? "bg-success/10 text-success"
            : task.status === "in_progress"
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground"
        )}
      >
        <Icon className="size-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "truncate font-medium",
            task.status === "done" && "text-muted-foreground line-through"
          )}
        >
          {task.title}
        </p>
        {task.due_date && (
          <p
            className={cn(
              "text-xs",
              isOverdue && task.status !== "done"
                ? "text-destructive"
                : "text-muted-foreground"
            )}
          >
            Due {formatRelativeDate(task.due_date)}
          </p>
        )}
      </div>
      <Badge
        variant={
          task.status === "done"
            ? "secondary"
            : task.status === "in_progress"
              ? "default"
              : "outline"
        }
        className="shrink-0"
      >
        {task.status === "in_progress" ? "In Progress" : task.status}
      </Badge>
    </div>
  );
}

function InvoiceItem({ invoice }: { invoice: Invoice }) {
  const isOverdue =
    invoice.status === "pending" && new Date(invoice.due_date) < new Date();

  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-card/50 p-4">
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{invoice.description}</p>
        <p className="text-sm text-muted-foreground">
          Due {formatDate(invoice.due_date)}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-lg font-semibold">
          {formatCurrency(invoice.amount)}
        </span>
        <Badge variant={isOverdue ? "destructive" : "outline"}>
          {isOverdue ? "Overdue" : invoice.status}
        </Badge>
      </div>
    </div>
  );
}

export default function DemoDashboardPage() {
  const user = mockUser;
  const project = mockProject;
  const metrics = mockMetricsWithTrend;
  const tasks = mockTasks.filter((t) => t.status !== "done").slice(0, 5);
  const invoices = mockInvoices.filter(
    (i) => i.status === "pending" || i.status === "overdue"
  );

  const status = statusConfig[project.status];

  return (
    <div className="min-h-screen">
      <Header
        title={`Welcome back, ${user.company_name ?? "there"}!`}
        description="Here's an overview of your AI system's performance"
      />

      <div className="space-y-8 p-6">
        {/* Project Status Banner */}
        <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-r from-primary/5 via-transparent to-transparent">
          <CardContent className="flex items-center justify-between p-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold">{project.name}</h2>
                <Badge className={status.color}>{status.label}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {project.description ?? "Your AI monitoring project"}
              </p>
              <div className="flex items-center gap-4 pt-2">
                <div className="flex-1 max-w-xs">
                  <Progress value={status.progress} className="h-2" />
                </div>
                <span className="text-sm text-muted-foreground">
                  {status.progress}% complete
                </span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Project Started</p>
                <p className="font-medium">{formatDate(project.created_at)}</p>
              </div>
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                <Calendar className="size-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metrics Grid */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Performance Metrics</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="size-4" />
              <span>{formatDate(metrics.report_month)}</span>
            </div>
          </div>
          <MetricsGrid metrics={metrics} />
        </section>

        {/* Two Column Layout */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Tasks */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-base font-semibold">
                Upcoming Tasks
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/demo/projects" className="gap-1">
                  View all
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasks.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">
                  No pending tasks
                </p>
              ) : (
                tasks.map((task) => <TaskItem key={task.id} task={task} />)
              )}
            </CardContent>
          </Card>

          {/* Pending Invoices */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-base font-semibold">
                Pending Invoices
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/demo/billing" className="gap-1">
                  View all
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {invoices.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">
                  No pending invoices
                </p>
              ) : (
                invoices.map((invoice) => (
                  <InvoiceItem key={invoice.id} invoice={invoice} />
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

