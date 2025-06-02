
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { DeliveryInfo } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { User, Phone, Home, MapPin, PencilLine } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const deliverySchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }).regex(/^\+?[0-9\s-()]*$/, "Invalid phone number format."),
  addressLine1: z.string().min(5, { message: "Address is too short." }),
  addressLine2: z.string().optional(),
  city: z.string().min(2, { message: "City is required." }),
  postalCode: z.string().min(3, { message: "Postal code is required." }),
  deliveryInstructions: z.string().optional(),
});

interface DeliveryFormProps {
  onFormSubmit: (data: DeliveryInfo) => void;
}

export default function DeliveryForm({ onFormSubmit }: DeliveryFormProps) {
  const { toast } = useToast();
  const form = useForm<DeliveryInfo>({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      name: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      postalCode: '',
      deliveryInstructions: '',
    },
  });

  function onSubmit(values: DeliveryInfo) {
    onFormSubmit(values);
    toast({ title: "Delivery Details Confirmed!", description: "Your information has been saved for this order."});
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center"><User className="mr-2 h-4 w-4 text-muted-foreground"/>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Captain McFrigid" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center"><Phone className="mr-2 h-4 w-4 text-muted-foreground"/>Phone Number</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="Your iciest contact number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="addressLine1"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center"><Home className="mr-2 h-4 w-4 text-muted-foreground"/>Address Line 1</FormLabel>
              <FormControl>
                <Input placeholder="1 Ice Floe Road" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="addressLine2"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center"><Home className="mr-2 h-4 w-4 text-muted-foreground"/>Address Line 2 (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Apartment, suite, igloo, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
                <FormItem>
                <FormLabel className="flex items-center"><MapPin className="mr-2 h-4 w-4 text-muted-foreground"/>City</FormLabel>
                <FormControl>
                    <Input placeholder="Frostbite Falls" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
                <FormItem>
                <FormLabel className="flex items-center"><MapPin className="mr-2 h-4 w-4 text-muted-foreground"/>Postal Code</FormLabel>
                <FormControl>
                    <Input placeholder="ICE 001" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
          control={form.control}
          name="deliveryInstructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center"><PencilLine className="mr-2 h-4 w-4 text-muted-foreground"/>Delivery Instructions (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., Beware of the polar bear, leave at the ice cave entrance." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          Confirm Delivery Details
        </Button>
      </form>
    </Form>
  );
}
