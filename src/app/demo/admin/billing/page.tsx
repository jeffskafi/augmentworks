import { Check, ExternalLink } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

// Mock invoices data
const mockInvoices = [
  {
    id: "1",
    description: "December Monitoring Services",
    client: "Acme Corp",
    amount: 2500,
    status: "pending" as const,
    due_date: "2024-12-31",
    stripe_url: "https://invoice.stripe.com/demo",
  },
  {
    id: "2",
    description: "Q4 Audit Package",
    client: "TechStart Inc",
    amount: 3500,
    status: "pending" as const,
    due_date: "2025-01-15",
    stripe_url: "https://invoice.stripe.com/demo",
  },
  {
    id: "3",
    description: "Enterprise Monitoring",
    client: "DataFlow Systems",
    amount: 5000,
    status: "pending" as const,
    due_date: "2024-12-28",
    stripe_url: "https://invoice.stripe.com/demo",
  },
  {
    id: "4",
    description: "Setup & Integration",
    client: "CloudNine AI",
    amount: 1500,
    status: "paid" as const,
    due_date: "2024-12-15",
    paid_at: "2024-12-14",
    stripe_url: null,
  },
  {
    id: "5",
    description: "November Monitoring",
    client: "Acme Corp",
    amount: 2500,
    status: "paid" as const,
    due_date: "2024-11-30",
    paid_at: "2024-11-29",
    stripe_url: null,
  },
  {
    id: "6",
    description: "October Monitoring",
    client: "Acme Corp",
    amount: 2500,
    status: "paid" as const,
    due_date: "2024-10-31",
    paid_at: "2024-10-30",
    stripe_url: null,
  },
];

const statusColors = {
  pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  paid: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  overdue: "bg-red-500/20 text-red-400 border-red-500/30",
  cancelled: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

export default function DemoAdminBillingPage() {
  const totalPending = mockInvoices
    .filter((i) => i.status === "pending")
    .reduce((sum, i) => sum + i.amount, 0);

  const totalPaid = mockInvoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="min-h-screen p-8">
      {/* Demo Banner */}
      <div className="mb-6 flex items-center gap-2 rounded-lg bg-violet-600/20 px-4 py-2 text-sm text-violet-300">
        <span className="size-2 rounded-full bg-violet-400" />
        Admin Demo Mode – This is a preview with mock data
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-violet-100">Billing Overview</h1>
        <p className="text-violet-400/70">
          Manage invoices across all clients
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-violet-900/30 bg-slate-900/50 p-4">
          <p className="text-sm text-violet-400/70">Total Invoices</p>
          <p className="text-2xl font-bold text-violet-100">{mockInvoices.length}</p>
        </div>
        <div className="rounded-lg border border-violet-900/30 bg-slate-900/50 p-4">
          <p className="text-sm text-violet-400/70">Pending Amount</p>
          <p className="text-2xl font-bold text-amber-400">
            ${totalPending.toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg border border-violet-900/30 bg-slate-900/50 p-4">
          <p className="text-sm text-violet-400/70">Total Collected</p>
          <p className="text-2xl font-bold text-emerald-400">
            ${totalPaid.toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg border border-violet-900/30 bg-slate-900/50 p-4">
          <p className="text-sm text-violet-400/70">Overdue</p>
          <p className="text-2xl font-bold text-red-400">0</p>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-xl border border-violet-900/30 bg-gradient-to-br from-slate-900 to-slate-900/50">
        <Table>
          <TableHeader>
            <TableRow className="border-violet-900/30 hover:bg-transparent">
              <TableHead className="text-violet-300">Description</TableHead>
              <TableHead className="text-violet-300">Client</TableHead>
              <TableHead className="text-violet-300">Amount</TableHead>
              <TableHead className="text-violet-300">Status</TableHead>
              <TableHead className="text-violet-300">Due Date</TableHead>
              <TableHead className="text-violet-300 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockInvoices.map((invoice) => (
              <TableRow
                key={invoice.id}
                className="border-violet-900/30 hover:bg-violet-900/10"
              >
                <TableCell className="font-medium text-violet-100">
                  {invoice.description}
                </TableCell>
                <TableCell className="text-violet-300/70">
                  {invoice.client}
                </TableCell>
                <TableCell className="text-violet-100">
                  ${invoice.amount.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn("capitalize", statusColors[invoice.status])}
                  >
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-violet-300/70">
                  {new Date(invoice.due_date).toLocaleDateString()}
                  {invoice.paid_at && (
                    <span className="block text-xs text-emerald-400/70">
                      Paid: {new Date(invoice.paid_at).toLocaleDateString()}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {invoice.stripe_url && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-violet-400 hover:bg-violet-600/10 hover:text-violet-200"
                      >
                        <ExternalLink className="size-4" />
                      </Button>
                    )}
                    {invoice.status === "pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
                      >
                        <Check className="size-4" />
                        Mark Paid
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

