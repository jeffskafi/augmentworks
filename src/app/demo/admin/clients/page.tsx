import Link from "next/link";
import { Settings, MoreHorizontal, Plus } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";

// Mock clients data
const mockClients = [
  {
    id: "1",
    company_name: "Acme Corp",
    email: "contact@acmecorp.com",
    status: "monitoring" as const,
    contract_value: 2500,
    updated_at: "2024-12-20T10:00:00Z",
  },
  {
    id: "2",
    company_name: "TechStart Inc",
    email: "hello@techstart.io",
    status: "audit" as const,
    contract_value: 3500,
    updated_at: "2024-12-18T14:30:00Z",
  },
  {
    id: "3",
    company_name: "DataFlow Systems",
    email: "admin@dataflow.com",
    status: "monitoring" as const,
    contract_value: 5000,
    updated_at: "2024-12-19T09:15:00Z",
  },
  {
    id: "4",
    company_name: "CloudNine AI",
    email: "team@cloudnine.ai",
    status: "onboarding" as const,
    contract_value: 2000,
    updated_at: "2024-12-21T16:45:00Z",
  },
];

const statusColors = {
  onboarding: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  audit: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  monitoring: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  completed: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

export default function DemoAdminClientsPage() {
  return (
    <div className="min-h-screen p-8">
      {/* Demo Banner */}
      <div className="mb-6 flex items-center gap-2 rounded-lg bg-violet-600/20 px-4 py-2 text-sm text-violet-300">
        <span className="size-2 rounded-full bg-violet-400" />
        Admin Demo Mode – This is a preview with mock data
      </div>

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-violet-100">Clients</h1>
          <p className="text-violet-400/70">
            Manage all client accounts and projects
          </p>
        </div>
        <Button className="gap-2 bg-violet-600 text-white hover:bg-violet-700">
          <Plus className="size-4" />
          Add Client
        </Button>
      </div>

      {/* Client Stats */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-violet-900/30 bg-slate-900/50 p-4">
          <p className="text-sm text-violet-400/70">Total Clients</p>
          <p className="text-2xl font-bold text-violet-100">{mockClients.length}</p>
        </div>
        <div className="rounded-lg border border-violet-900/30 bg-slate-900/50 p-4">
          <p className="text-sm text-violet-400/70">Onboarding</p>
          <p className="text-2xl font-bold text-amber-400">
            {mockClients.filter((c) => c.status === "onboarding").length}
          </p>
        </div>
        <div className="rounded-lg border border-violet-900/30 bg-slate-900/50 p-4">
          <p className="text-sm text-violet-400/70">In Audit</p>
          <p className="text-2xl font-bold text-blue-400">
            {mockClients.filter((c) => c.status === "audit").length}
          </p>
        </div>
        <div className="rounded-lg border border-violet-900/30 bg-slate-900/50 p-4">
          <p className="text-sm text-violet-400/70">Active Monitoring</p>
          <p className="text-2xl font-bold text-emerald-400">
            {mockClients.filter((c) => c.status === "monitoring").length}
          </p>
        </div>
      </div>

      {/* Clients Table */}
      <div className="rounded-xl border border-violet-900/30 bg-gradient-to-br from-slate-900 to-slate-900/50">
        <Table>
          <TableHeader>
            <TableRow className="border-violet-900/30 hover:bg-transparent">
              <TableHead className="text-violet-300">Company</TableHead>
              <TableHead className="text-violet-300">Contact</TableHead>
              <TableHead className="text-violet-300">Status</TableHead>
              <TableHead className="text-violet-300">Contract Value</TableHead>
              <TableHead className="text-violet-300">Last Active</TableHead>
              <TableHead className="text-violet-300 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockClients.map((client) => (
              <TableRow
                key={client.id}
                className="border-violet-900/30 hover:bg-violet-900/10"
              >
                <TableCell className="font-medium text-violet-100">
                  {client.company_name}
                </TableCell>
                <TableCell className="text-violet-300/70">
                  {client.email}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn("capitalize", statusColors[client.status])}
                  >
                    {client.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-violet-300/70">
                  ${client.contract_value.toLocaleString()}
                  <span className="text-violet-400/50">/mo</span>
                </TableCell>
                <TableCell className="text-violet-300/70">
                  {new Date(client.updated_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-violet-400 hover:bg-violet-600/10 hover:text-violet-200"
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="border-violet-900/50 bg-slate-900"
                    >
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/demo/admin/clients/${client.id}`}
                          className="flex items-center gap-2 text-violet-200"
                        >
                          <Settings className="size-4" />
                          Manage Client
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

