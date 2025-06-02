
"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, parseISO } from 'date-fns';
import { PackageCheck, PackageSearch, Truck, CheckCircle2, type LucideIcon } from 'lucide-react';

interface Order {
  id: string;
  customerName: string;
  total: number;
  items: number;
  status: 'Preparing' | 'Out for Delivery' | 'Delivered';
  date: string;
}

interface OrderViewListProps {
  orders: Order[];
}

const statusConfig: Record<Order['status'], { Icon: LucideIcon, colorClasses: string, badgeVariant: "default" | "secondary" | "destructive" | "outline" }> = {
    'Preparing': { Icon: PackageSearch, colorClasses: 'text-yellow-500 dark:text-yellow-400', badgeVariant: 'outline' },
    'Out for Delivery': { Icon: Truck, colorClasses: 'text-blue-500 dark:text-blue-400', badgeVariant: 'default'},
    'Delivered': { Icon: PackageCheck, colorClasses: 'text-green-500 dark:text-green-400', badgeVariant: 'secondary' }
};

export default function OrderViewList({ orders }: OrderViewListProps) {
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
            <CardDescription>Overview of customer orders and their current status.</CardDescription>
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
                </TableRow>
                </TableHeader>
                <TableBody>
                {orders.map((order) => {
                    const {Icon, colorClasses, badgeVariant } = statusConfig[order.status];
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
                    </TableRow>
                    );
                })}
                </TableBody>
            </Table>
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground">Displaying last {orders.length} orders.</p>
        </CardFooter>
    </Card>
  );
}
