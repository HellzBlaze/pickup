
import EmployeeLoginForm from '@/components/features/employee/employee-login-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function EmployeeLoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline text-primary">Employee Access</CardTitle>
          <CardDescription>Enter the code to access the Antarctic Command Center.</CardDescription>
        </CardHeader>
        <CardContent>
          <EmployeeLoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
