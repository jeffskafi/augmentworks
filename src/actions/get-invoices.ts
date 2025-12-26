"use server";

import { createClient } from "~/utils/supabase/server";
import type { Invoice, InvoiceStatus } from "~/types/database";

export async function getProjectInvoices(projectId: string): Promise<Invoice[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("project_id", projectId)
    .order("due_date", { ascending: false });

  if (error) {
    console.error("Error fetching invoices:", error);
    return [];
  }

  return (data as Invoice[] | null) ?? [];
}

export async function getInvoicesByStatus(
  projectId: string,
  status: InvoiceStatus
): Promise<Invoice[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("project_id", projectId)
    .eq("status", status)
    .order("due_date", { ascending: false });

  if (error) {
    console.error("Error fetching invoices by status:", error);
    return [];
  }

  return (data as Invoice[] | null) ?? [];
}

export async function getPendingInvoices(projectId: string): Promise<Invoice[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("project_id", projectId)
    .in("status", ["pending", "overdue"])
    .order("due_date", { ascending: true });

  if (error) {
    console.error("Error fetching pending invoices:", error);
    return [];
  }

  return (data as Invoice[] | null) ?? [];
}

export async function getInvoiceSummary(projectId: string): Promise<{
  totalPaid: number;
  totalPending: number;
  invoiceCount: number;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("invoices")
    .select("amount, status")
    .eq("project_id", projectId);

  if (error) {
    console.error("Error fetching invoice summary:", error);
    return { totalPaid: 0, totalPending: 0, invoiceCount: 0 };
  }

  const invoices = (data as { amount: number; status: InvoiceStatus }[] | null) ?? [];

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

  return summary;
}
