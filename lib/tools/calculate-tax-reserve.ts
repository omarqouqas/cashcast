// lib/tools/calculate-tax-reserve.ts
// ============================================
// Tax Reserve Calculator Logic
// Supports US and Canadian freelancer tax calculations
// ============================================

export type Country = 'US' | 'CA';
export type USFilingStatus = 'single' | 'married_joint' | 'married_separate' | 'head_of_household';
export type CAProvince = 'ON' | 'BC' | 'AB' | 'QC' | 'MB' | 'SK' | 'NS' | 'NB' | 'NL' | 'PE' | 'YT' | 'NT' | 'NU';

export interface TaxCalculatorInput {
  country: Country;
  annualRevenue: number;
  businessExpenses: number;
  // US-specific
  filingStatus?: USFilingStatus;
  state?: string;
  // Canada-specific
  province?: CAProvince;
}

export interface TaxBreakdown {
  label: string;
  amount: number;
  rate?: number;
  description?: string;
}

export interface TaxCalculatorResult {
  netIncome: number;
  totalTaxReserve: number;
  effectiveTaxRate: number;
  safeToSpend: number;
  monthlyTaxReserve: number;
  quarterlyTaxPayment: number;
  breakdown: TaxBreakdown[];
  alerts: string[];
  country: Country;
}

// ============================================
// US Tax Calculations (2025 rates)
// ============================================

// 2025 Federal Income Tax Brackets (estimated)
const US_FEDERAL_BRACKETS_SINGLE = [
  { min: 0, max: 11600, rate: 0.10 },
  { min: 11600, max: 47150, rate: 0.12 },
  { min: 47150, max: 100525, rate: 0.22 },
  { min: 100525, max: 191950, rate: 0.24 },
  { min: 191950, max: 243725, rate: 0.32 },
  { min: 243725, max: 609350, rate: 0.35 },
  { min: 609350, max: Infinity, rate: 0.37 },
];

const US_FEDERAL_BRACKETS_MARRIED_JOINT = [
  { min: 0, max: 23200, rate: 0.10 },
  { min: 23200, max: 94300, rate: 0.12 },
  { min: 94300, max: 201050, rate: 0.22 },
  { min: 201050, max: 383900, rate: 0.24 },
  { min: 383900, max: 487450, rate: 0.32 },
  { min: 487450, max: 731200, rate: 0.35 },
  { min: 731200, max: Infinity, rate: 0.37 },
];

// Self-employment tax constants
const US_SE_TAX_WAGE_BASE = 168600; // 2024 Social Security wage base
const US_MEDICARE_ADDITIONAL_THRESHOLD = 200000; // Additional 0.9% Medicare

function calculateUSFederalTax(taxableIncome: number, filingStatus: USFilingStatus): number {
  const brackets = filingStatus === 'married_joint' ? US_FEDERAL_BRACKETS_MARRIED_JOINT : US_FEDERAL_BRACKETS_SINGLE;

  let tax = 0;
  let remainingIncome = taxableIncome;

  for (const bracket of brackets) {
    if (remainingIncome <= 0) break;

    const taxableInBracket = Math.min(remainingIncome, bracket.max - bracket.min);
    tax += taxableInBracket * bracket.rate;
    remainingIncome -= taxableInBracket;
  }

  return tax;
}

function calculateUSSelfEmploymentTax(netIncome: number): { total: number; deductible: number } {
  // Self-employment tax is calculated on 92.35% of net self-employment income
  const seIncome = netIncome * 0.9235;

  // Social Security portion (12.4%) - capped at wage base
  const socialSecurityIncome = Math.min(seIncome, US_SE_TAX_WAGE_BASE);
  const socialSecurityTax = socialSecurityIncome * 0.124;

  // Medicare portion (2.9%) - no cap
  let medicareTax = seIncome * 0.029;

  // Additional Medicare tax (0.9%) for high earners
  if (seIncome > US_MEDICARE_ADDITIONAL_THRESHOLD) {
    medicareTax += (seIncome - US_MEDICARE_ADDITIONAL_THRESHOLD) * 0.009;
  }

  const total = socialSecurityTax + medicareTax;

  // You can deduct half of SE tax from income
  const deductible = total / 2;

  return { total, deductible };
}

