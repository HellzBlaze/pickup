
"use client";

import { useState } from 'react';
import OrderViewList from '@/components/features/employee/order-view-list';
import type { Order, OrderStatus } from '@/types';

const initialMockOrders: Order[] = [
  { id: 'ORD001', customerName: 'Alice Wonderland', total: 1235.00, items: 2, status: 'Preparing', date: new Date(Date.now() - Math.random()*10*86400000).toISOString() },
  { id: 'ORD002', customerName: 'Bob The Builder', total: 850.50, items: 1, status: 'Out for Delivery', date: new Date(Date.now() - Math.random()*10*86400000).toISOString() },
  { id: 'ORD003', customerName: 'Charlie Brown', total: 2100.75, items: 3, status: 'Delivered', date: new Date(Date.now() - Math.random()*10*86400000).toISOString() },
  { id: 'ORD004', customerName: 'Diana Prince', total: 550.00, items: 1, status: 'Preparing', date: new Date(Date.now() - Math.random()*10*86400000).toISOString() },
  { id: 'ORD005', customerName: 'Edward Scissorhands', total: 1675.20, items: 4, status: 'Cancelled', date: new Date(Date.now() - Math.random()*10*86400000).toISOString() },
];


export default function EmployeeOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialMockOrders);

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: 'Cancelled' } : order
      )
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-headline text-primary mb-6">Order Overview</h1>
       <p className="text-muted-foreground mb-6">
        Monitor incoming and past orders. You can update order statuses or cancel them.
      </p>
      <OrderViewList 
        orders={orders} 
        onUpdateStatus={handleUpdateStatus}
        onCancelOrder={handleCancelOrder}
      />
    </div>
  );
}
