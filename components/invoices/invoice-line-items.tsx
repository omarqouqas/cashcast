'use client';

import { useCallback } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
  time_entry_id?: string; // Links to time entry if created from time tracking
}

interface InvoiceLineItemsProps {
  items: LineItem[];
  onChange: (items: LineItem[]) => void;
  currency?: string;
  className?: string;
}

function generateId(): string {
  return `item_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

function getCurrencySymbol(currency: string = 'USD'): string {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: '$',
    AUD: '$',
    JPY: '¥',
    CHF: 'CHF',
    INR: '₹',
    BRL: 'R$',
    MXN: '$',
  };
  return symbols[currency] || '$';
}

export function InvoiceLineItems({
  items,
  onChange,
  currency = 'USD',
  className,
}: InvoiceLineItemsProps) {
  const total = items.reduce((sum, item) => sum + item.amount, 0);

  const addItem = useCallback(() => {
    const newItem: LineItem = {
      id: generateId(),
      description: '',
      quantity: 1,
      unit_price: 0,
      amount: 0,
    };
    onChange([...items, newItem]);
  }, [items, onChange]);

  const updateItem = useCallback(
    (id: string, updates: Partial<LineItem>) => {
      onChange(
        items.map((item) => {
          if (item.id !== id) return item;

          const updated = { ...item, ...updates };

          // Auto-calculate amount when quantity or unit_price changes
          if ('quantity' in updates || 'unit_price' in updates) {
            updated.amount = Math.round(updated.quantity * updated.unit_price * 100) / 100;
          }

          return updated;
        })
      );
    },
    [items, onChange]
  );

  const removeItem = useCallback(
    (id: string) => {
      onChange(items.filter((item) => item.id !== id));
    },
    [items, onChange]
  );

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-zinc-300">Line Items</h3>
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-teal-400 hover:text-teal-300 hover:bg-teal-500/10 rounded-md transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Item
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-zinc-700 rounded-lg">
          <p className="text-zinc-500 text-sm">No line items yet</p>
          <button
            type="button"
            onClick={addItem}
            className="mt-2 text-sm text-teal-400 hover:text-teal-300"
          >
            Add your first item
          </button>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="hidden sm:grid sm:grid-cols-12 gap-2 px-2 text-xs text-zinc-500 uppercase tracking-wide">
            <div className="col-span-5">Description</div>
            <div className="col-span-2 text-right">Qty</div>
            <div className="col-span-2 text-right">Rate</div>
            <div className="col-span-2 text-right">Amount</div>
            <div className="col-span-1" />
          </div>

          {/* Items */}
          <div className="space-y-2">
            {items.map((item) => (
              <LineItemRow
                key={item.id}
                item={item}
                currency={currency}
                onUpdate={(updates) => updateItem(item.id, updates)}
                onRemove={() => removeItem(item.id)}
              />
            ))}
          </div>

          {/* Total */}
          <div className="flex justify-end pt-4 border-t border-zinc-700">
            <div className="flex items-center gap-4">
              <span className="text-zinc-400 font-medium">Total:</span>
              <span className="text-xl font-bold text-white">
                {formatCurrency(total, currency)}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface LineItemRowProps {
  item: LineItem;
  currency: string;
  onUpdate: (updates: Partial<LineItem>) => void;
  onRemove: () => void;
}

function LineItemRow({ item, currency, onUpdate, onRemove }: LineItemRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-3 bg-zinc-800/50 border border-zinc-700/50 rounded-lg group">
      {/* Description */}
      <div className="sm:col-span-5">
        <label className="sm:hidden text-xs text-zinc-500 mb-1 block">Description</label>
        <input
          type="text"
          value={item.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Service or product description"
          className="w-full px-3 py-2 text-sm bg-zinc-900 border border-zinc-700 rounded-md text-white placeholder:text-zinc-500 focus:outline-none focus:border-teal-500"
        />
      </div>

      {/* Quantity */}
      <div className="sm:col-span-2">
        <label className="sm:hidden text-xs text-zinc-500 mb-1 block">Quantity</label>
        <input
          type="number"
          value={item.quantity}
          onChange={(e) => onUpdate({ quantity: parseFloat(e.target.value) || 0 })}
          min="0"
          step="0.01"
          className="w-full px-3 py-2 text-sm bg-zinc-900 border border-zinc-700 rounded-md text-white text-right focus:outline-none focus:border-teal-500"
        />
      </div>

      {/* Unit Price */}
      <div className="sm:col-span-2">
        <label className="sm:hidden text-xs text-zinc-500 mb-1 block">Rate</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">{getCurrencySymbol(currency)}</span>
          <input
            type="number"
            value={item.unit_price}
            onChange={(e) => onUpdate({ unit_price: parseFloat(e.target.value) || 0 })}
            min="0"
            step="0.01"
            className="w-full pl-7 pr-3 py-2 text-sm bg-zinc-900 border border-zinc-700 rounded-md text-white text-right focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* Amount */}
      <div className="sm:col-span-2 flex items-center justify-end">
        <span className="text-white font-medium">
          {formatCurrency(item.amount, currency)}
        </span>
      </div>

      {/* Remove button */}
      <div className="sm:col-span-1 flex items-center justify-end">
        <button
          type="button"
          onClick={onRemove}
          className="p-1.5 rounded-md text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all"
          title="Remove item"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
