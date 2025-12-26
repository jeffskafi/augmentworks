"use server";

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */
// Supabase client types require 'any' workarounds due to type inference limitations

import { createClient as createSupabaseClient } from "~/utils/supabase/server";
import { revalidatePath } from "next/cache";
import type {
  User,
  Project,
  Invoice,
  Metrics,
  Task,
  ProjectStatus,
  AdminDashboardStats,
  ClientWithProject,
  AdminInvoiceWithClient,
} from "~/types/database";

// ============================================
// Admin Access Check
// ============================================

async function requireAdmin() {
  const supabase = await createSupabaseClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    throw new Error("Not authenticated");
  }

  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .single();

  const user = userData as User | null;
  if (!user || user.role !== "admin") {
    throw new Error("Unauthorized: Admin access required");
  }

  return { supabase, admin: user };
}

// ============================================
// Dashboard Stats
// ============================================

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const { supabase } = await requireAdmin();

  // Get all projects with their users (for active client count)
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("status", "monitoring");

  const activeClients = (projects as Project[] | null)?.length ?? 0;

  // Calculate MRR from all active projects
  const { data: allProjects } = await supabase
    .from("projects")
    .select("monthly_contract_value")
    .in("status", ["monitoring", "audit"]);

  const projectsList = allProjects as { monthly_contract_value: number }[] | null;
  const totalMrr =
    projectsList?.reduce(
      (sum: number, p) => sum + (Number(p.monthly_contract_value) || 0),
      0
    ) ?? 0;

  // Get hallucinations this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { data: metrics } = await supabase
    .from("metrics")
    .select("hallucinations_count")
    .gte("report_month", startOfMonth.toISOString().split("T")[0]);

  const metricsList = metrics as { hallucinations_count: number }[] | null;
  const totalHallucinations =
    metricsList?.reduce((sum: number, m) => sum + (m.hallucinations_count || 0), 0) ?? 0;

  // Get pending invoices
  const { data: pendingInvoices } = await supabase
    .from("invoices")
    .select("amount")
    .eq("status", "pending");

  const invoicesList = pendingInvoices as { amount: number }[] | null;
  const pendingInvoicesCount = invoicesList?.length ?? 0;
  const pendingInvoicesTotal =
    invoicesList?.reduce((sum: number, i) => sum + Number(i.amount), 0) ?? 0;

  return {
    total_mrr: totalMrr,
    active_clients: activeClients,
    total_hallucinations_this_month: totalHallucinations,
    pending_invoices_count: pendingInvoicesCount,
    pending_invoices_total: pendingInvoicesTotal,
  };
}

// ============================================
// Client Management
// ============================================

export async function getAllClients(): Promise<ClientWithProject[]> {
  const { supabase } = await requireAdmin();

  // Get all client users with their projects
  const { data: users, error } = await supabase
    .from("users")
    .select("*")
    .eq("role", "client")
    .order("created_at", { ascending: false });

  if (error || !users) {
    console.error("Error fetching clients:", error);
    return [];
  }

  const usersList = users as User[];

  // Get projects for each user
  const clientsWithProjects: ClientWithProject[] = await Promise.all(
    usersList.map(async (user) => {
      const { data: projects } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id);

      const projectsList = projects as Project[] | null;

      // Get latest metrics for the first project
      let latestMetrics: Metrics | null = null;
      if (projectsList && projectsList.length > 0) {
        const { data: metrics } = await supabase
          .from("metrics")
          .select("*")
          .eq("project_id", projectsList[0]!.id)
          .order("report_month", { ascending: false })
          .limit(1)
          .single();
        latestMetrics = metrics as Metrics | null;
      }

      // Calculate total invoiced
      const { data: invoices } = await supabase
        .from("invoices")
        .select("amount")
        .in(
          "project_id",
          (projectsList ?? []).map((p) => p.id)
        );

      const invoicesList = invoices as { amount: number }[] | null;
      const totalInvoiced =
        invoicesList?.reduce((sum: number, i) => sum + Number(i.amount), 0) ?? 0;

      return {
        ...user,
        projects: projectsList ?? [],
        latest_metrics: latestMetrics,
        total_invoiced: totalInvoiced,
      } as ClientWithProject;
    })
  );

  return clientsWithProjects;
}

