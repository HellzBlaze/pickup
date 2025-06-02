
"use client"

import type { ReactNode }from 'react';
import EmployeeAuthWrapper from '@/components/features/employee/employee-auth-wrapper';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogOut, Utensils, ShoppingBag, Home } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const EmployeeDashboardSidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { href: "/employee/dashboard", label: "Menu Management", icon: Utensils },
    { href: "/employee/dashboard/orders", label: "View Orders", icon: ShoppingBag },
  ];

  return (
    <aside className="w-64 bg-card p-4 border-r flex flex-col space-y-4 shrink-0">
      <h2 className="text-2xl font-headline text-primary mb-4 border-b pb-2">Dashboard</h2>
      <nav className="flex-grow space-y-1">
        {navItems.map(item => (
            <Button 
                key={item.href}
                variant="ghost" 
                className={cn(
                    "w-full justify-start text-sm",
                    pathname === item.href ? "bg-accent text-accent-foreground hover:bg-accent/90" : "hover:bg-muted/50"
                )} 
                asChild
            >
            <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" /> {item.label}
            </Link>
            </Button>
        ))}
      </nav>
      <div className="mt-auto space-y-2 pt-4 border-t">
         <Button variant="outline" className="w-full justify-start" asChild>
            <Link href="/">
                <Home className="mr-2 h-4 w-4" /> Back to Main Site
            </Link>
        </Button>
        <Button variant="destructive" className="w-full justify-start" onClick={() => {
            try { sessionStorage.removeItem('antartican_co_eats_employee_authed'); } catch (e) {}
            window.location.href = '/employee/login'; // Force reload to clear state
        }}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </div>
    </aside>
  );
};


export default function EmployeeDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <EmployeeAuthWrapper>
      <div className="flex min-h-screen bg-background">
        <EmployeeDashboardSidebar />
        <main className="flex-grow p-6 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </EmployeeAuthWrapper>
  );
}
