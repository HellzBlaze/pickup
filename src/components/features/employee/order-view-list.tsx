
"use client";

import type { Order, OrderStatus, PaymentStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, parseISO } from 'date-fns';
import { PackageCheck, PackageSearch, CheckCircle2, XCircle, type LucideIcon, Ban, Hourglass, BellRing, Clock, BadgeCheck, CircleSlash, AlertTriangle } from 'lucide-react';

interface OrderViewListProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
  onUpdatePaymentStatus: (orderId: string, newPaymentStatus: PaymentStatus) => void;
  onCancelOrder: (orderId: string) => void;
}

const orderStatusOptions: OrderStatus[] = ['Waiting', 'Preparing', 'Prepared', 'Served'];
const paymentStatusOptions: PaymentStatus[] = ['Pending', 'Paid', 'Failed', 'Refunded'];

const orderStatusConfig: Record<OrderStatus, { Icon: LucideIcon, colorClasses: string, badgeVariant: "default" | "secondary" | "destructive" | "outline" }> = {
    'Waiting': { Icon: Hourglass, colorClasses: 'text-orange-500 dark:text-orange-400', badgeVariant: 'outline' },
    'Preparing': { Icon: PackageSearch, colorClasses: 'text-yellow-500 dark:text-yellow-400', badgeVariant: 'outline' },
    'Prepared': { Icon: BellRing, colorClasses: 'text-teal-500 dark:text-teal-400', badgeVariant: 'default'},
    'Served': { Icon: PackageCheck, colorClasses: 'text-green-500 dark:text-green-400', badgeVariant: 'secondary' },
    'Cancelled': { Icon: Ban, colorClasses: 'text-red-600 dark:text-red-500', badgeVariant: 'destructive'}
};

const paymentStatusConfig: Record<PaymentStatus, { Icon: LucideIcon, colorClasses: string, badgeVariant: "default" | "secondary" | "destructive" | "outline" }> = {
    'Pending': { Icon: Clock, colorClasses: 'text-yellow-600 dark:text-yellow-500', badgeVariant: 'outline' },
    'Paid': { Icon: BadgeCheck, colorClasses: 'text-green-600 dark:text-green-500', badgeVariant: 'secondary' },
    'Failed': { Icon: AlertTriangle, colorClasses: 'text-red-600 dark:text-red-500', badgeVariant: 'destructive'},
    'Refunded': { Icon: CircleSlash, colorClasses: 'text-purple-600 dark:text-purple-500', badgeVariant: 'default'}
};


export default function OrderViewList({ orders, onUpdateStatus, onUpdatePaymentStatus, onCancelOrder }: OrderViewListProps) {
  if (!orders || orders.length === 0) {
    return (
      <Card className="text-center py-12 shadow-md">
        <CardHeader>
            <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <CardTitle className="text-2xl font-headline text-primary">All Clear!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No orders to display at the moment. Looks like the penguins are hibernating!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
        <CardHeader>
            <CardTitle className="text-xl md:text-2xl font-semibold text-secondary">Recent Orders</CardTitle>
            <CardDescription>Overview of customer orders and their current status. Changes are mock and not persisted.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-center">Items</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Order Status</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {orders.map((order) => {
                    const { Icon: OrderIcon, colorClasses: orderColorClasses, badgeVariant: orderBadgeVariant } = orderStatusConfig[order.status];
                    const { Icon: PaymentIcon, colorClasses: paymentColorClasses, badgeVariant: paymentBadgeVariant } = paymentStatusConfig[order.paymentStatus];
                    const isOrderActionDisabled = order.status === 'Served' || order.status === 'Cancelled';
                    const isPaymentActionDisabled = order.status === 'Cancelled' || order.paymentStatus === 'Refunded';

                    return (
                    <TableRow key={order.id}>
                        <TableCell className="font-medium text-primary whitespace-nowrap">{order.id}</TableCell>
                        <TableCell className="whitespace-nowrap">{order.customerName}</TableCell>
                        <TableCell className="whitespace-nowrap">{format(parseISO(order.date), 'PPp')}</TableCell>
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
                        <TableCell className="text-right space-x-1 whitespace-nowrap">
                            <Select
                                value={order.status}
                                onValueChange={(newStatus) => onUpdateStatus(order.id, newStatus as OrderStatus)}
                                disabled={isOrderActionDisabled}
                            >
                                <SelectTrigger className="h-8 w-[120px] text-xs inline-flex" disabled={isOrderActionDisabled}>
                                    <SelectValue placeholder="Order" />
                                </SelectTrigger>
                                <SelectContent>
                                {orderStatusOptions.map(opt => (
                                    <SelectItem key={`order-${opt}`} value={opt} className="text-xs">
                                        {opt}
                                    </SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                            <Select
                                value={order.paymentStatus}
                                onValueChange={(newStatus) => onUpdatePaymentStatus(order.id, newStatus as PaymentStatus)}
                                disabled={isPaymentActionDisabled}
                            >
                                <SelectTrigger className="h-8 w-[110px] text-xs inline-flex" disabled={isPaymentActionDisabled}>
                                    <SelectValue placeholder="Payment" />
                                </SelectTrigger>
                                <SelectContent>
                                {paymentStatusOptions.map(opt => (
                                    <SelectItem key={`payment-${opt}`} value={opt} className="text-xs">
                                        {opt}
                                    </SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => onCancelOrder(order.id)}
                                disabled={isOrderActionDisabled}
                                className="h-8 text-xs px-2"
                            >
                                <XCircle className="mr-1 h-3.5 w-3.5 sm:mr-1.5" />
                                <span className="hidden sm:inline">Cancel Order</span>
                                <span className="sm:hidden">Cancel</span>
                            </Button>
                        </TableCell>
                    </TableRow>
                    );
                })}
                </TableBody>
            </Table>
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground">Displaying {orders.length} orders. Order modifications are for demonstration and not persisted.</p>
        </CardFooter>
    </Card>
  );
}

