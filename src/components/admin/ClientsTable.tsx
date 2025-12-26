"use client";

import Link from "next/link";
import { Settings, MoreHorizontal } from "lucide-react";
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
import type { ClientWithProject } from "~/types/database";
import { cn } from "~/lib/utils";

interface ClientsTableProps {
  clients: ClientWithProject[];
}

const statusColors = {
  onboarding: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  audit: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  monitoring: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  completed: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

export function ClientsTable({ clients }: ClientsTableProps) {
  return (
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
          {clients.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-24 text-center text-violet-400/60"
              >
                No clients yet. Add your first client to get started.
              </TableCell>
            </TableRow>
          ) : (
            clients.map((client) => {
              const primaryProject = client.projects[0];
              const status = primaryProject?.status ?? "onboarding";

              return (
                <TableRow
                  key={client.id}
                  className="border-violet-900/30 hover:bg-violet-900/10"
                >
                  <TableCell className="font-medium text-violet-100">
                    {client.company_name ?? "Unnamed Company"}
                  </TableCell>
                  <TableCell className="text-violet-300/70">
                    {client.email}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn("capitalize", statusColors[status])}
                    >
                      {status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-violet-300/70">
                    ${primaryProject?.monthly_contract_value?.toLocaleString() ?? "0"}
                    <span className="text-violet-400/50">/mo</span>
                  </TableCell>
                  <TableCell className="text-violet-300/70">
                    {formatDate(client.updated_at)}
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
                            href={`/admin/clients/${client.id}`}
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
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

