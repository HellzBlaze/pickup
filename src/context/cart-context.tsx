
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { CartItemType, MenuItemType, CustomizationOption, Customization } from '@/types';
import { useToast } from "@/hooks/use-toast";

interface CartContextType {
  cartItems: CartItemType[];
  addToCart: (item: MenuItemType, quantity: number, selectedCustomizations?: CartItemType['selectedCustomizations']) => void;
  removeFromCart: (itemId: string, customizationsSignature: string) => void;
  updateQuantity: (itemId: string, customizationsSignature: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  getItemSubtotal: (item: CartItemType) => number;
  generateCustomizationSignature: (customizations?: CartItemType['selectedCustomizations']) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper to calculate price with customizations
const calculatePrice = (basePrice: number, customizations?: CartItemType['selectedCustomizations']): number => {
  let finalPrice = basePrice;
  if (customizations) {
    Object.values(customizations).forEach(optionOrOptions => {
      if (Array.isArray(optionOrOptions)) { // Multiple choice options
        optionOrOptions.forEach(opt => finalPrice += opt.priceAdjustment);
      } else { // Single choice option
        finalPrice += optionOrOptions.priceAdjustment;
      }
    });
  }
  return finalPrice;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const { toast } = useToast();

  const generateCustomizationSignature = useCallback((customizations?: CartItemType['selectedCustomizations']): string => {
    if (!customizations || Object.keys(customizations).length === 0) {
      return 'default';
    }
    // Create a sorted, consistent string representation of customizations
    return Object.entries(customizations)
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .map(([key, value]) => {
        if (Array.isArray(value)) { // Multiple selections
          return `${key}:${value.map(opt => opt.id).sort().join(',')}`;
        }
        return `${key}:${(value as CustomizationOption).id}`; // Single selection
      })
      .join('|');
  }, []);


  const addToCart = useCallback((item: MenuItemType, quantity: number, selectedCustomizations?: CartItemType['selectedCustomizations']) => {
    setCartItems(prevItems => {
      const priceWithCustomizations = calculatePrice(item.price, selectedCustomizations);
      const customizationSignature = generateCustomizationSignature(selectedCustomizations);
      
      const existingItemIndex = prevItems.findIndex(
        cartItem => cartItem.id === item.id && generateCustomizationSignature(cartItem.selectedCustomizations) === customizationSignature
      );

      let newItems;
      if (existingItemIndex > -1) {
        newItems = [...prevItems];
        const updatedItem = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity,
        };
        updatedItem.finalPrice = updatedItem.quantity * priceWithCustomizations;
        newItems[existingItemIndex] = updatedItem;
      } else {
        newItems = [
          ...prevItems,
          { 
            ...item, 
            quantity, 
            selectedCustomizations, 
            finalPrice: quantity * priceWithCustomizations 
          }
        ];
      }
      toast({ title: `${item.name} added to cart!`, description: `Quantity: ${quantity}` });
      return newItems;
    });
  }, [toast, generateCustomizationSignature]);

  const removeFromCart = useCallback((itemId: string, customizationsSignature: string) => {
    setCartItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === itemId && generateCustomizationSignature(item.selectedCustomizations) === customizationsSignature);
      if (itemToRemove) {
        toast({ title: `${itemToRemove.name} removed from cart.` });
      }
      return prevItems.filter(item => !(item.id === itemId && generateCustomizationSignature(item.selectedCustomizations) === customizationsSignature));
    });
  }, [toast, generateCustomizationSignature]);

  const updateQuantity = useCallback((itemId: string, customizationsSignature: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId, customizationsSignature);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id === itemId && generateCustomizationSignature(item.selectedCustomizations) === customizationsSignature) {
          const pricePerUnit = calculatePrice(item.price, item.selectedCustomizations);
          const updatedItem = { ...item, quantity, finalPrice: quantity * pricePerUnit };
          toast({ title: `Updated ${item.name} quantity to ${quantity}.` });
          return updatedItem;
        }
        return item;
      })
    );
  }, [removeFromCart, toast, generateCustomizationSignature]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    toast({ title: "Cart cleared!" });
  }, [toast]);

  const getCartTotal = useCallback((): number => {
    return cartItems.reduce((total, item) => total + item.finalPrice, 0);
  }, [cartItems]);

  const getCartItemCount = useCallback((): number => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  const getItemSubtotal = useCallback((item: CartItemType): number => {
    return item.finalPrice;
  }, []);

  const contextValue = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    getItemSubtotal,
    generateCustomizationSignature,
  }), [cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartItemCount, getItemSubtotal, generateCustomizationSignature]);

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
