
import OrderViewList from '@/components/features/employee/order-view-list';

// Mock data for orders - in a real app, this would be fetched
const mockOrders = [
  { id: 'ORD001', customerName: 'Captain Frosty', total: 35.99, items: 3, status: 'Preparing' as const, date: new Date(Date.now() - 3600000).toISOString() },
  { id: 'ORD002', customerName: 'Penguin Pete', total: 12.50, items: 1, status: 'Out for Delivery' as const, date: new Date(Date.now() - 7200000).toISOString() },
  { id: 'ORD003', customerName: 'Aurora Borealis', total: 22.75, items: 2, status: 'Delivered' as const, date: new Date(Date.now() - 86400000).toISOString() },
];


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
