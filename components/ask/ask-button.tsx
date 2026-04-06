'use client';

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AskModal } from './ask-modal';

export type AskButtonVariant = 'fab' | 'card' | 'mobile-nav' | 'nav';

export interface AskButtonProps {
  variant?: AskButtonVariant;
  className?: string;
}

export function AskButton({ variant = 'fab', className }: AskButtonProps) {
  const [open, setOpen] = useState(false);

  if (variant === 'card') {
    return (
      <>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            'w-full text-left border border-zinc-800 bg-zinc-800 rounded-lg p-6 hover:bg-zinc-700/60 transition-colors',
            'flex items-start justify-between gap-4',
            className
          )}
        >
          <div className="min-w-0">
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
              AI Assistant
            </p>
            <h3 className="mt-2 text-lg font-semibold text-zinc-100">Ask Cashcast</h3>
            <p className="mt-1 text-sm text-zinc-400">
              Ask questions about your finances in plain English.
            </p>
          </div>
          <div className="w-12 h-12 bg-violet-500/10 rounded-full flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-6 h-6 text-violet-400" />
          </div>
        </button>

        <AskModal open={open} onClose={() => setOpen(false)} />
      </>
    );
  }

  if (variant === 'mobile-nav') {
    return (
      <>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            'flex flex-col items-center justify-center h-full',
            'transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-violet-300/60 focus:ring-offset-2 focus:ring-offset-zinc-900',
            className
          )}
          aria-label="Ask AI"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="text-[11px] mt-1 font-medium">Ask AI</span>
        </button>

        <AskModal open={open} onClose={() => setOpen(false)} />
      </>
    );
  }

  if (variant === 'nav') {
    return (
      <>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            'px-3 py-2 min-h-[44px]',
            'text-sm font-medium rounded-md whitespace-nowrap',
            'transition-colors',
            'inline-flex items-center gap-2',
            open
              ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
              : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900',
            className
          )}
          aria-label="Ask AI"
          title="Ask AI about your finances"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Ask AI</span>
        </button>

        <AskModal open={open} onClose={() => setOpen(false)} />
      </>
    );
  }

  // Default: FAB variant
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          // Mobile FAB (above bottom nav) + desktop FAB
          'fixed z-40 inline-flex',
          'right-4 bottom-[calc(4rem+env(safe-area-inset-bottom,0px)+1rem)]',
          'md:right-5 md:bottom-5',
          'items-center justify-center',
          'bg-violet-500 hover:bg-violet-600 text-white font-semibold',
          'shadow-lg border border-violet-400/30',
          'w-14 h-14 rounded-full',
          'md:w-auto md:h-auto md:gap-2 md:px-4 md:py-3 md:min-h-[48px]',
          'focus:outline-none focus:ring-2 focus:ring-violet-300 focus:ring-offset-2 focus:ring-offset-zinc-900',
          className
        )}
        aria-label="Ask AI"
      >
        <MessageCircle className="w-6 h-6 md:w-5 md:h-5" />
        <span className="hidden md:inline">Ask AI</span>
      </button>

      <AskModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