export async function getClientById(
  userId: string
): Promise<ClientWithProject | null> {
  const { supabase } = await requireAdmin();

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !user) {
    return null;
  }

  const userData = user as User;

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId);

  const projectsList = projects as Project[] | null;

  let latestMetrics: Metrics | null = null;
  if (projectsList && projectsList.length > 0) {
    const { data: metrics } = await supabase
      .from("metrics")
      .select("*")
      .eq("project_id", projectsList[0]!.id)
      .order("report_month", { ascending: false })
      .limit(1)
      .single();
    latestMetrics = metrics as Metrics | null;
  }

  const { data: invoices } = await supabase
    .from("invoices")
    .select("amount")
    .in(
      "project_id",
      (projectsList ?? []).map((p) => p.id)
    );

  const invoicesList = invoices as { amount: number }[] | null;
  const totalInvoiced =
    invoicesList?.reduce((sum: number, i) => sum + Number(i.amount), 0) ?? 0;

  return {
    ...userData,
    projects: projectsList ?? [],
    latest_metrics: latestMetrics,
    total_invoiced: totalInvoiced,
  } as ClientWithProject;
}

export type CreateClientState = {
  error?: string;
  success?: string;
};

export async function createClient(
  _prevState: CreateClientState,
  formData: FormData
): Promise<CreateClientState> {
  const { supabase } = await requireAdmin();

  const email = formData.get("email") as string;
  const companyName = formData.get("companyName") as string;
  const projectName = formData.get("projectName") as string;
  const contractValue = parseFloat(
    (formData.get("contractValue") as string) || "0"
  );
  const password = formData.get("password") as string;

  if (!email || !companyName || !projectName || !password) {
    return { error: "All fields are required" };
  }

  // Create auth user using admin API
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      company_name: companyName,
    },
  });

  if (authError) {
    return { error: `Failed to create user: ${authError.message}` };
  }

  if (!authData.user) {
    return { error: "Failed to create user" };
  }

  // Update the user profile with company name
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: profileError } = await (supabase as any)
    .from("users")
    .update({
      company_name: companyName,
      role: "client",
    })
    .eq("id", authData.user.id);

  if (profileError) {
    console.error("Error updating profile:", profileError);
  }

  // Create the project
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: projectError } = await (supabase as any).from("projects").insert({
    user_id: authData.user.id,
    name: projectName,
    status: "onboarding",
    monthly_contract_value: contractValue,
    onboarding_step: 0,
  });

  if (projectError) {
    return { error: `Failed to create project: ${projectError.message}` };
  }

  revalidatePath("/admin/clients");
  return { success: `Client ${companyName} created successfully!` };
}

// ============================================
// Project Management
// ============================================

