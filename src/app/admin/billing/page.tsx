import { getAllInvoices } from "~/actions/admin";
import { BillingTable } from "~/components/admin/BillingTable";

export default async function AdminBillingPage() {
  const invoices = await getAllInvoices();

  // Calculate totals
  const totalPending = invoices
    .filter((i) => i.status === "pending" || i.status === "overdue")
    .reduce((sum, i) => sum + Number(i.amount), 0);

  const totalPaid = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + Number(i.amount), 0);

  const overdueCount = invoices.filter((i) => i.status === "overdue").length;

  return (
    <div className="min-h-screen p-8">
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
          <p className="text-2xl font-bold text-violet-100">{invoices.length}</p>
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
          <p className="text-2xl font-bold text-red-400">{overdueCount}</p>
        </div>
      </div>

      {/* Invoices Table */}
      <BillingTable invoices={invoices} />
    </div>
  );
}

