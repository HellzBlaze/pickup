
import type { ReactNode } from 'react';
import AppHeader from '@/components/layout/app-header';
import AppFooter from '@/components/layout/app-footer';

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <AppFooter />
    </div>
  );
}
