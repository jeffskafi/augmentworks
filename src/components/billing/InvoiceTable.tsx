"use client";

import { ExternalLink, Download, AlertCircle } from "lucide-react";
import { cn, formatCurrency, formatDate } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import type { Invoice, InvoiceStatus } from "~/types/database";

interface InvoiceTableProps {
  invoices: Invoice[];
}

const statusConfig: Record<
  InvoiceStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  paid: { label: "Paid", variant: "secondary" },
  pending: { label: "Pending", variant: "outline" },
  overdue: { label: "Overdue", variant: "destructive" },
  cancelled: { label: "Cancelled", variant: "secondary" },
};

export function InvoiceTable({ invoices }: InvoiceTableProps) {
  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
        <AlertCircle className="size-10 text-muted-foreground" />
        <p className="mt-4 text-sm text-muted-foreground">No invoices found</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => {
            const config = statusConfig[invoice.status];
            const isOverdue =
              invoice.status === "pending" &&
              new Date(invoice.due_date) < new Date();

            return (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">
                  {invoice.description ?? "Invoice"}
                </TableCell>
                <TableCell className="font-semibold">
                  {formatCurrency(invoice.amount, invoice.currency)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={isOverdue ? "destructive" : config.variant}
                    className="font-normal"
                  >
                    {isOverdue ? "Overdue" : config.label}
                  </Badge>
                </TableCell>
                <TableCell
                  className={cn(
                    isOverdue && "text-destructive font-medium"
                  )}
                >
                  {formatDate(invoice.due_date)}
                  {invoice.paid_at && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      (Paid {formatDate(invoice.paid_at)})
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {invoice.stripe_invoice_url && (
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="h-8 gap-1.5"
                      >
                        <a
                          href={invoice.stripe_invoice_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {invoice.status === "pending" ? (
                            <>
                              Pay Now
                              <ExternalLink className="size-3" />
                            </>
                          ) : (
                            <>
                              View
                              <ExternalLink className="size-3" />
                            </>
                          )}
                        </a>
                      </Button>
                    )}
                    <Button variant="ghost" size="icon-sm" className="h-8 w-8">
                      <Download className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

