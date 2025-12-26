-- ============================================
-- AgentReady Client Portal - Database Schema
-- ============================================
-- Run this in Supabase SQL Editor or via migrations

-- gen_random_uuid() is available by default in PostgreSQL 13+

-- ============================================
-- ENUMS
-- ============================================

-- User roles
CREATE TYPE user_role AS ENUM ('admin', 'client');

-- Project status workflow
CREATE TYPE project_status AS ENUM ('onboarding', 'audit', 'monitoring', 'completed');

-- Invoice payment status
CREATE TYPE invoice_status AS ENUM ('pending', 'paid', 'overdue', 'cancelled');

-- Task status for project management
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'done');

-- ============================================
-- TABLES
-- ============================================

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    role user_role NOT NULL DEFAULT 'client',
    company_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Projects table
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    status project_status NOT NULL DEFAULT 'onboarding',
    onboarding_step INTEGER NOT NULL DEFAULT 0, -- 0-based step index
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Metrics table (AI evaluation data)
CREATE TABLE public.metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    safety_score INTEGER NOT NULL CHECK (safety_score >= 0 AND safety_score <= 100),
    hallucinations_count INTEGER NOT NULL DEFAULT 0,
    jailbreak_attempts INTEGER NOT NULL DEFAULT 0,
    requests_processed INTEGER NOT NULL DEFAULT 0,
    report_month DATE NOT NULL, -- First day of the month for the report
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Invoices table
CREATE TABLE public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    status invoice_status NOT NULL DEFAULT 'pending',
    stripe_invoice_id TEXT,
    stripe_invoice_url TEXT,
    description TEXT,
    due_date DATE NOT NULL,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tasks table (project deliverables)
CREATE TABLE public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status task_status NOT NULL DEFAULT 'todo',
    due_date DATE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_metrics_project_id ON public.metrics(project_id);
CREATE INDEX idx_metrics_report_month ON public.metrics(report_month DESC);
CREATE INDEX idx_invoices_project_id ON public.invoices(project_id);
CREATE INDEX idx_invoices_status ON public.invoices(status);
CREATE INDEX idx_invoices_due_date ON public.invoices(due_date);
CREATE INDEX idx_tasks_project_id ON public.tasks(project_id);
CREATE INDEX idx_tasks_status ON public.tasks(status);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() 
        AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get current user's ID
CREATE OR REPLACE FUNCTION get_user_id()
RETURNS UUID AS $$
BEGIN
    RETURN auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- RLS POLICIES: USERS
-- ============================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
    ON public.users
    FOR SELECT
    USING (id = auth.uid() OR is_admin());

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON public.users
    FOR UPDATE
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- Admins can insert new users
CREATE POLICY "Admins can insert users"
    ON public.users
    FOR INSERT
    WITH CHECK (is_admin() OR id = auth.uid());

-- ============================================
-- RLS POLICIES: PROJECTS
-- ============================================

-- Users can view their own projects, admins can view all
CREATE POLICY "Users can view own projects"
    ON public.projects
    FOR SELECT
    USING (user_id = auth.uid() OR is_admin());

-- Only admins can create projects
CREATE POLICY "Admins can create projects"
    ON public.projects
    FOR INSERT
    WITH CHECK (is_admin());

-- Only admins can update projects
CREATE POLICY "Admins can update projects"
    ON public.projects
    FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

-- Only admins can delete projects
CREATE POLICY "Admins can delete projects"
    ON public.projects
    FOR DELETE
    USING (is_admin());

-- ============================================
-- RLS POLICIES: METRICS
-- ============================================

-- Users can view metrics for their own projects
CREATE POLICY "Users can view own project metrics"
    ON public.metrics
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE projects.id = metrics.project_id 
            AND (projects.user_id = auth.uid() OR is_admin())
        )
    );

-- Only admins can insert metrics
CREATE POLICY "Admins can insert metrics"
    ON public.metrics
    FOR INSERT
    WITH CHECK (is_admin());

-- Only admins can update metrics
CREATE POLICY "Admins can update metrics"
    ON public.metrics
    FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

-- Only admins can delete metrics
CREATE POLICY "Admins can delete metrics"
    ON public.metrics
    FOR DELETE
    USING (is_admin());

-- ============================================
-- RLS POLICIES: INVOICES
-- ============================================

-- Users can view invoices for their own projects
CREATE POLICY "Users can view own project invoices"
    ON public.invoices
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE projects.id = invoices.project_id 
            AND (projects.user_id = auth.uid() OR is_admin())
        )
    );

-- Only admins can manage invoices
CREATE POLICY "Admins can insert invoices"
    ON public.invoices
    FOR INSERT
    WITH CHECK (is_admin());

CREATE POLICY "Admins can update invoices"
    ON public.invoices
    FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "Admins can delete invoices"
    ON public.invoices
    FOR DELETE
    USING (is_admin());

-- ============================================
-- RLS POLICIES: TASKS
-- ============================================

-- Users can view tasks for their own projects
CREATE POLICY "Users can view own project tasks"
    ON public.tasks
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE projects.id = tasks.project_id 
            AND (projects.user_id = auth.uid() OR is_admin())
        )
    );

-- Only admins can manage tasks
CREATE POLICY "Admins can insert tasks"
    ON public.tasks
    FOR INSERT
    WITH CHECK (is_admin());

CREATE POLICY "Admins can update tasks"
    ON public.tasks
    FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "Admins can delete tasks"
    ON public.tasks
    FOR DELETE
    USING (is_admin());

-- ============================================
-- AUTH TRIGGER: Auto-create user profile
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, role)
    VALUES (NEW.id, NEW.email, 'client');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- VIEWS (Optional - for easier querying)
-- ============================================

-- View for dashboard: Latest metrics per project
CREATE OR REPLACE VIEW public.latest_project_metrics AS
SELECT DISTINCT ON (project_id)
    m.*,
    p.name as project_name,
    p.status as project_status,
    p.user_id
FROM public.metrics m
JOIN public.projects p ON p.id = m.project_id
ORDER BY project_id, report_month DESC;

-- Grant access to the view
ALTER VIEW public.latest_project_metrics OWNER TO postgres;

