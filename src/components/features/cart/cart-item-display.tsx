
"use client";

import Image from 'next/image';
import type { CartItemType, CustomizationOption } from '@/types';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MinusCircle, PlusCircle, Trash2 } from 'lucide-react';

interface CartItemDisplayProps {
  item: CartItemType;
}

export default function CartItemDisplay({ item }: CartItemDisplayProps) {
  const { updateQuantity, removeFromCart, getItemSubtotal, generateCustomizationSignature } = useCart();
  const customizationSignature = generateCustomizationSignature(item.selectedCustomizations);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (!isNaN(newQuantity)) {
      updateQuantity(item.id, customizationSignature, newQuantity);
    }
  };

  const incrementQuantity = () => {
    updateQuantity(item.id, customizationSignature, item.quantity + 1);
  };

  const decrementQuantity = () => {
    updateQuantity(item.id, customizationSignature, item.quantity - 1);
  };

  const itemSubtotal = getItemSubtotal(item);

  return (
    <div className="flex gap-4 p-4 border rounded-lg shadow-sm bg-card">
      <div className="relative w-20 h-20 rounded-md overflow-hidden shrink-0">
        <Image src={item.imageUrl} alt={item.name} fill style={{objectFit: "cover"}} data-ai-hint={item.dataAiHint} />
      </div>
      <div className="flex-grow">
        <h4 className="font-semibold text-md text-primary">{item.name}</h4>
        {item.selectedCustomizations && Object.keys(item.selectedCustomizations).length > 0 && (
          <div className="text-xs text-muted-foreground mt-1">
            {Object.entries(item.selectedCustomizations).map(([customizationId, optionOrOptions]) => {
              let optionText = '';
              const custDefinition = item.customizations?.find(c => c.id === customizationId);
              
              if (Array.isArray(optionOrOptions)) { // Multiple choice
                optionText = optionOrOptions.map(opt => opt.name).join(', ');
              } else { // Single choice
                optionText = (optionOrOptions as CustomizationOption).name;
              }
              return <div key={customizationId}><span className="font-medium">{custDefinition?.name || customizationId}:</span> {optionText}</div>;
            })}
          </div>
        )}
        <p className="text-sm text-secondary font-medium mt-1">₹{itemSubtotal.toFixed(2)}</p>
      </div>
      <div className="flex flex-col items-end justify-between shrink-0">
        <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id, customizationSignature)} className="text-destructive hover:text-destructive/80 h-7 w-7">
          <Trash2 className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-1 mt-2">
          <Button variant="outline" size="icon" onClick={decrementQuantity} className="h-7 w-7">
            <MinusCircle className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            value={item.quantity}
            onChange={handleQuantityChange}
            className="w-12 h-7 text-center px-1"
            min="0"
            aria-label={`Quantity for ${item.name}`}
          />
          <Button variant="outline" size="icon" onClick={incrementQuantity} className="h-7 w-7">
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