export async function updateProjectStatus(
  projectId: string,
  status: ProjectStatus
): Promise<{ success: boolean; error?: string }> {
  const { supabase } = await requireAdmin();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("projects")
    .update({ status })
    .eq("id", projectId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/clients");
  return { success: true };
}

export async function updateProjectDetails(
  projectId: string,
  data: {
    name?: string;
    description?: string;
    monthly_contract_value?: number;
  }
): Promise<{ success: boolean; error?: string }> {
  const { supabase } = await requireAdmin();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("projects")
    .update(data)
    .eq("id", projectId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/clients");
  return { success: true };
}

// ============================================
// Metrics Injector (Wizard of Oz)
// ============================================

export type UpdateMetricsState = {
  error?: string;
  success?: string;
};

export async function updateClientMetrics(
  _prevState: UpdateMetricsState,
  formData: FormData
): Promise<UpdateMetricsState> {
  const { supabase } = await requireAdmin();

  const projectId = formData.get("projectId") as string;
  const safetyScore = parseInt(formData.get("safetyScore") as string);
  const hallucinationsCount = parseInt(
    formData.get("hallucinationsCount") as string
  );
  const jailbreakAttempts = parseInt(
    formData.get("jailbreakAttempts") as string
  );
  const requestsProcessed = parseInt(
    formData.get("requestsProcessed") as string
  );

  if (!projectId) {
    return { error: "Project ID is required" };
  }

  // Get current month's first day
  const now = new Date();
  const reportMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split("T")[0];

  // Check if metrics exist for this month
  const { data: existingMetrics } = await supabase
    .from("metrics")
    .select("id")
    .eq("project_id", projectId)
    .eq("report_month", reportMonth ?? "")
    .single();

  const existing = existingMetrics as { id: string } | null;

  if (existing) {
    // Update existing metrics
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("metrics")
      .update({
        safety_score: safetyScore,
        hallucinations_count: hallucinationsCount,
        jailbreak_attempts: jailbreakAttempts,
        requests_processed: requestsProcessed,
      })
      .eq("id", existing.id);

    if (error) {
      return { error: error.message };
    }
  } else {
    // Insert new metrics
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from("metrics").insert({
      project_id: projectId,
      safety_score: safetyScore,
      hallucinations_count: hallucinationsCount,
      jailbreak_attempts: jailbreakAttempts,
      requests_processed: requestsProcessed,
      report_month: reportMonth,
    });

    if (error) {
      return { error: error.message };
    }
  }

  revalidatePath("/admin/clients");
  return { success: "Metrics updated successfully!" };
}

// ============================================
// Task Management
// ============================================

export type CreateTaskState = {
  error?: string;
  success?: string;
};

export async function createTask(
  _prevState: CreateTaskState,
  formData: FormData
): Promise<CreateTaskState> {
  const { supabase } = await requireAdmin();

  const projectId = formData.get("projectId") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const dueDate = formData.get("dueDate") as string;

  if (!projectId || !title) {
    return { error: "Project ID and title are required" };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from("tasks").insert({
    project_id: projectId,
    title,
    description: description || null,
    due_date: dueDate || null,
    status: "todo",
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/clients");
  return { success: "Task created successfully!" };
}

// ============================================
// Invoice Management
// ============================================

export async function getAllInvoices(): Promise<AdminInvoiceWithClient[]> {
  const { supabase } = await requireAdmin();

  const { data: invoices, error } = await supabase
    .from("invoices")
    .select(
      `
      *,
      projects:project_id (
        id,
        name,
        users:user_id (
          id,
          email,
          company_name
        )
      )
    `
    )
    .order("due_date", { ascending: false });

  if (error || !invoices) {
    console.error("Error fetching invoices:", error);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (invoices as any[]).map((invoice) => ({
    ...invoice,
    project: invoice.projects
      ? {
          ...invoice.projects,
          user: invoice.projects.users,
        }
      : undefined,
  })) as AdminInvoiceWithClient[];
}

export async function markInvoicePaid(
  invoiceId: string
): Promise<{ success: boolean; error?: string }> {
  const { supabase } = await requireAdmin();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("invoices")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
    })
    .eq("id", invoiceId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/billing");
  return { success: true };
}

// ============================================
// Metrics History (for charts)
// ============================================

export async function getMetricsHistory(): Promise<Metrics[]> {
  const { supabase } = await requireAdmin();

  // Get metrics from last 6 months aggregated
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const { data: metrics, error } = await supabase
    .from("metrics")
    .select("*")
    .gte("report_month", sixMonthsAgo.toISOString().split("T")[0])
    .order("report_month", { ascending: true });

  if (error || !metrics) {
    return [];
  }

  return metrics as Metrics[];
}

export async function getClientTasks(projectId: string): Promise<Task[]> {
  const { supabase } = await requireAdmin();

  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error || !tasks) {
    return [];
  }

  return tasks as Task[];
}

export async function getClientInvoices(projectId: string): Promise<Invoice[]> {
  const { supabase } = await requireAdmin();

  const { data: invoices, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("project_id", projectId)
    .order("due_date", { ascending: false });

  if (error || !invoices) {
    return [];
  }

  return invoices as Invoice[];
}
