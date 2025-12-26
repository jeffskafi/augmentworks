-- ============================================
-- AgentReady Client Portal - Seed Data
-- ============================================
-- Run this AFTER creating users via Supabase Auth
-- 
-- IMPORTANT: You must first create these users in Supabase Auth:
-- 1. Admin: admin@agentready.com (password: Admin123!)
-- 2. Client: client@acmecorp.com (password: Client123!)
--
-- Then replace the UUIDs below with the actual auth.users IDs

-- ============================================
-- PLACEHOLDER UUIDs (Replace with real auth user IDs)
-- ============================================
-- After creating users in Supabase Auth, run:
-- SELECT id, email FROM auth.users;
-- Then update these values:

DO $$
DECLARE
    admin_user_id UUID;
    client_user_id UUID;
    acme_project_id UUID;
BEGIN
    -- Get the admin user (first user with admin email pattern or manually set)
    SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@agentready.com' LIMIT 1;
    SELECT id INTO client_user_id FROM auth.users WHERE email = 'client@acmecorp.com' LIMIT 1;
    
    -- If users don't exist yet, use placeholder UUIDs (you'll need to update these)
    IF admin_user_id IS NULL THEN
        admin_user_id := '00000000-0000-0000-0000-000000000001';
    END IF;
    
    IF client_user_id IS NULL THEN
        client_user_id := '00000000-0000-0000-0000-000000000002';
    END IF;
    
    -- ============================================
    -- UPDATE USER PROFILES
    -- ============================================
    
    -- Update admin user
    UPDATE public.users 
    SET 
        role = 'admin',
        company_name = 'AgentReady',
        avatar_url = 'https://api.dicebear.com/7.x/initials/svg?seed=AR'
    WHERE id = admin_user_id;
    
    -- Update client user  
    UPDATE public.users 
    SET 
        role = 'client',
        company_name = 'Acme Corp',
        avatar_url = 'https://api.dicebear.com/7.x/initials/svg?seed=AC'
    WHERE id = client_user_id;
    
    -- ============================================
    -- CREATE PROJECT FOR ACME CORP
    -- ============================================
    
    INSERT INTO public.projects (id, user_id, name, description, status, onboarding_step)
    VALUES (
        gen_random_uuid(),
        client_user_id,
        'Acme AI Assistant',
        'Enterprise customer service chatbot with RAG capabilities',
        'monitoring',
        3 -- Completed onboarding
    )
    RETURNING id INTO acme_project_id;
    
    -- ============================================
    -- CREATE METRICS DATA (Last 6 months)
    -- ============================================
    
    -- December 2024
    INSERT INTO public.metrics (project_id, safety_score, hallucinations_count, jailbreak_attempts, requests_processed, report_month)
    VALUES (acme_project_id, 94, 12, 3, 145230, '2024-12-01');
    
    -- November 2024
    INSERT INTO public.metrics (project_id, safety_score, hallucinations_count, jailbreak_attempts, requests_processed, report_month)
    VALUES (acme_project_id, 91, 18, 5, 132450, '2024-11-01');
    
    -- October 2024
    INSERT INTO public.metrics (project_id, safety_score, hallucinations_count, jailbreak_attempts, requests_processed, report_month)
    VALUES (acme_project_id, 88, 24, 8, 118900, '2024-10-01');
    
    -- September 2024
    INSERT INTO public.metrics (project_id, safety_score, hallucinations_count, jailbreak_attempts, requests_processed, report_month)
    VALUES (acme_project_id, 85, 31, 12, 98750, '2024-09-01');
    
    -- August 2024
    INSERT INTO public.metrics (project_id, safety_score, hallucinations_count, jailbreak_attempts, requests_processed, report_month)
    VALUES (acme_project_id, 82, 45, 15, 76200, '2024-08-01');
    
    -- July 2024 (initial deployment)
    INSERT INTO public.metrics (project_id, safety_score, hallucinations_count, jailbreak_attempts, requests_processed, report_month)
    VALUES (acme_project_id, 78, 67, 22, 45000, '2024-07-01');
    
    -- ============================================
    -- CREATE TASKS
    -- ============================================
    
    -- Completed tasks
    INSERT INTO public.tasks (project_id, title, description, status, due_date, completed_at)
    VALUES 
    (acme_project_id, 'Initial Security Audit', 'Complete comprehensive security review of AI model', 'done', '2024-07-15', '2024-07-14 10:30:00'),
    (acme_project_id, 'Deploy Monitoring Suite', 'Set up real-time monitoring dashboard', 'done', '2024-07-30', '2024-07-28 15:45:00'),
    (acme_project_id, 'Configure Alert Thresholds', 'Define hallucination and safety score alert levels', 'done', '2024-08-15', '2024-08-12 09:00:00'),
    (acme_project_id, 'Q3 Performance Review', 'Quarterly analysis of AI performance metrics', 'done', '2024-10-01', '2024-09-30 14:20:00');
    
    -- In progress tasks
    INSERT INTO public.tasks (project_id, title, description, status, due_date)
    VALUES 
    (acme_project_id, 'Implement Jailbreak Detection v2', 'Upgrade jailbreak detection with new patterns', 'in_progress', '2024-12-30'),
    (acme_project_id, 'RAG Accuracy Improvement', 'Fine-tune retrieval to reduce hallucinations', 'in_progress', '2025-01-15');
    
    -- Todo tasks
    INSERT INTO public.tasks (project_id, title, description, status, due_date)
    VALUES 
    (acme_project_id, 'Q4 Performance Report', 'Compile quarterly metrics and recommendations', 'todo', '2025-01-05'),
    (acme_project_id, 'Annual Security Certification', 'Complete SOC2 compliance documentation', 'todo', '2025-01-31'),
    (acme_project_id, 'Scale Testing for 500K RPM', 'Load testing for anticipated Q1 traffic', 'todo', '2025-02-15');
    
    -- ============================================
    -- CREATE INVOICES
    -- ============================================
    
    -- Paid invoices
    INSERT INTO public.invoices (project_id, amount, status, description, due_date, paid_at, stripe_invoice_url)
    VALUES 
    (acme_project_id, 4500.00, 'paid', 'Initial Security Audit & Setup', '2024-07-31', '2024-07-28 10:00:00', 'https://invoice.stripe.com/i/acct_xxx/inv_july'),
    (acme_project_id, 2500.00, 'paid', 'August Monitoring Services', '2024-08-31', '2024-08-30 14:30:00', 'https://invoice.stripe.com/i/acct_xxx/inv_aug'),
    (acme_project_id, 2500.00, 'paid', 'September Monitoring Services', '2024-09-30', '2024-09-28 09:15:00', 'https://invoice.stripe.com/i/acct_xxx/inv_sep'),
    (acme_project_id, 2500.00, 'paid', 'October Monitoring Services', '2024-10-31', '2024-10-30 11:45:00', 'https://invoice.stripe.com/i/acct_xxx/inv_oct'),
    (acme_project_id, 2500.00, 'paid', 'November Monitoring Services', '2024-11-30', '2024-11-29 16:00:00', 'https://invoice.stripe.com/i/acct_xxx/inv_nov');
    
    -- Current/pending invoices
    INSERT INTO public.invoices (project_id, amount, status, description, due_date, stripe_invoice_url)
    VALUES 
    (acme_project_id, 2500.00, 'pending', 'December Monitoring Services', '2024-12-31', 'https://invoice.stripe.com/i/acct_xxx/inv_dec'),
    (acme_project_id, 3500.00, 'pending', 'Jailbreak Detection v2 Implementation', '2025-01-15', 'https://invoice.stripe.com/i/acct_xxx/inv_jan');
    
    RAISE NOTICE 'Seed data created successfully!';
    RAISE NOTICE 'Admin User ID: %', admin_user_id;
    RAISE NOTICE 'Client User ID: %', client_user_id;
    RAISE NOTICE 'Acme Project ID: %', acme_project_id;
    
END $$;

-- ============================================
-- QUICK VERIFICATION QUERIES
-- ============================================

-- Uncomment these to verify the data:
-- SELECT * FROM public.users;
-- SELECT * FROM public.projects;
-- SELECT * FROM public.metrics ORDER BY report_month DESC;
-- SELECT * FROM public.tasks;
-- SELECT * FROM public.invoices ORDER BY due_date DESC;