function calculateUSTaxes(input: TaxCalculatorInput): TaxCalculatorResult {
  const { annualRevenue, businessExpenses, filingStatus = 'single' } = input;
  const netIncome = annualRevenue - businessExpenses;

  if (netIncome <= 0) {
    return {
      netIncome: 0,
      totalTaxReserve: 0,
      effectiveTaxRate: 0,
      safeToSpend: annualRevenue,
      monthlyTaxReserve: 0,
      quarterlyTaxPayment: 0,
      breakdown: [],
      alerts: ['Your expenses exceed your revenue. No tax reserve needed.'],
      country: 'US',
    };
  }

  const breakdown: TaxBreakdown[] = [];
  const alerts: string[] = [];

  // Calculate self-employment tax
  const seTax = calculateUSSelfEmploymentTax(netIncome);
  breakdown.push({
    label: 'Self-Employment Tax',
    amount: seTax.total,
    rate: 0.153,
    description: 'Social Security (12.4%) + Medicare (2.9%)',
  });

  // Adjusted gross income (after SE tax deduction)
  const adjustedIncome = netIncome - seTax.deductible;

  // Standard deduction (2025 estimated)
  const standardDeduction = filingStatus === 'married_joint' ? 29200 : 14600;
  const taxableIncome = Math.max(0, adjustedIncome - standardDeduction);

  // Federal income tax
  const federalTax = calculateUSFederalTax(taxableIncome, filingStatus);
  breakdown.push({
    label: 'Federal Income Tax',
    amount: federalTax,
    description: `Based on ${filingStatus.replace('_', ' ')} filing status`,
  });

  // Estimate state tax (average ~5% for states with income tax)
  const estimatedStateTax = taxableIncome * 0.05;
  breakdown.push({
    label: 'State Income Tax (Est.)',
    amount: estimatedStateTax,
    rate: 0.05,
    description: 'Average estimate - varies by state',
  });

  const totalTaxReserve = seTax.total + federalTax + estimatedStateTax;
  const effectiveTaxRate = netIncome > 0 ? totalTaxReserve / netIncome : 0;
  const safeToSpend = netIncome - totalTaxReserve;

  // Add alerts
  if (netIncome > 1000) {
    alerts.push('You\'ll likely need to pay quarterly estimated taxes (Apr 15, Jun 15, Sep 15, Jan 15)');
  }
  if (effectiveTaxRate > 0.35) {
    alerts.push('Consider consulting a tax professional for deduction strategies');
  }

  return {
    netIncome,
    totalTaxReserve,
    effectiveTaxRate,
    safeToSpend,
    monthlyTaxReserve: totalTaxReserve / 12,
    quarterlyTaxPayment: totalTaxReserve / 4,
    breakdown,
    alerts,
    country: 'US',
  };
}

// ============================================
// Canadian Tax Calculations (2025 rates)
// ============================================

// Federal tax brackets (2025)
const CA_FEDERAL_BRACKETS = [
  { min: 0, max: 55867, rate: 0.15 },
  { min: 55867, max: 111733, rate: 0.205 },
  { min: 111733, max: 173205, rate: 0.26 },
  { min: 173205, max: 246752, rate: 0.29 },
  { min: 246752, max: Infinity, rate: 0.33 },
];

// Provincial tax rates (simplified - using top marginal for estimate)
const CA_PROVINCIAL_RATES: Record<CAProvince, { name: string; rate: number; hstRate: number }> = {
  ON: { name: 'Ontario', rate: 0.1316, hstRate: 0.13 },
  BC: { name: 'British Columbia', rate: 0.1280, hstRate: 0.12 },
  AB: { name: 'Alberta', rate: 0.15, hstRate: 0.05 }, // GST only
  QC: { name: 'Quebec', rate: 0.2575, hstRate: 0.14975 }, // GST + QST
  MB: { name: 'Manitoba', rate: 0.1740, hstRate: 0.12 },
  SK: { name: 'Saskatchewan', rate: 0.145, hstRate: 0.11 },
  NS: { name: 'Nova Scotia', rate: 0.21, hstRate: 0.15 },
  NB: { name: 'New Brunswick', rate: 0.195, hstRate: 0.15 },
  NL: { name: 'Newfoundland', rate: 0.218, hstRate: 0.15 },
  PE: { name: 'Prince Edward Island', rate: 0.1837, hstRate: 0.15 },
  YT: { name: 'Yukon', rate: 0.15, hstRate: 0.05 },
  NT: { name: 'Northwest Territories', rate: 0.1405, hstRate: 0.05 },
  NU: { name: 'Nunavut', rate: 0.115, hstRate: 0.05 },
};

// CPP rates (2025)
const CPP_RATE = 0.1190; // Combined employee + employer portion for self-employed
const CPP_MAX_PENSIONABLE_EARNINGS = 71300;
const CPP_BASIC_EXEMPTION = 3500;

