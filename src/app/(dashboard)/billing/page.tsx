import { redirect } from "next/navigation";
import {
  CreditCard,
  DollarSign,
  Clock,
  TrendingUp,
} from "lucide-react";

import { Header } from "~/components/dashboard/Header";
import { InvoiceTable } from "~/components/billing/InvoiceTable";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

import { getCurrentUser, getActiveProject } from "~/actions/get-projects";
import { getProjectInvoices, getInvoiceSummary } from "~/actions/get-invoices";
import { formatCurrency } from "~/lib/utils";

export default async function BillingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const project = await getActiveProject();
  if (!project) redirect("/dashboard");

  const [invoices, summary] = await Promise.all([
    getProjectInvoices(project.id),
    getInvoiceSummary(project.id),
  ]);

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

