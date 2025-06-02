
"use client";

import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import CartItemDisplay from './cart-item-display';
import { SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Trash2, ShoppingBag } from 'lucide-react';

export default function CartSheet() {
  const { cartItems, getCartTotal, clearCart, getCartItemCount } = useCart();
  const total = getCartTotal();
  const itemCount = getCartItemCount();

  return (
    <SheetContent className="w-full flex flex-col sm:max-w-lg p-0">
      <SheetHeader className="p-6 pb-4 border-b">
        <SheetTitle className="font-headline text-2xl text-primary">Your Antarctic Haul ({itemCount})</SheetTitle>
      </SheetHeader>
      
      {cartItems.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
          <p className="text-xl font-semibold text-muted-foreground">Your cart is colder than Antarctica!</p>
          <p className="text-muted-foreground">Add some tasty items to warm it up.</p>
          <SheetClose asChild>
            <Button variant="link" className="mt-4 text-primary">Continue Shopping</Button>
          </SheetClose>
        </div>
      ) : (
        <>
          <ScrollArea className="flex-grow p-6">
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <CartItemDisplay key={`${item.id}-${index}-${item.quantity}-${generateSignatureForCartItem(item)}`} item={item} />
              ))}
            </div>
          </ScrollArea>
          <SheetFooter className="p-6 border-t bg-background mt-auto">
            <div className="w-full space-y-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Subtotal:</span>
                <span className="text-secondary">₹{total.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex gap-2">
                <Button variant="outline" onClick={clearCart} className="w-1/3" aria-label="Clear Cart">
                  <Trash2 className="h-4 w-4" />
                </Button>
                <SheetClose asChild className="w-2/3">
                  <Link href="/checkout" passHref>
                    <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                      Proceed to Checkout
                    </Button>
                  </Link>
                </SheetClose>
              </div>
            </div>
          </SheetFooter>
        </>
      )}
    </SheetContent>
  );
}

// Helper function to generate a unique key part based on customizations for re-rendering
// This should ideally be part of the cart context or a shared utility if used elsewhere for consistency
function generateSignatureForCartItem(item: typeof import('@/types').CartItemType) {
    if (!item.selectedCustomizations || Object.keys(item.selectedCustomizations).length === 0) {
      return 'default';
    }
    return Object.entries(item.selectedCustomizations)
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key}:${value.map(opt => opt.id).sort().join(',')}`;
        }
        return `${key}:${(value as typeof import('@/types').CustomizationOption).id}`;
      })
      .join('|');
}
