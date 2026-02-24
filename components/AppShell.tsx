import { ReactNode } from 'react';
import { SidebarNav } from '@/components/SidebarNav';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen lg:flex">
      <SidebarNav />
      <main className="flex-1 p-6">
        <div className="mb-4 rounded-lg border border-amber-700/40 bg-amber-900/20 p-3 text-xs text-amber-200">
          Synthetic demo data only. Not actual business performance. This disclaimer is shown across all pages in the
          app shell.
        </div>
        {children}
      </main>
    </div>
  );
}
