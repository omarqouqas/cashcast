'use client';

import { useState } from 'react';
import { MessageCircle, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AskModal } from './ask-modal';
import { UpgradePrompt } from '@/components/subscription/upgrade-prompt';
import { useSubscription } from '@/lib/hooks/use-subscription';

export type AskButtonVariant = 'fab' | 'card' | 'mobile-nav' | 'nav';

export interface AskButtonProps {
  variant?: AskButtonVariant;
  className?: string;
}

export function AskButton({ variant = 'fab', className }: AskButtonProps) {
  const [open, setOpen] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const { tier, isLoading } = useSubscription();

  // Check if user has Pro access (pro, premium, or lifetime)
  const hasProAccess = tier === 'pro' || tier === 'premium' || tier === 'lifetime';

  const handleClick = () => {
    if (hasProAccess) {
      setOpen(true);
    } else {
      setShowUpgrade(true);
    }
  };

  if (variant === 'card') {
    return (
      <>
        <button
          type="button"
          onClick={handleClick}
          disabled={isLoading}
          className={cn(
            'w-full text-left border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 rounded-lg p-6 hover:bg-zinc-50 dark:hover:bg-zinc-700/60 transition-colors',
            'flex items-start justify-between gap-4',
            !hasProAccess && 'opacity-80',
            className
          )}
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">
                AI Assistant
              </p>
              {!hasProAccess && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/10 px-2 py-0.5 rounded-full">
                  <Lock className="w-3 h-3" />
                  Pro
                </span>
              )}
            </div>
            <h3 className="mt-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Ask Cashcast</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Ask questions about your finances in plain English.
            </p>
          </div>
          <div className="w-12 h-12 bg-violet-500/10 rounded-full flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-6 h-6 text-violet-400" />
          </div>
        </button>

        {hasProAccess && <AskModal open={open} onClose={() => setOpen(false)} />}
        <UpgradePrompt
          isOpen={showUpgrade}
          onClose={() => setShowUpgrade(false)}
          feature="ai"
        />
      </>
    );
  }

  if (variant === 'mobile-nav') {
    return (
      <>
        <button
          type="button"
          onClick={handleClick}
          disabled={isLoading}
          className={cn(
            'flex flex-col items-center justify-center h-full relative',
            'transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-violet-300/60 focus:ring-offset-2 focus:ring-offset-zinc-900',
            className
          )}
          aria-label="Ask AI"
        >
          <div className="relative">
            <MessageCircle className="w-6 h-6" />
            {!hasProAccess && (
              <Lock className="w-3 h-3 absolute -top-1 -right-1 text-amber-400" />
            )}
          </div>
          <span className="text-[11px] mt-1 font-medium">Ask AI</span>
        </button>

        {hasProAccess && <AskModal open={open} onClose={() => setOpen(false)} />}
        <UpgradePrompt
          isOpen={showUpgrade}
          onClose={() => setShowUpgrade(false)}
          feature="ai"
        />
      </>
    );
  }

  if (variant === 'nav') {
    return (
      <>
        <button
          type="button"
          onClick={handleClick}
          disabled={isLoading}
          className={cn(
            'px-3 py-2 min-h-[44px]',
            'text-sm font-medium rounded-md whitespace-nowrap',
            'transition-colors',
            'inline-flex items-center gap-2',
            open
              ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900',
            className
          )}
          aria-label="Ask AI"
          title={hasProAccess ? 'Ask AI about your finances' : 'Ask AI (Pro feature)'}
        >
          <div className="relative">
            <MessageCircle className="w-4 h-4" />
            {!hasProAccess && (
              <Lock className="w-2.5 h-2.5 absolute -top-1 -right-1 text-amber-400" />
            )}
          </div>
          <span>Ask AI</span>
          {!hasProAccess && (
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/10 px-1.5 py-0.5 rounded">
              Pro
            </span>
          )}
        </button>

        {hasProAccess && <AskModal open={open} onClose={() => setOpen(false)} />}
        <UpgradePrompt
          isOpen={showUpgrade}
          onClose={() => setShowUpgrade(false)}
          feature="ai"
        />
      </>
    );
  }

  // Default: FAB variant
  // Positioned to the LEFT of the ScenarioButton FAB on pages that have both
  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        className={cn(
          // Mobile FAB (above bottom nav) + desktop FAB
          // Offset to the left of ScenarioButton ("Can I Afford It?") which is at right-5
          'fixed z-40 inline-flex',
          'right-20 bottom-[calc(4rem+env(safe-area-inset-bottom,0px)+1rem)]',
          'md:right-[13.5rem] md:bottom-5',
          'items-center justify-center',
          hasProAccess
            ? 'bg-violet-500 hover:bg-violet-600'
            : 'bg-violet-500/80 hover:bg-violet-600/80',
          'text-white font-semibold',
          'shadow-lg border border-violet-400/30',
          'w-14 h-14 rounded-full',
          'md:w-auto md:h-auto md:gap-2 md:px-4 md:py-3 md:min-h-[48px]',
          'focus:outline-none focus:ring-2 focus:ring-violet-300 focus:ring-offset-2 focus:ring-offset-zinc-900',
          className
        )}
        aria-label={hasProAccess ? 'Ask AI' : 'Ask AI (Pro feature)'}
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6 md:w-5 md:h-5" />
          {!hasProAccess && (
            <Lock className="w-3 h-3 absolute -top-1 -right-1 text-amber-200" />
          )}
        </div>
        <span className="hidden md:inline">Ask AI</span>
        {!hasProAccess && (
          <span className="hidden md:inline text-xs font-medium bg-amber-500/20 px-1.5 py-0.5 rounded">
            Pro
          </span>
        )}
      </button>

      {hasProAccess && <AskModal open={open} onClose={() => setOpen(false)} />}
      <UpgradePrompt
        isOpen={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        feature="ai"
      />
    </>
  );
}
