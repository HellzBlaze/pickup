
import OrderViewList from '@/components/features/employee/order-view-list';

// Mock data for orders - in a real app, this would be fetched
const mockOrders: any[] = [];


export default function EmployeeOrdersPage() {
  return (
    <div>
      <h1 className="text-3xl font-headline text-primary mb-6">Order Overview</h1>
       <p className="text-muted-foreground mb-6">
        Monitor incoming and past orders. Note: This is a simplified view with mock data.
      </p>
      <OrderViewList orders={mockOrders} />
    </div>
  );
}
