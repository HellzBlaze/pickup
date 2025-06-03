
"use client";

import type { Order, OrderStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, parseISO } from 'date-fns';
import { PackageCheck, PackageSearch, CheckCircle2, XCircle, type LucideIcon, Ban, Hourglass, BellRing } from 'lucide-react';

interface OrderViewListProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
  onCancelOrder: (orderId: string) => void;
}

const statusOptions: OrderStatus[] = ['Waiting', 'Preparing', 'Prepared', 'Served'];

const statusConfig: Record<OrderStatus, { Icon: LucideIcon, colorClasses: string, badgeVariant: "default" | "secondary" | "destructive" | "outline" }> = {
    'Waiting': { Icon: Hourglass, colorClasses: 'text-orange-500 dark:text-orange-400', badgeVariant: 'outline' },
    'Preparing': { Icon: PackageSearch, colorClasses: 'text-yellow-500 dark:text-yellow-400', badgeVariant: 'outline' },
    'Prepared': { Icon: BellRing, colorClasses: 'text-teal-500 dark:text-teal-400', badgeVariant: 'default'},
    'Served': { Icon: PackageCheck, colorClasses: 'text-green-500 dark:text-green-400', badgeVariant: 'secondary' },
    'Cancelled': { Icon: Ban, colorClasses: 'text-red-600 dark:text-red-500', badgeVariant: 'destructive'}
};

export default function OrderViewList({ orders, onUpdateStatus, onCancelOrder }: OrderViewListProps) {
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
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {orders.map((order) => {
                    const {Icon, colorClasses, badgeVariant } = statusConfig[order.status];
                    const isActionDisabled = order.status === 'Served' || order.status === 'Cancelled';
                    return (
                    <TableRow key={order.id}>
                        <TableCell className="font-medium text-primary whitespace-nowrap">{order.id}</TableCell>
                        <TableCell className="whitespace-nowrap">{order.customerName}</TableCell>
                        <TableCell className="whitespace-nowrap">{format(parseISO(order.date), 'PPp')}</TableCell>
                        <TableCell className="text-center">{order.items}</TableCell>
                        <TableCell className="text-right">₹{order.total.toFixed(2)}</TableCell>
                        <TableCell className="whitespace-nowrap">
                            <Badge variant={badgeVariant} className="capitalize text-xs">
                                <Icon className={`mr-1.5 h-3.5 w-3.5 ${colorClasses}`} />
                                {order.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2 whitespace-nowrap">
                            <Select
                                value={order.status}
                                onValueChange={(newStatus) => onUpdateStatus(order.id, newStatus as OrderStatus)}
                                disabled={isActionDisabled}
                            >
                                <SelectTrigger className="h-8 w-[150px] text-xs inline-flex" disabled={isActionDisabled}>
                                    <SelectValue placeholder="Change status" />
                                </SelectTrigger>
                                <SelectContent>
                                {statusOptions.map(opt => (
                                    <SelectItem key={opt} value={opt} className="text-xs">
                                        {opt}
                                    </SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => onCancelOrder(order.id)}
                                disabled={isActionDisabled}
                                className="h-8 text-xs"
                            >
                                <XCircle className="mr-1.5 h-3.5 w-3.5" />
                                Cancel
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
