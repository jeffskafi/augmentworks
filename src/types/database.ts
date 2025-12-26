// ============================================
// AgentReady Client Portal - Database Types
// ============================================

export type UserRole = "admin" | "client";
export type ProjectStatus = "onboarding" | "audit" | "monitoring" | "completed";
export type InvoiceStatus = "pending" | "paid" | "overdue" | "cancelled";
export type TaskStatus = "todo" | "in_progress" | "done";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  company_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  onboarding_step: number;
  monthly_contract_value: number;
  created_at: string;
  updated_at: string;
}

export interface Metrics {
  id: string;
  project_id: string;
  safety_score: number;
  hallucinations_count: number;
  jailbreak_attempts: number;
  requests_processed: number;
  report_month: string;
  created_at: string;
}

export interface Invoice {
  id: string;
  project_id: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  stripe_invoice_id: string | null;
  stripe_invoice_url: string | null;
  description: string | null;
  due_date: string;
  paid_at: string | null;
  created_at: string;
}

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

// Extended types with relations
export interface ProjectWithMetrics extends Project {
  latest_metrics?: Metrics;
  user?: User;
}

export interface MetricsWithTrend extends Metrics {
  previous_metrics?: Metrics;
  safety_score_change?: number;
  hallucinations_change?: number;
  jailbreak_change?: number;
  requests_change?: number;
}

// API Response types
export interface DashboardData {
  user: User;
  project: Project;
  current_metrics: Metrics | null;
  previous_metrics: Metrics | null;
  recent_tasks: Task[];
  pending_invoices: Invoice[];
}

// Admin-specific types
export interface ClientWithProject extends User {
  projects: Project[];
  latest_metrics?: Metrics | null;
  total_invoiced?: number;
}

export interface AdminDashboardStats {
  total_mrr: number;
  active_clients: number;
  total_hallucinations_this_month: number;
  pending_invoices_count: number;
  pending_invoices_total: number;
}

export interface AdminInvoiceWithClient extends Invoice {
  project?: Project & {
    user?: User;
  };
}

export interface ActivityItem {
  id: string;
  type: "login" | "status_change" | "metrics_update" | "invoice_paid";
  description: string;
  client_name: string;
  timestamp: string;
}

// Supabase Database type for @supabase/ssr
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, "created_at" | "updated_at"> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<User, "id">>;
      };
      projects: {
        Row: Project;
        Insert: Omit<Project, "id" | "created_at" | "updated_at" | "monthly_contract_value"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          monthly_contract_value?: number;
        };
        Update: Partial<Omit<Project, "id" | "created_at">>;
      };
      metrics: {
        Row: Metrics;
        Insert: Omit<Metrics, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Metrics, "id" | "created_at">>;
      };
      invoices: {
        Row: Invoice;
        Insert: Omit<Invoice, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Invoice, "id" | "created_at">>;
      };
      tasks: {
        Row: Task;
        Insert: Omit<Task, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Task, "id" | "created_at">>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: UserRole;
      project_status: ProjectStatus;
      invoice_status: InvoiceStatus;
      task_status: TaskStatus;
    };
  };
}
