
"use client";

import type { CartItemType, CustomizationOption } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';

interface OrderSummaryDisplayProps {
  cartItems: CartItemType[];
  subtotal: number;
  deliveryFee: number;
  taxes: number;
  tipAmount: number;
  totalAmount: number;
}

export default function OrderSummaryDisplay({
  cartItems,
  subtotal,
  deliveryFee,
  taxes,
  tipAmount,
}: OrderSummaryDisplayProps) {
  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-lg mb-2 text-primary">Your Items:</h4>
      <ScrollArea className="h-[200px] pr-3"> {/* Max height for scroll */}
        <div className="space-y-3">
          {cartItems.map((item, index) => (
            <div key={`${item.id}-${index}`} className="flex items-center gap-3 text-sm">
              <Image src={item.imageUrl} alt={item.name} width={40} height={40} className="rounded" data-ai-hint={item.dataAiHint} />
              <div className="flex-grow">
                <p className="font-medium">{item.name} (x{item.quantity})</p>
                {item.selectedCustomizations && Object.keys(item.selectedCustomizations).length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    {Object.entries(item.selectedCustomizations).map(([customizationId, optionOrOptions]) => {
                        let optionText = '';
                        const custDefinition = item.customizations?.find(c => c.id === customizationId);
                        if (Array.isArray(optionOrOptions)) {
                            optionText = optionOrOptions.map(opt => opt.name).join(', ');
                        } else {
                            optionText = (optionOrOptions as CustomizationOption).name;
                        }
                        return <div key={customizationId}><span className="font-medium">{custDefinition?.name || customizationId}:</span> {optionText}</div>;
                    })}
                  </div>
                )}
              </div>
              <p className="font-medium">${item.finalPrice.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
      <Separator className="my-3"/>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between"><span>Subtotal:</span><span>${subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between"><span>Delivery Fee:</span><span>${deliveryFee.toFixed(2)}</span></div>
        <div className="flex justify-between"><span>Taxes (Est.):</span><span>${taxes.toFixed(2)}</span></div>
        {tipAmount > 0 && <div className="flex justify-between"><span>Tip:</span><span>${tipAmount.toFixed(2)}</span></div>}
      </div>
    </div>
  );
}
