"use client";

import { useState, useTransition } from "react";
import { Check, ExternalLink, Loader2 } from "lucide-react";
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
import { markInvoicePaid } from "~/actions/admin";
import type { AdminInvoiceWithClient } from "~/types/database";
import { cn } from "~/lib/utils";

interface BillingTableProps {
  invoices: AdminInvoiceWithClient[];
}

const statusColors = {
  pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  paid: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  overdue: "bg-red-500/20 text-red-400 border-red-500/30",
  cancelled: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

export function BillingTable({ invoices }: BillingTableProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleMarkPaid = (invoiceId: string) => {
    setLoadingId(invoiceId);
    startTransition(async () => {
      await markInvoicePaid(invoiceId);
      setLoadingId(null);
    });
  };

  return (
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
          {invoices.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-24 text-center text-violet-400/60"
              >
                No invoices found.
              </TableCell>
            </TableRow>
          ) : (
            invoices.map((invoice) => {
              const isLoading = loadingId === invoice.id && isPending;

              return (
                <TableRow
                  key={invoice.id}
                  className="border-violet-900/30 hover:bg-violet-900/10"
                >
                  <TableCell className="font-medium text-violet-100">
                    {invoice.description ?? "Invoice"}
                  </TableCell>
                  <TableCell className="text-violet-300/70">
                    {invoice.project?.user?.company_name ?? "Unknown"}
                  </TableCell>
                  <TableCell className="text-violet-100">
                    ${Number(invoice.amount).toLocaleString()}
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
                      {invoice.stripe_invoice_url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="text-violet-400 hover:bg-violet-600/10 hover:text-violet-200"
                        >
                          <a
                            href={invoice.stripe_invoice_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="size-4" />
                          </a>
                        </Button>
                      )}
                      {(invoice.status === "pending" ||
                        invoice.status === "overdue") && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkPaid(invoice.id)}
                          disabled={isLoading}
                          className="gap-1 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
                        >
                          {isLoading ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Check className="size-4" />
                          )}
                          Mark Paid
                        </Button>
                      )}
                    </div>
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

