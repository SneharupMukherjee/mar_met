'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { dashboardRoutes } from '@/lib/routes';

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="w-full max-w-xs border-r border-slate-800 bg-slate-900/50 p-4">
      <h1 className="mb-4 text-lg font-semibold">MAR-MET Analytics</h1>
      <nav className="space-y-1">
        {dashboardRoutes.map((route) => {
          const active = pathname === route.href;
          return (
            <Link
              key={route.href}
              className={`block rounded-md px-3 py-2 text-sm transition ${
                active ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-300 hover:bg-slate-800'
              }`}
              href={route.href}
            >
              {route.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
