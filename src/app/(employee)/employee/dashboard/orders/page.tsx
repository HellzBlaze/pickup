
"use client";

import { useState } from 'react';
import OrderViewList from '@/components/features/employee/order-view-list';
import type { Order, OrderStatus, PaymentStatus, HistoricalDayOrders } from '@/types';
import { Button } from '@/components/ui/button';
import { Trash2, Archive } from 'lucide-react';
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
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';

const ORDER_HISTORY_LOCAL_STORAGE_KEY = 'antarticanCoOrderHistory';

const initialMockOrders: Order[] = [
  { id: 'ORD001', customerName: 'Alice Wonderland', total: 1235.00, items: 2, status: 'Waiting', paymentStatus: 'Paid (Cash)', date: new Date(Date.now() - Math.random()*10*86400000).toISOString() },
  { id: 'ORD002', customerName: 'Bob The Builder', total: 850.50, items: 1, status: 'Preparing', paymentStatus: 'Pending', date: new Date(Date.now() - Math.random()*10*86400000).toISOString() },
  { id: 'ORD003', customerName: 'Charlie Brown', total: 2100.75, items: 3, status: 'Prepared', paymentStatus: 'Paid (Cash)', date: new Date(Date.now() - Math.random()*10*86400000).toISOString() },
  { id: 'ORD004', customerName: 'Diana Prince', total: 550.00, items: 1, status: 'Served', paymentStatus: 'Paid (Online)', date: new Date(Date.now() - Math.random()*10*86400000).toISOString() },
  { id: 'ORD005', customerName: 'Edward Scissorhands', total: 1675.20, items: 4, status: 'Cancelled', paymentStatus: 'Refunded', date: new Date(Date.now() - Math.random()*10*86400000).toISOString() },
  { id: 'ORD006', customerName: 'Fiona Gallagher', total: 780.00, items: 1, status: 'Waiting', paymentStatus: 'Pending', date: new Date(Date.now() - Math.random()*10*86400000).toISOString() },
  { id: 'ORD007', customerName: 'Harry Potter', total: 1990.00, items: 2, status: 'Preparing', paymentStatus: 'Paid (Online)', date: new Date(Date.now() - Math.random()*10*86400000).toISOString() },
];


export default function EmployeeOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialMockOrders);
  const { toast } = useToast();

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const handleUpdatePaymentStatus = (orderId: string, newPaymentStatus: PaymentStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, paymentStatus: newPaymentStatus } : order
      )
    );
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: 'Cancelled', paymentStatus: (order.paymentStatus === 'Paid (Cash)' || order.paymentStatus === 'Paid (Online)') ? 'Refunded' : order.paymentStatus } : order
      )
    );
  };

  const handleClearAllOrders = () => {
    setOrders([]);
     toast({ title: "Current Orders Cleared", description: "All active orders have been removed from the view." });
  };

  const handleArchiveOrders = () => {
    if (orders.length === 0) {
      toast({
        title: "No Orders to Archive",
        description: "There are no current orders to move to history.",
      });
      return;
    }

    const todayDateString = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD

    try {
      let history: HistoricalDayOrders[] = [];
      const storedHistory = localStorage.getItem(ORDER_HISTORY_LOCAL_STORAGE_KEY);
      if (storedHistory) {
        try {
          history = JSON.parse(storedHistory);
          if (!Array.isArray(history)) history = []; // Ensure it's an array
        } catch (e) {
          console.error("Error parsing stored history:", e);
          history = []; // Reset if parsing fails
        }
      }

      const updatedHistory = history.filter(day => day.date !== todayDateString);
      updatedHistory.push({ date: todayDateString, orders: [...orders] });
      updatedHistory.sort((a, b) => b.date.localeCompare(a.date));

      localStorage.setItem(ORDER_HISTORY_LOCAL_STORAGE_KEY, JSON.stringify(updatedHistory));
      const archivedCount = orders.length;
      setOrders([]); 
      toast({
        title: "Orders Archived",
        description: `All ${archivedCount} current order(s) have been archived for ${todayDateString}.`,
      });
    } catch (error) {
      console.error("Failed to archive orders to localStorage:", error);
      toast({
        title: "Archival Failed",
        description: "Could not save orders to history. LocalStorage might be full or unavailable.",
        variant: "destructive",
      });
    }
  };


  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
            <h1 className="text-3xl font-headline text-primary">Order Overview</h1>
            <p className="text-muted-foreground">
                Monitor incoming and past orders. You can update order statuses, payment statuses, or cancel them.
            </p>
        </div>
        <div className="flex gap-2 flex-wrap">
            <Button onClick={handleArchiveOrders} variant="outline">
              <Archive className="mr-2 h-4 w-4" /> Archive Current Orders
            </Button>
            {orders.length > 0 && (
            <AlertDialog>
                <AlertDialogTrigger asChild>
                <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" /> Clear Current Orders
                </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                    This action will remove all current orders from this list. Orders need to be archived manually to be saved.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearAllOrders}>Yes, Clear Current</AlertDialogAction>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            )}
        </div>
      </div>
      
      <OrderViewList 
        orders={orders} 
        onUpdateStatus={handleUpdateStatus}
        onUpdatePaymentStatus={handleUpdatePaymentStatus}
        onCancelOrder={handleCancelOrder}
      />
    </div>
  );
}
