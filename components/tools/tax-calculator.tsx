'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import posthog from 'posthog-js';
import { TaxCalculatorForm, type TaxCalculatorFormValues } from '@/components/tools/tax-calculator-form';
import { TaxCalculatorResult } from '@/components/tools/tax-calculator-result';
import { calculateTaxReserve, type TaxCalculatorResult as TaxResult } from '@/lib/tools/calculate-tax-reserve';

function revenueBucket(revenue: number) {
  if (revenue < 30000) return 'under_30k';
  if (revenue < 50000) return '30k_50k';
  if (revenue < 75000) return '50k_75k';
  if (revenue < 100000) return '75k_100k';
  if (revenue < 150000) return '100k_150k';
  return 'over_150k';
}

export function TaxCalculator() {
  const [result, setResult] = useState<TaxResult | null>(null);
  const interactedOnce = useRef(false);

  useEffect(() => {
    try {
      posthog.capture('tool_tax_calculator_viewed');
    } catch {
      // best-effort
    }
  }, []);

  const defaultValues = useMemo<Partial<TaxCalculatorFormValues>>(() => {
    return {
      country: 'US',
      annualRevenue: 75000,
      businessExpenses: 10000,
      filingStatus: 'single',
      province: 'ON',
    };
  }, []);

  const handleCalculate = (values: TaxCalculatorFormValues) => {
    const computed = calculateTaxReserve({
      country: values.country,
      annualRevenue: values.annualRevenue,
      businessExpenses: values.businessExpenses,
      filingStatus: values.filingStatus,
      province: values.province,
    });

    setResult(computed);

    try {
      posthog.capture('tool_tax_calculator_calculated', {
        country: values.country,
        revenue_range: revenueBucket(values.annualRevenue),
        effective_rate: computed.effectiveTaxRate.toFixed(2),
        province: values.country === 'CA' ? values.province : undefined,
        filing_status: values.country === 'US' ? values.filingStatus : undefined,
      });
    } catch {
      // best-effort
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h2 className="text-lg font-semibold text-white">Your Income</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Enter your freelance revenue and expenses to see how much to set aside for taxes.
          </p>

          <div className="mt-6">
            <TaxCalculatorForm
              defaultValues={defaultValues}
              onCalculate={handleCalculate}
              onFirstInteraction={() => {
                if (interactedOnce.current) return;
                interactedOnce.current = true;
                try {
                  posthog.capture('tool_tax_calculator_form_interaction');
                } catch {}
              }}
            />
          </div>
        </div>
      </div>

      <div className="lg:col-span-7">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h2 className="text-lg font-semibold text-white">Your Tax Reserve</h2>
          <p className="mt-1 text-sm text-zinc-400">
            See exactly how much to set aside for taxes and what you can safely spend.
          </p>

          <div className="mt-6">
            <TaxCalculatorResult result={result} />
          </div>
        </div>
      </div>
    </div>
  );
}
