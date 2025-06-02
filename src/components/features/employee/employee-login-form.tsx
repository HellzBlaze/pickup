
"use client";

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { KeyRound, LogIn } from 'lucide-react';

const ACCESS_CODE = '2724';
const EMPLOYEE_AUTH_KEY = 'antartican_co_eats_employee_authed';

export default function EmployeeLoginForm() {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    // Simulate check
    setTimeout(() => {
      if (code === ACCESS_CODE) {
        try {
            sessionStorage.setItem(EMPLOYEE_AUTH_KEY, 'true');
            toast({ title: 'Access Granted!', description: 'Welcome, valued employee.' });
            router.push('/employee/dashboard');
        } catch (error) {
            console.error("SessionStorage not available:", error);
            toast({ title: 'Login Error', description: 'Could not save session. Please enable cookies/storage.', variant: 'destructive'});
        }
      } else {
        toast({ title: 'Access Denied', description: 'Incorrect code. Please try again.', variant: 'destructive' });
        setCode('');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="access-code" className="flex items-center">
            <KeyRound className="mr-2 h-4 w-4 text-muted-foreground"/>
            Access Code
        </Label>
        <Input
          id="access-code"
          type="password"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter your secret code"
          required
          className="text-center text-lg tracking-widest"
        />
      </div>
      <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
        <LogIn className="mr-2 h-5 w-5"/>
        {isLoading ? 'Verifying...' : 'Enter Command Center'}
      </Button>
    </form>
  );
}
