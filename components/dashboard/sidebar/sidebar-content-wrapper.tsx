'use client';

import { useSidebar } from './sidebar-context';

interface SidebarContentWrapperProps {
  children: React.ReactNode;
}

export function SidebarContentWrapper({ children }: SidebarContentWrapperProps) {
  const { isCollapsed } = useSidebar();

  return (
    <div
      className={[
        'transition-all duration-200',
        isCollapsed ? 'md:ml-16' : 'md:ml-60',
      ].join(' ')}
    >
      <main
        className={[
          'px-4 sm:px-6 lg:px-8 py-8',
          'pb-[calc(5rem+env(safe-area-inset-bottom,0px))] md:pb-8',
        ].join(' ')}
      >
        {children}
      </main>
    </div>
  );
}