// GST/HST small supplier threshold
const GST_THRESHOLD = 30000;

function calculateCAFederalTax(taxableIncome: number): number {
  let tax = 0;
  let remainingIncome = taxableIncome;

  for (const bracket of CA_FEDERAL_BRACKETS) {
    if (remainingIncome <= 0) break;

    const taxableInBracket = Math.min(remainingIncome, bracket.max - bracket.min);
    tax += taxableInBracket * bracket.rate;
    remainingIncome -= taxableInBracket;
  }

  return tax;
}

function calculateCPP(netIncome: number): number {
  // CPP pensionable earnings
  const pensionableEarnings = Math.min(netIncome, CPP_MAX_PENSIONABLE_EARNINGS) - CPP_BASIC_EXEMPTION;
  if (pensionableEarnings <= 0) return 0;

  // Self-employed pay both portions
  return pensionableEarnings * CPP_RATE;
}

function calculateCanadianTaxes(input: TaxCalculatorInput): TaxCalculatorResult {
  const { annualRevenue, businessExpenses, province = 'ON' } = input;
  const netIncome = annualRevenue - businessExpenses;
  const provinceInfo = CA_PROVINCIAL_RATES[province];

  if (netIncome <= 0) {
    return {
      netIncome: 0,
      totalTaxReserve: 0,
      effectiveTaxRate: 0,
      safeToSpend: annualRevenue,
      monthlyTaxReserve: 0,
      quarterlyTaxPayment: 0,
      breakdown: [],
      alerts: ['Your expenses exceed your revenue. No tax reserve needed.'],
      country: 'CA',
    };
  }

  const breakdown: TaxBreakdown[] = [];
  const alerts: string[] = [];

  // CPP contributions
  const cppContribution = calculateCPP(netIncome);
  breakdown.push({
    label: 'CPP Contributions',
    amount: cppContribution,
    rate: CPP_RATE,
    description: 'Canada Pension Plan (both portions)',
  });

  // Federal income tax
  const federalTax = calculateCAFederalTax(netIncome);
  breakdown.push({
    label: 'Federal Income Tax',
    amount: federalTax,
    description: 'Federal tax brackets',
  });

  // Provincial income tax (simplified)
  const provincialTax = netIncome * provinceInfo.rate * 0.5; // Rough estimate using half of top rate
  breakdown.push({
    label: `${provinceInfo.name} Provincial Tax`,
    amount: provincialTax,
    description: 'Estimated provincial income tax',
  });

  // GST/HST reserve (if applicable)
  let gstReserve = 0;
  if (annualRevenue > GST_THRESHOLD) {
    // You collect HST on revenue but can claim input tax credits on expenses
    // Estimate: HST on net profit as a rough reserve
    gstReserve = (annualRevenue - businessExpenses * 0.5) * provinceInfo.hstRate * 0.5;
    breakdown.push({
      label: `GST/HST Reserve`,
      amount: gstReserve,
      rate: provinceInfo.hstRate,
      description: 'Estimated HST owing (revenue less ITCs)',
    });
  }

  const totalTaxReserve = cppContribution + federalTax + provincialTax + gstReserve;
  const effectiveTaxRate = netIncome > 0 ? totalTaxReserve / netIncome : 0;
  const safeToSpend = netIncome - totalTaxReserve;

  // Add alerts
  if (annualRevenue > GST_THRESHOLD) {
    alerts.push(`You\'ve crossed the $30,000 GST/HST threshold - you must register and collect ${(provinceInfo.hstRate * 100).toFixed(1)}% HST`);
  } else if (annualRevenue > GST_THRESHOLD * 0.8) {
    alerts.push(`You're approaching the $30,000 GST/HST threshold (${((annualRevenue / GST_THRESHOLD) * 100).toFixed(0)}%)`);
  }

  if (totalTaxReserve > 3000) {
    alerts.push('You may need to pay quarterly tax installments (Mar 15, Jun 15, Sep 15, Dec 15)');
  }

  return {
    netIncome,
    totalTaxReserve,
    effectiveTaxRate,
    safeToSpend,
    monthlyTaxReserve: totalTaxReserve / 12,
    quarterlyTaxPayment: totalTaxReserve / 4,
    breakdown,
    alerts,
    country: 'CA',
  };
}

// ============================================
// Main Export
// ============================================

export function calculateTaxReserve(input: TaxCalculatorInput): TaxCalculatorResult {
  if (input.country === 'CA') {
    return calculateCanadianTaxes(input);
  }
  return calculateUSTaxes(input);
}
