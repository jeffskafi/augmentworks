// Mock data for demo/development without Supabase
import type {
  User,
  Project,
  Metrics,
  Invoice,
  Task,
  MetricsWithTrend,
} from "~/types/database";

export const mockUser: User = {
  id: "demo-user-001",
  email: "demo@acmecorp.com",
  role: "client",
  company_name: "Acme Corp",
  avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=AC",
  created_at: "2024-06-01T00:00:00Z",
  updated_at: "2024-12-01T00:00:00Z",
};

export const mockProject: Project = {
  id: "demo-project-001",
  user_id: "demo-user-001",
  name: "Acme AI Assistant",
  description: "Enterprise customer service chatbot with RAG capabilities",
  status: "monitoring",
  onboarding_step: 3,
  monthly_contract_value: 2500,
  created_at: "2024-07-01T00:00:00Z",
  updated_at: "2024-12-01T00:00:00Z",
};

export const mockCurrentMetrics: Metrics = {
  id: "metrics-001",
  project_id: "demo-project-001",
  safety_score: 94,
  hallucinations_count: 12,
  jailbreak_attempts: 3,
  requests_processed: 145230,
  report_month: "2024-12-01",
  created_at: "2024-12-01T00:00:00Z",
};

export const mockPreviousMetrics: Metrics = {
  id: "metrics-002",
  project_id: "demo-project-001",
  safety_score: 91,
  hallucinations_count: 18,
  jailbreak_attempts: 5,
  requests_processed: 132450,
  report_month: "2024-11-01",
  created_at: "2024-11-01T00:00:00Z",
};

export const mockMetricsWithTrend: MetricsWithTrend = {
  ...mockCurrentMetrics,
  previous_metrics: mockPreviousMetrics,
  safety_score_change: 3,
  hallucinations_change: -33,
  jailbreak_change: -40,
  requests_change: 10,
};

export const mockTasks: Task[] = [
  {
    id: "task-001",
    project_id: "demo-project-001",
    title: "Implement Jailbreak Detection v2",
    description: "Upgrade jailbreak detection with new patterns",
    status: "in_progress",
    due_date: "2024-12-30",
    completed_at: null,
    created_at: "2024-12-01T00:00:00Z",
    updated_at: "2024-12-15T00:00:00Z",
  },
  {
    id: "task-002",
    project_id: "demo-project-001",
    title: "RAG Accuracy Improvement",
    description: "Fine-tune retrieval to reduce hallucinations",
    status: "in_progress",
    due_date: "2025-01-15",
    completed_at: null,
    created_at: "2024-12-01T00:00:00Z",
    updated_at: "2024-12-10T00:00:00Z",
  },
  {
    id: "task-003",
    project_id: "demo-project-001",
    title: "Q4 Performance Report",
    description: "Compile quarterly metrics and recommendations",
    status: "todo",
    due_date: "2025-01-05",
    completed_at: null,
    created_at: "2024-12-01T00:00:00Z",
    updated_at: "2024-12-01T00:00:00Z",
  },
  {
    id: "task-004",
    project_id: "demo-project-001",
    title: "Annual Security Certification",
    description: "Complete SOC2 compliance documentation",
    status: "todo",
    due_date: "2025-01-31",
    completed_at: null,
    created_at: "2024-12-01T00:00:00Z",
    updated_at: "2024-12-01T00:00:00Z",
  },
  {
    id: "task-005",
    project_id: "demo-project-001",
    title: "Initial Security Audit",
    description: "Complete comprehensive security review of AI model",
    status: "done",
    due_date: "2024-07-15",
    completed_at: "2024-07-14T10:30:00Z",
    created_at: "2024-07-01T00:00:00Z",
    updated_at: "2024-07-14T10:30:00Z",
  },
  {
    id: "task-006",
    project_id: "demo-project-001",
    title: "Deploy Monitoring Suite",
    description: "Set up real-time monitoring dashboard",
    status: "done",
    due_date: "2024-07-30",
    completed_at: "2024-07-28T15:45:00Z",
    created_at: "2024-07-01T00:00:00Z",
    updated_at: "2024-07-28T15:45:00Z",
  },
];

export const mockInvoices: Invoice[] = [
  {
    id: "inv-001",
    project_id: "demo-project-001",
    amount: 2500.0,
    currency: "USD",
    status: "pending",
    stripe_invoice_id: null,
    stripe_invoice_url: "https://invoice.stripe.com/demo",
    description: "December Monitoring Services",
    due_date: "2024-12-31",
    paid_at: null,
    created_at: "2024-12-01T00:00:00Z",
  },
  {
    id: "inv-002",
    project_id: "demo-project-001",
    amount: 3500.0,
    currency: "USD",
    status: "pending",
    stripe_invoice_id: null,
    stripe_invoice_url: "https://invoice.stripe.com/demo",
    description: "Jailbreak Detection v2 Implementation",
    due_date: "2025-01-15",
    paid_at: null,
    created_at: "2024-12-15T00:00:00Z",
  },
  {
    id: "inv-003",
    project_id: "demo-project-001",
    amount: 2500.0,
    currency: "USD",
    status: "paid",
    stripe_invoice_id: null,
    stripe_invoice_url: "https://invoice.stripe.com/demo",
    description: "November Monitoring Services",
    due_date: "2024-11-30",
    paid_at: "2024-11-29T16:00:00Z",
    created_at: "2024-11-01T00:00:00Z",
  },
  {
    id: "inv-004",
    project_id: "demo-project-001",
    amount: 2500.0,
    currency: "USD",
    status: "paid",
    stripe_invoice_id: null,
    stripe_invoice_url: "https://invoice.stripe.com/demo",
    description: "October Monitoring Services",
    due_date: "2024-10-31",
    paid_at: "2024-10-30T11:45:00Z",
    created_at: "2024-10-01T00:00:00Z",
  },
  {
    id: "inv-005",
    project_id: "demo-project-001",
    amount: 4500.0,
    currency: "USD",
    status: "paid",
    stripe_invoice_id: null,
    stripe_invoice_url: "https://invoice.stripe.com/demo",
    description: "Initial Security Audit & Setup",
    due_date: "2024-07-31",
    paid_at: "2024-07-28T10:00:00Z",
    created_at: "2024-07-01T00:00:00Z",
  },
];

// Check if we're in demo mode (no Supabase credentials)
export const isDemoMode = () => {
  return (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_URL === "your_supabase_project_url"
  );
};

