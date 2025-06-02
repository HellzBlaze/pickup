
"use client";

import type { ReactNode } from 'react';
import { CartProvider } from '@/context/cart-context';

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
}
