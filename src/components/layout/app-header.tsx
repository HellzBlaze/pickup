
"use client";

import Link from 'next/link';
import { ShoppingCart, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import CartSheet from '@/components/features/cart/cart-sheet'; 
import { Sheet, SheetTrigger } from '@/components/ui/sheet';

export default function AppHeader() {
  const { getCartItemCount } = useCart();
  const itemCount = getCartItemCount();

  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-headline text-primary hover:opacity-80 transition-opacity">
          Antartican Co.
        </Link>
        <nav className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open Cart">
                <ShoppingCart className="h-6 w-6 text-primary" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <CartSheet />
          </Sheet>
          <Link href="/employee/login" passHref>
            <Button variant="outline" size="sm">
              <Users className="mr-2 h-4 w-4" />
              Employee Section
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
