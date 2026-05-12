-- Add taxes_withheld column to income table
-- Indicates whether taxes have already been withheld from this income (e.g., W-2 salary)
-- Default is false, meaning taxes are NOT withheld (freelance/contractor income)
-- When false, the tax rate from user_settings will be applied to reduce Safe to Spend

ALTER TABLE income ADD COLUMN IF NOT EXISTS taxes_withheld BOOLEAN DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN income.taxes_withheld IS 'If true, taxes are already withheld (W-2 salary). If false (default), income is pre-tax and tax rate will be applied to Safe to Spend calculation.';
