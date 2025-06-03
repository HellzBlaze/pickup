
"use client";

import { useEffect, useState } from 'react';
import type { Order, HistoricalDayOrders } from '@/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, ArchiveRestore, PackageCheck, PackageSearch, CheckCircle2, XCircle, Ban, Hourglass, BellRing, Clock, BadgeCheck, CircleSlash, CreditCard, type LucideIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';
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

const orderStatusConfig: Record<OrderStatus, { Icon: LucideIcon, colorClasses: string, badgeVariant: "default" | "secondary" | "destructive" | "outline" }> = {
    'Waiting': { Icon: Hourglass, colorClasses: 'text-orange-500 dark:text-orange-400', badgeVariant: 'outline' },
    'Preparing': { Icon: PackageSearch, colorClasses: 'text-yellow-500 dark:text-yellow-400', badgeVariant: 'outline' },
    'Prepared': { Icon: BellRing, colorClasses: 'text-teal-500 dark:text-teal-400', badgeVariant: 'default'},
    'Served': { Icon: PackageCheck, colorClasses: 'text-green-500 dark:text-green-400', badgeVariant: 'secondary' },
    'Cancelled': { Icon: Ban, colorClasses: 'text-red-600 dark:text-red-500', badgeVariant: 'destructive'}
};

const paymentStatusConfig: Record<PaymentStatus, { Icon: LucideIcon, colorClasses: string, badgeVariant: "default" | "secondary" | "destructive" | "outline" }> = {
    'Pending': { Icon: Clock, colorClasses: 'text-yellow-600 dark:text-yellow-500', badgeVariant: 'outline' },
    'Paid (Cash)': { Icon: BadgeCheck, colorClasses: 'text-green-600 dark:text-green-500', badgeVariant: 'secondary' },
    'Paid (Online)': { Icon: CreditCard, colorClasses: 'text-green-600 dark:text-green-500', badgeVariant: 'secondary' },
    'Refunded': { Icon: CircleSlash, colorClasses: 'text-purple-600 dark:text-purple-500', badgeVariant: 'default'}
};

export default function OrderHistoryPage() {
  const [historicalOrders, setHistoricalOrders] = useState<HistoricalDayOrders[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    try {
      const storedHistory = localStorage.getItem(ORDER_HISTORY_LOCAL_STORAGE_KEY);
      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory);
        if (Array.isArray(parsedHistory)) {
          setHistoricalOrders(parsedHistory);
        } else {
          setHistoricalOrders([]); // In case of malformed data
        }
      }
    } catch (error) {
      console.error("Could not access localStorage or parse history:", error);
      toast({
        title: "Error loading history",
        description: "Could not load order history from local storage.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }, [toast]);

  const handleClearAllHistory = () => {
    try {
      localStorage.removeItem(ORDER_HISTORY_LOCAL_STORAGE_KEY);
      setHistoricalOrders([]);
      toast({ title: "Order History Cleared", description: "All historical order data has been removed." });
    } catch (error) {
      console.error("Could not clear history from localStorage:", error);
      toast({
        title: "Error Clearing History",
        description: "Could not remove history from local storage.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Hourglass className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-muted-foreground">Loading order history...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-headline text-primary">Order History</h1>
          <p className="text-muted-foreground">
            View orders archived on previous days. This data is stored in your browser.
          </p>
        </div>
        {historicalOrders.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Clear All History
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will permanently delete all archived order history from your browser. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearAllHistory}>Yes, Clear All History</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {historicalOrders.length === 0 ? (
        <Card className="text-center py-12 shadow-md">
          <CardHeader className="items-center">
            <ArchiveRestore className="h-16 w-16 text-muted-foreground mb-4" />
            <CardTitle className="text-2xl font-headline text-primary">No History Yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">There are no archived orders to display. Use the "Archive" button on the Orders page.</p>
          </CardContent>
        </Card>
      ) : (
        <Accordion type="multiple" className="w-full space-y-4">
          {historicalOrders.map((dayEntry) => (
            <AccordionItem value={dayEntry.date} key={dayEntry.date} className="bg-card border rounded-lg shadow-sm">
              <AccordionTrigger className="p-4 hover:no-underline text-left">
                <div className="flex justify-between w-full items-center">
                  <span className="text-lg font-semibold text-secondary">
                    Archived Orders for: {format(parseISO(dayEntry.date), 'PPP')}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {dayEntry.orders.length} order(s)
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-0">
                <div className="overflow-x-auto p-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Original Date</TableHead>
                        <TableHead className="text-center">Items</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead>Order Status</TableHead>
                        <TableHead>Payment Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dayEntry.orders.map((order) => {
                        const { Icon: OrderIcon, colorClasses: orderColorClasses, badgeVariant: orderBadgeVariant } = orderStatusConfig[order.status] || orderStatusConfig['Waiting'];
                        const paymentConfigEntry = paymentStatusConfig[order.paymentStatus] || paymentStatusConfig['Pending'];
                        const { Icon: PaymentIcon, colorClasses: paymentColorClasses, badgeVariant: paymentBadgeVariant } = paymentConfigEntry;
                        return (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium text-primary whitespace-nowrap">{order.id}</TableCell>
                            <TableCell className="whitespace-nowrap">{order.customerName}</TableCell>
                            <TableCell className="whitespace-nowrap">{format(parseISO(order.date), 'Pp')}</TableCell>
                            <TableCell className="text-center">{order.items}</TableCell>
                            <TableCell className="text-right">₹{order.total.toFixed(2)}</TableCell>
                            <TableCell className="whitespace-nowrap">
                                <Badge variant={orderBadgeVariant} className="capitalize text-xs">
                                    <OrderIcon className={`mr-1.5 h-3.5 w-3.5 ${orderColorClasses}`} />
                                    {order.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                                <Badge variant={paymentBadgeVariant} className="capitalize text-xs">
                                    <PaymentIcon className={`mr-1.5 h-3.5 w-3.5 ${paymentColorClasses}`} />
                                    {order.paymentStatus}
                                </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
