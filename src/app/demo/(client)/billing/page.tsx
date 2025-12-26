import {
  CreditCard,
  DollarSign,
  Clock,
  TrendingUp,
  ExternalLink,
  Download,
  AlertCircle,
} from "lucide-react";

import { Header } from "~/components/dashboard/Header";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { cn, formatCurrency, formatDate } from "~/lib/utils";
import { mockInvoices } from "~/lib/mock-data";
import type { Invoice, InvoiceStatus } from "~/types/database";

const statusConfig: Record<
  InvoiceStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  paid: { label: "Paid", variant: "secondary" },
  pending: { label: "Pending", variant: "outline" },
  overdue: { label: "Overdue", variant: "destructive" },
  cancelled: { label: "Cancelled", variant: "secondary" },
};

function InvoiceTable({ invoices }: { invoices: Invoice[] }) {
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
                  className={cn(isOverdue && "text-destructive font-medium")}
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

export default function DemoBillingPage() {
  const invoices = mockInvoices;

  // Calculate summary
  const summary = invoices.reduce(
    (acc, invoice) => {
      if (invoice.status === "paid") {
        acc.totalPaid += invoice.amount;
      } else if (invoice.status === "pending" || invoice.status === "overdue") {
        acc.totalPending += invoice.amount;
      }
      return acc;
    },
    { totalPaid: 0, totalPending: 0, invoiceCount: invoices.length }
  );

  // Group invoices by status
  const groupedInvoices = {
    all: invoices,
    pending: invoices.filter(
      (i) => i.status === "pending" || i.status === "overdue"
    ),
    paid: invoices.filter((i) => i.status === "paid"),
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Billing"
        description="Manage invoices and payment history"
      />

      <div className="space-y-6 p-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex size-12 items-center justify-center rounded-xl bg-success/10">
                <DollarSign className="size-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {formatCurrency(summary.totalPaid)}
                </p>
                <p className="text-sm text-muted-foreground">Total Paid</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex size-12 items-center justify-center rounded-xl bg-warning/10">
                <Clock className="size-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {formatCurrency(summary.totalPending)}
                </p>
                <p className="text-sm text-muted-foreground">Outstanding</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                <CreditCard className="size-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{summary.invoiceCount}</p>
                <p className="text-sm text-muted-foreground">Total Invoices</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
                <TrendingUp className="size-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {formatCurrency(summary.totalPaid + summary.totalPending)}
                </p>
                <p className="text-sm text-muted-foreground">Lifetime Value</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Invoice Table with Tabs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="size-5" />
              Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all" className="gap-2">
                  All
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                    {groupedInvoices.all.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="pending" className="gap-2">
                  Pending
                  <span className="rounded-full bg-warning/20 text-warning px-2 py-0.5 text-xs">
                    {groupedInvoices.pending.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="paid" className="gap-2">
                  Paid
                  <span className="rounded-full bg-success/20 text-success px-2 py-0.5 text-xs">
                    {groupedInvoices.paid.length}
                  </span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <InvoiceTable invoices={groupedInvoices.all} />
              </TabsContent>
              <TabsContent value="pending">
                <InvoiceTable invoices={groupedInvoices.pending} />
              </TabsContent>
              <TabsContent value="paid">
                <InvoiceTable invoices={groupedInvoices.paid} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Payment Help */}
        <Card className="border-dashed">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Questions about billing?{" "}
              <a
                href="mailto:billing@agentready.com"
                className="font-medium text-primary hover:underline"
              >
                Contact our billing team
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

