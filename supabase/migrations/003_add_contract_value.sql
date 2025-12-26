-- ============================================
-- Add monthly_contract_value to projects table
-- ============================================

ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS monthly_contract_value DECIMAL(10, 2) DEFAULT 0;

-- Add comment for documentation
COMMENT ON COLUMN public.projects.monthly_contract_value IS 'Monthly recurring revenue value for this project/contract';

