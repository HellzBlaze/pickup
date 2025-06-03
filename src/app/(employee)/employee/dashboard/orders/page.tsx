
"use client";

import { useState } from 'react';
import OrderViewList from '@/components/features/employee/order-view-list';
import type { Order, OrderStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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

  const handleClearAllOrders = () => {
    setOrders([]);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-headline text-primary">Order Overview</h1>
            <p className="text-muted-foreground">
                Monitor incoming and past orders. You can update order statuses or cancel them.
            </p>
        </div>
        {orders.length > 0 && (
           <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Clear All Orders
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will remove all orders from the list. This is a mock action and orders are not permanently deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearAllOrders}>Yes, Clear All</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
      
      <OrderViewList 
        orders={orders} 
        onUpdateStatus={handleUpdateStatus}
        onCancelOrder={handleCancelOrder}
      />
    </div>
  );
}
