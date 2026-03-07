'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDown } from 'lucide-react';
import type { USFilingStatus, CAProvince } from '@/lib/tools/calculate-tax-reserve';

const taxCalculatorSchema = z.object({
  country: z.enum(['US', 'CA']),
  annualRevenue: z.coerce
    .number({
      required_error: 'Annual revenue is required',
      invalid_type_error: 'Annual revenue must be a number',
    })
    .min(0, 'Annual revenue cannot be negative')
    .refine((n) => Number.isFinite(n), 'Enter a valid number'),
  businessExpenses: z.coerce
    .number({
      required_error: 'Business expenses are required',
      invalid_type_error: 'Business expenses must be a number',
    })
    .min(0, 'Business expenses cannot be negative')
    .refine((n) => Number.isFinite(n), 'Enter a valid number'),
  filingStatus: z.enum(['single', 'married_joint', 'married_separate', 'head_of_household']).optional(),
  province: z.enum(['ON', 'BC', 'AB', 'QC', 'MB', 'SK', 'NS', 'NB', 'NL', 'PE', 'YT', 'NT', 'NU']).optional(),
});

export type TaxCalculatorFormValues = z.infer<typeof taxCalculatorSchema>;

type Props = {
  defaultValues?: Partial<TaxCalculatorFormValues>;
  onCalculate: (values: TaxCalculatorFormValues) => void;
  onFirstInteraction?: () => void;
};

const US_FILING_STATUSES: { value: USFilingStatus; label: string }[] = [
  { value: 'single', label: 'Single' },
  { value: 'married_joint', label: 'Married Filing Jointly' },
  { value: 'married_separate', label: 'Married Filing Separately' },
  { value: 'head_of_household', label: 'Head of Household' },
];

const CA_PROVINCES: { value: CAProvince; label: string }[] = [
  { value: 'ON', label: 'Ontario' },
  { value: 'BC', label: 'British Columbia' },
  { value: 'AB', label: 'Alberta' },
  { value: 'QC', label: 'Quebec' },
  { value: 'MB', label: 'Manitoba' },
  { value: 'SK', label: 'Saskatchewan' },
  { value: 'NS', label: 'Nova Scotia' },
  { value: 'NB', label: 'New Brunswick' },
  { value: 'NL', label: 'Newfoundland & Labrador' },
  { value: 'PE', label: 'Prince Edward Island' },
  { value: 'YT', label: 'Yukon' },
  { value: 'NT', label: 'Northwest Territories' },
  { value: 'NU', label: 'Nunavut' },
];

export function TaxCalculatorForm({ defaultValues, onCalculate, onFirstInteraction }: Props) {
  const defaults = useMemo<TaxCalculatorFormValues>(() => {
    return {
      country: 'US',
      annualRevenue: 75000,
      businessExpenses: 10000,
      filingStatus: 'single',
      province: 'ON',
      ...defaultValues,
    };
  }, [defaultValues]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TaxCalculatorFormValues>({
    resolver: zodResolver(taxCalculatorSchema),
    defaultValues: defaults,
    mode: 'onSubmit',
  });

  const country = watch('country');

  const onSubmit = (values: TaxCalculatorFormValues) => {
    onCalculate(values);
  };

  const baseInput =
    'bg-zinc-950/40 border border-zinc-700 text-zinc-100 placeholder:text-zinc-600 focus:ring-teal-500 focus:ring-offset-zinc-950 focus:border-transparent';

  const baseSelect =
    'w-full h-10 px-3 rounded-md bg-zinc-950/40 border border-zinc-700 text-zinc-100 focus:ring-teal-500 focus:ring-offset-zinc-950 focus:border-transparent appearance-none cursor-pointer';

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      onChange={() => {
        onFirstInteraction?.();
      }}
    >
      {/* Country Selection */}
      <div>
        <Label htmlFor="country" className="text-zinc-300 mb-1.5 block">
          Country<span className="text-rose-400 ml-0.5">*</span>
        </Label>
        <div className="relative">
          <select
            id="country"
            {...register('country')}
            className={baseSelect}
          >
            <option value="US">United States</option>
            <option value="CA">Canada</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 pointer-events-none" />
        </div>
      </div>

      {/* US-specific: Filing Status */}
      {country === 'US' && (
        <div>
          <Label htmlFor="filingStatus" className="text-zinc-300 mb-1.5 block">
            Filing Status<span className="text-rose-400 ml-0.5">*</span>
          </Label>
          <div className="relative">
            <select
              id="filingStatus"
              {...register('filingStatus')}
              className={baseSelect}
            >
              {US_FILING_STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 pointer-events-none" />
          </div>
        </div>
      )}

      {/* Canada-specific: Province */}
      {country === 'CA' && (
        <div>
          <Label htmlFor="province" className="text-zinc-300 mb-1.5 block">
            Province<span className="text-rose-400 ml-0.5">*</span>
          </Label>
          <div className="relative">
            <select
              id="province"
              {...register('province')}
              className={baseSelect}
            >
              {CA_PROVINCES.map((prov) => (
                <option key={prov.value} value={prov.value}>
                  {prov.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 pointer-events-none" />
          </div>
        </div>
      )}

      {/* Annual Revenue */}
      <div>
        <Label htmlFor="annualRevenue" className="text-zinc-300 mb-1.5 block">
          Annual Revenue (Gross)<span className="text-rose-400 ml-0.5">*</span>
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
          <Input
            id="annualRevenue"
            type="number"
            step="1"
            placeholder="75000"
            {...register('annualRevenue')}
            className={['pl-8', baseInput, errors.annualRevenue ? 'border-rose-500 focus:ring-rose-500' : ''].join(' ')}
          />
        </div>
        {errors.annualRevenue?.message && (
          <p className="text-sm text-rose-300 mt-1.5">{errors.annualRevenue.message}</p>
        )}
        <p className="text-sm text-zinc-500 mt-1.5">
          Total income from freelance/self-employment before expenses
        </p>
      </div>

      {/* Business Expenses */}
      <div>
        <Label htmlFor="businessExpenses" className="text-zinc-300 mb-1.5 block">
          Business Expenses<span className="text-rose-400 ml-0.5">*</span>
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
          <Input
            id="businessExpenses"
            type="number"
            step="1"
            placeholder="10000"
            {...register('businessExpenses')}
            className={['pl-8', baseInput, errors.businessExpenses ? 'border-rose-500 focus:ring-rose-500' : ''].join(' ')}
          />
        </div>
        {errors.businessExpenses?.message && (
          <p className="text-sm text-rose-300 mt-1.5">{errors.businessExpenses.message}</p>
        )}
        <p className="text-sm text-zinc-500 mt-1.5">
          Software, equipment, insurance, home office, etc.
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-teal-500 hover:bg-teal-400 text-zinc-950 font-semibold px-4 py-3 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
      >
        {isSubmitting ? 'Calculating...' : 'Calculate Tax Reserve'}
      </button>
    </form>
  );
}
