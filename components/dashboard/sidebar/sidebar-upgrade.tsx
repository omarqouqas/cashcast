'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { SidebarTooltip } from './sidebar-tooltip';
import { trackUpgradeClicked } from '@/lib/posthog/events';

interface SidebarUpgradeProps {
  isCollapsed: boolean;
}

export function SidebarUpgrade({ isCollapsed }: SidebarUpgradeProps) {
  const handleClick = () => {
    trackUpgradeClicked({
      fromTier: 'free',
      toTier: 'pro',
      interval: 'month',
      location: 'sidebar',
    });
  };

  return (
    <div className="px-2 py-3">
      <SidebarTooltip content="Upgrade to Pro" show={isCollapsed}>
        <Link
          href="/pricing"
          onClick={handleClick}
          className={[
            'flex items-center gap-3 px-3 py-2.5 rounded-lg',
            'bg-gradient-to-r from-teal-500/10 to-emerald-500/10',
            'border border-teal-500/30',
            'text-teal-400 hover:text-teal-300',
            'transition-colors',
            isCollapsed ? 'justify-center' : '',
          ].join(' ')}
        >
          <Sparkles className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && (
            <span className="text-sm font-medium">Upgrade to Pro</span>
          )}
        </Link>
      </SidebarTooltip>
    </div>
  );
}
