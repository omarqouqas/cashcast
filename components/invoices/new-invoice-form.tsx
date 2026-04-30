'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, List, DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Label } from '@/components/ui/label';
import { createInvoiceWithLineItems } from '@/lib/actions/invoices';
import { markAsInvoiced } from '@/lib/actions/time-entries';
import { showError, showSuccess } from '@/lib/toast';
import { optionalEmailSchema } from '@/lib/validations/email';
import { trackInvoiceCreated } from '@/lib/posthog/events';
import { InvoiceLineItems, type LineItem } from './invoice-line-items';
import { cn } from '@/lib/utils';

const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'CAD', label: 'CAD ($)' },
  { value: 'AUD', label: 'AUD ($)' },
  { value: 'JPY', label: 'JPY (¥)' },
  { value: 'CHF', label: 'CHF' },
  { value: 'INR', label: 'INR (₹)' },
  { value: 'BRL', label: 'BRL (R$)' },
  { value: 'MXN', label: 'MXN ($)' },
];

const invoiceSchema = z.object({
  invoice_number: z
    .string()
    .max(50, 'Invoice number too long')
    .optional()
    .or(z.literal('')),
  client_name: z.string().min(1, 'Client name is required').max(100, 'Name too long'),
  client_email: optionalEmailSchema,
  amount: z.coerce
    .number({
      required_error: 'Amount is required',
      invalid_type_error: 'Amount must be a number',
    })
    .nonnegative('Amount must be zero or positive'),
  currency: z.string().min(1, 'Currency is required'),
  due_date: z
    .string()
    .min(1, 'Due date is required')
    .refine((dateStr) => {
      const dueDate = new Date(dateStr);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return dueDate >= today;
    }, 'Due date cannot be in the past'),
  description: z.string().max(2000, 'Description too long').optional(),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

function defaultDueDateString() {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString().slice(0, 10);
}

interface NewInvoiceFormProps {
  defaultCurrency?: string;
  prefilledLineItems?: LineItem[];
  prefilledClientName?: string;
  timeEntryIds?: string[]; // IDs of time entries to mark as invoiced
}

export function NewInvoiceForm({
  defaultCurrency = 'USD',
  prefilledLineItems,
  prefilledClientName,
  timeEntryIds,
}: NewInvoiceFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Invoice mode: 'simple' (single amount) or 'itemized' (line items)
  const [mode, setMode] = useState<'simple' | 'itemized'>(
    prefilledLineItems && prefilledLineItems.length > 0 ? 'itemized' : 'simple'
  );
  const [lineItems, setLineItems] = useState<LineItem[]>(prefilledLineItems || []);

  const defaultDueDate = useMemo(() => defaultDueDateString(), []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      due_date: defaultDueDate,
      currency: defaultCurrency,
      client_name: prefilledClientName || '',
      amount: 0,
    },
  });

  const currency = watch('currency');

  // Update amount when line items change (in itemized mode)
  useEffect(() => {
    if (mode === 'itemized') {
      const total = lineItems.reduce((sum, item) => sum + item.amount, 0);
      setValue('amount', Math.round(total * 100) / 100);
    }
  }, [lineItems, mode, setValue]);

  const setPaymentTerm = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    setValue('due_date', d.toISOString().slice(0, 10));
  };

  const onSubmit = async (data: InvoiceFormData) => {
    // Validate line items in itemized mode
    if (mode === 'itemized') {
      if (lineItems.length === 0) {
        showError('Please add at least one line item');
        return;
      }

      const hasEmptyDescription = lineItems.some((item) => !item.description.trim());
      if (hasEmptyDescription) {
        showError('All line items need a description');
        return;
      }

      const total = lineItems.reduce((sum, item) => sum + item.amount, 0);
      if (total <= 0) {
        showError('Invoice total must be greater than zero');
        return;
      }
    } else {
      // Simple mode validation
      if (!data.amount || data.amount <= 0) {
        showError('Amount must be greater than zero');
        return;
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await createInvoiceWithLineItems({
        invoice_number: data.invoice_number ? data.invoice_number.trim() : null,
        client_name: data.client_name,
        client_email: data.client_email ? data.client_email : null,
        amount: data.amount,
        currency: data.currency,
        due_date: data.due_date,
        description: data.description ? data.description : null,
        line_items: mode === 'itemized' ? lineItems.map((item, index) => ({
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          amount: item.amount,
          sort_order: index,
          time_entry_id: item.time_entry_id || null,
        })) : undefined,
      });

      // Mark time entries as invoiced if we have any
      if (timeEntryIds && timeEntryIds.length > 0) {
        await markAsInvoiced(timeEntryIds, result.id);
      }

      trackInvoiceCreated({
        amount: data.amount,
        hasLineItems: mode === 'itemized',
        lineItemCount: mode === 'itemized' ? lineItems.length : 0,
      });
      showSuccess('Invoice created');
      router.refresh();
      router.push('/dashboard/invoices');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Something went wrong';
      showError(message);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/dashboard/invoices"
        className="inline-flex items-center text-sm text-zinc-400 hover:text-teal-400 transition-colors group mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Invoices
      </Link>

      <h1 className="text-2xl font-bold text-zinc-100 mb-6">Create Invoice</h1>

      <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Invoice number */}
          <div>
            <Label htmlFor="invoice_number" className="text-zinc-300 mb-1.5 block">
              Invoice number <span className="text-zinc-500">(optional)</span>
            </Label>
            <Input
              id="invoice_number"
              placeholder="Leave blank to auto-generate (e.g., INV-0007)"
              {...register('invoice_number')}
              className={errors.invoice_number ? 'border-rose-500 focus:ring-rose-500' : undefined}
            />
            {errors.invoice_number?.message && (
              <p className="text-sm text-rose-400 mt-1.5">{errors.invoice_number.message}</p>
            )}
          </div>

          {/* Client name */}
          <div>
            <Label htmlFor="client_name" className="text-zinc-300 mb-1.5 block">
              Client name<span className="text-rose-400 ml-0.5">*</span>
            </Label>
            <Input
              id="client_name"
              placeholder="e.g., Acme Inc."
              {...register('client_name')}
              className={errors.client_name ? 'border-rose-500 focus:ring-rose-500' : undefined}
            />
            {errors.client_name?.message && (
              <p className="text-sm text-rose-400 mt-1.5">{errors.client_name.message}</p>
            )}
          </div>

          {/* Client email */}
          <div>
            <Label htmlFor="client_email" className="text-zinc-300 mb-1.5 block">
              Client email <span className="text-zinc-500">(optional)</span>
            </Label>
            <Input
              id="client_email"
              type="email"
              placeholder="e.g., billing@acme.com"
              {...register('client_email')}
              className={errors.client_email ? 'border-rose-500 focus:ring-rose-500' : undefined}
            />
            {errors.client_email?.message && (
              <p className="text-sm text-rose-400 mt-1.5">{errors.client_email.message}</p>
            )}
          </div>

          {/* Invoice type toggle */}
          <div>
            <Label className="text-zinc-300 mb-2 block">Invoice type</Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMode('simple')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-colors',
                  mode === 'simple'
                    ? 'bg-teal-500/20 border-teal-500/50 text-teal-300'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300'
                )}
              >
                <DollarSign className="h-4 w-4" />
                Simple
              </button>
              <button
                type="button"
                onClick={() => setMode('itemized')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-colors',
                  mode === 'itemized'
                    ? 'bg-teal-500/20 border-teal-500/50 text-teal-300'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300'
                )}
              >
                <List className="h-4 w-4" />
                Itemized
              </button>
            </div>
            <p className="text-xs text-zinc-500 mt-2">
              {mode === 'simple'
                ? 'Enter a single total amount'
                : 'Add individual line items for detailed billing'}
            </p>
          </div>

          {/* Amount (Simple mode) or Line Items (Itemized mode) */}
          {mode === 'simple' ? (
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <Label htmlFor="amount" className="text-zinc-300 mb-1.5 block">
                  Amount<span className="text-rose-400 ml-0.5">*</span>
                </Label>
                <Controller
                  name="amount"
                  control={control}
                  render={({ field }) => (
                    <CurrencyInput
                      id="amount"
                      placeholder="0.00"
                      value={field.value}
                      onChange={field.onChange}
                      className={[
                        'bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500',
                        'focus:border-teal-500 focus:ring-teal-500/20',
                        errors.amount ? 'border-rose-500 focus:ring-rose-500' : '',
                      ].join(' ')}
                    />
                  )}
                />
                {errors.amount?.message && (
                  <p className="text-sm text-rose-400 mt-1.5">{errors.amount.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="currency" className="text-zinc-300 mb-1.5 block">
                  Currency
                </Label>
                <select
                  id="currency"
                  {...register('currency')}
                  className={[
                    'w-full h-10 bg-zinc-800 border border-zinc-700 rounded-md px-3 text-zinc-100',
                    'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent',
                    errors.currency ? 'border-rose-500 focus:ring-rose-500' : '',
                  ].join(' ')}
                >
                  {CURRENCY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-end">
                <div>
                  <Label htmlFor="currency" className="text-zinc-300 mb-1.5 block">
                    Currency
                  </Label>
                  <select
                    id="currency"
                    {...register('currency')}
                    className="w-32 h-10 bg-zinc-800 border border-zinc-700 rounded-md px-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    {CURRENCY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <InvoiceLineItems
                items={lineItems}
                onChange={setLineItems}
                currency={currency}
              />
            </div>
          )}

          {/* Due date */}
          <div>
            <Label htmlFor="due_date" className="text-zinc-300 mb-1.5 block">
              Due date<span className="text-rose-400 ml-0.5">*</span>
            </Label>
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => setPaymentTerm(15)}
                className="px-3 py-1.5 text-xs font-medium bg-zinc-800 border border-zinc-700 text-zinc-300 rounded hover:bg-zinc-700 hover:text-teal-400 hover:border-teal-500/30 transition-colors"
              >
                Net-15
              </button>
              <button
                type="button"
                onClick={() => setPaymentTerm(30)}
                className="px-3 py-1.5 text-xs font-medium bg-zinc-800 border border-zinc-700 text-zinc-300 rounded hover:bg-zinc-700 hover:text-teal-400 hover:border-teal-500/30 transition-colors"
              >
                Net-30
              </button>
              <button
                type="button"
                onClick={() => setPaymentTerm(60)}
                className="px-3 py-1.5 text-xs font-medium bg-zinc-800 border border-zinc-700 text-zinc-300 rounded hover:bg-zinc-700 hover:text-teal-400 hover:border-teal-500/30 transition-colors"
              >
                Net-60
              </button>
            </div>
            <Input
              id="due_date"
              type="date"
              {...register('due_date')}
              className={[
                'cursor-pointer [color-scheme:dark]',
                errors.due_date ? 'border-rose-500 focus:ring-rose-500' : '',
              ].join(' ')}
            />
            {errors.due_date?.message && (
              <p className="text-sm text-rose-400 mt-1.5">{errors.due_date.message}</p>
            )}
            <p className="text-sm text-zinc-400 mt-1.5">Quick select payment terms or choose a custom date.</p>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-zinc-300 mb-1.5 block">
              Notes <span className="text-zinc-500">(optional)</span>
            </Label>
            <textarea
              id="description"
              rows={3}
              {...register('description')}
              className={[
                'w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-zinc-100',
                'placeholder:text-zinc-500',
                'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent',
                'min-h-[72px]',
                errors.description ? 'border-rose-500 focus:ring-rose-500' : '',
              ].join(' ')}
              placeholder="Payment terms, thank you notes, etc."
            />
            {errors.description?.message && (
              <p className="text-sm text-rose-400 mt-1.5">{errors.description.message}</p>
            )}
          </div>

          {error && <p className="text-sm text-rose-400">{error}</p>}

          <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => router.push('/dashboard/invoices')}
              disabled={isLoading}
              className="w-full bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-zinc-100 font-medium rounded-md px-4 py-2.5 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-md px-4 py-2.5 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Creating...' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
