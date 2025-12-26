import { ClientsTable } from "~/components/admin/ClientsTable";
import { AddClientDialog } from "~/components/admin/AddClientDialog";
import { getAllClients } from "~/actions/admin";

export default async function AdminClientsPage() {
  const clients = await getAllClients();

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-violet-100">Clients</h1>
          <p className="text-violet-400/70">
            Manage all client accounts and projects
          </p>
        </div>
        <AddClientDialog />
      </div>

      {/* Client Stats */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-violet-900/30 bg-slate-900/50 p-4">
          <p className="text-sm text-violet-400/70">Total Clients</p>
          <p className="text-2xl font-bold text-violet-100">{clients.length}</p>
        </div>
        <div className="rounded-lg border border-violet-900/30 bg-slate-900/50 p-4">
          <p className="text-sm text-violet-400/70">Onboarding</p>
          <p className="text-2xl font-bold text-amber-400">
            {clients.filter((c) => c.projects[0]?.status === "onboarding").length}
          </p>
        </div>
        <div className="rounded-lg border border-violet-900/30 bg-slate-900/50 p-4">
          <p className="text-sm text-violet-400/70">In Audit</p>
          <p className="text-2xl font-bold text-blue-400">
            {clients.filter((c) => c.projects[0]?.status === "audit").length}
          </p>
        </div>
        <div className="rounded-lg border border-violet-900/30 bg-slate-900/50 p-4">
          <p className="text-sm text-violet-400/70">Active Monitoring</p>
          <p className="text-2xl font-bold text-emerald-400">
            {clients.filter((c) => c.projects[0]?.status === "monitoring").length}
          </p>
        </div>
      </div>

      {/* Clients Table */}
      <ClientsTable clients={clients} />
    </div>
  );
}

