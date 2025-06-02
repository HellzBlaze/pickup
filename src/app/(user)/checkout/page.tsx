
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import DeliveryForm from '@/components/features/checkout/delivery-form';
import OrderSummaryDisplay from '@/components/features/checkout/order-summary-display';
import TipSelector from '@/components/features/checkout/tip-selector';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DeliveryInfo } from '@/types';
import { Separator } from '@/components/ui/separator';
import { Send } from 'lucide-react';

const DELIVERY_FEE = 5.00; // Example delivery fee
const TAX_RATE = 0.08; // Example tax rate (8%)

export default function CheckoutPage() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();

  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo | null>(null);
  const [tipAmount, setTipAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = getCartTotal();
  const taxes = subtotal * TAX_RATE;
  const totalAmount = subtotal + DELIVERY_FEE + taxes + tipAmount;

  useEffect(() => {
    if (cartItems.length === 0 && !isSubmitting) { // Prevent redirect during submission animation
      toast({ title: "Your cart is empty!", description: "Please add items before checking out.", variant: "destructive" });
      router.push('/');
    }
  }, [cartItems, router, toast, isSubmitting]);

  const handleOrderSubmit = async () => {
    if (!deliveryInfo) {
      toast({ title: "Missing Information", description: "Please fill out and confirm your delivery details.", variant: "destructive" });
      return;
    }
    if (cartItems.length === 0) {
      toast({ title: "Empty Cart", description: "Your cart is empty.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log("Order Submitted:", {
      cartItems,
      deliveryInfo,
      subtotal,
      deliveryFee: DELIVERY_FEE,
      taxes,
      tipAmount,
      totalAmount,
    });

    toast({
      title: "Order Placed Successfully!",
      description: `Your Antarctic feast is on its way! Total: $${totalAmount.toFixed(2)}`,
      duration: 5000,
    });
    clearCart();
    setIsSubmitting(false);
    router.push('/');
  };
  
  if (cartItems.length === 0 && !isSubmitting) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-headline">Your cart is empty. Redirecting...</h1>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-headline text-primary mb-8 text-center">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-secondary">1. Delivery Details</CardTitle>
          </CardHeader>
          <CardContent>
            <DeliveryForm onFormSubmit={setDeliveryInfo} />
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-headline text-secondary">2. Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderSummaryDisplay
                cartItems={cartItems}
                subtotal={subtotal}
                deliveryFee={DELIVERY_FEE}
                taxes={taxes}
                tipAmount={tipAmount}
                totalAmount={totalAmount}
              />
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-headline text-secondary">3. Add a Tip</CardTitle>
            </CardHeader>
            <CardContent>
              <TipSelector subtotal={subtotal} onTipChange={setTipAmount} />
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator className="my-8" />

      <div className="text-center mt-8">
        <p className="text-3xl font-bold mb-4">
          Grand Total: <span className="text-accent">${totalAmount.toFixed(2)}</span>
        </p>
        <Button 
          size="lg" 
          onClick={handleOrderSubmit} 
          disabled={isSubmitting || !deliveryInfo || cartItems.length === 0}
          className="w-full max-w-md bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Send className="mr-2 h-5 w-5" />
          {isSubmitting ? 'Placing Order...' : 'Place Your Antarctic Order'}
        </Button>
      </div>
    </div>
  );
}
