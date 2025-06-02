
"use client";

import type { ReactNode} from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const EMPLOYEE_AUTH_KEY = 'antartican_co_employee_authed';

export default function EmployeeAuthWrapper({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    try {
        const isAuthed = sessionStorage.getItem(EMPLOYEE_AUTH_KEY) === 'true';
        if (!isAuthed) {
            router.replace('/employee/login');
        } else {
            setIsVerifying(false);
        }
    } catch (error) {
        console.error("SessionStorage not available, redirecting to login:", error);
        router.replace('/employee/login'); // Fallback if sessionStorage is blocked/unavailable
    }
  }, [router]);

  if (isVerifying) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Verifying access credentials...</p>
      </div>
    );
  }

  return <>{children}</>;
}
