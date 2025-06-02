
"use client";

import type { Dispatch, SetStateAction } from 'react';
import { useState, useEffect } from 'react';
import type { MenuItemType, Customization, CustomizationOption, CartItemType } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useCart } from '@/context/cart-context';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ItemCustomizationDialogProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  item: MenuItemType;
}

export default function ItemCustomizationDialog({ isOpen, setIsOpen, item }: ItemCustomizationDialogProps) {
  const { addToCart } = useCart();
  const [selectedOptions, setSelectedOptions] = useState<CartItemType['selectedCustomizations']>({});
  const [currentPrice, setCurrentPrice] = useState(item.price);

  useEffect(() => {
    // Initialize selectedOptions with defaults when dialog opens or item changes
    if (item.customizations) {
      const initialSelections: CartItemType['selectedCustomizations'] = {};
      item.customizations.forEach(cust => {
        if (cust.type === 'single' && cust.defaultOption) {
          const defaultOpt = cust.options.find(opt => opt.id === cust.defaultOption);
          if (defaultOpt) {
            initialSelections[cust.id] = defaultOpt;
          }
        } else if (cust.type === 'multiple') {
          initialSelections[cust.id] = []; // Initialize as empty array for multiple choice
        }
      });
      setSelectedOptions(initialSelections);
    }
  }, [item, isOpen]);
  
  useEffect(() => {
    // Recalculate price when selectedOptions change
    let newPrice = item.price;
    if (selectedOptions) {
        Object.values(selectedOptions).forEach(optionOrOptions => {
            if (Array.isArray(optionOrOptions)) {
                optionOrOptions.forEach(opt => newPrice += opt.priceAdjustment);
            } else if (optionOrOptions) { // Check if it's not undefined
                newPrice += (optionOrOptions as CustomizationOption).priceAdjustment;
            }
        });
    }
    setCurrentPrice(newPrice);
  }, [selectedOptions, item.price]);


  const handleOptionChange = (customizationId: string, option: CustomizationOption, customizationType: 'single' | 'multiple') => {
    setSelectedOptions(prev => {
      const newSelections = { ...prev };
      if (customizationType === 'single') {
        newSelections[customizationId] = option;
      } else {
        let currentMultiple = (newSelections[customizationId] as CustomizationOption[] | undefined) || [];
        if (!Array.isArray(currentMultiple)) currentMultiple = []; // Ensure it's an array

        const optionIndex = currentMultiple.findIndex(o => o.id === option.id);
        if (optionIndex > -1) {
          currentMultiple.splice(optionIndex, 1); // Remove if already selected
        } else {
          currentMultiple.push(option); // Add if not selected
        }
        newSelections[customizationId] = currentMultiple;
      }
      return newSelections;
    });
  };

  const handleAddToCartWithCustomizations = () => {
    addToCart(item, 1, selectedOptions);
    setIsOpen(false);
  };

  if (!item.customizations) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-primary">Customize {item.name}</DialogTitle>
          <DialogDescription>
            Make it just the way you like it! Base price: ${item.price.toFixed(2)}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow pr-6 -mr-6"> {/* Added pr-6 and -mr-6 for scrollbar spacing */}
          <div className="space-y-6 py-4">
            {item.customizations.map((cust: Customization) => (
              <div key={cust.id} className="space-y-2 border-b pb-4 last:border-b-0">
                <Label className="text-lg font-medium text-secondary">{cust.name}</Label>
                {cust.type === 'single' ? (
                  <RadioGroup
                    value={(selectedOptions?.[cust.id] as CustomizationOption)?.id || cust.defaultOption}
                    onValueChange={(optionId) => {
                      const selectedOpt = cust.options.find(o => o.id === optionId);
                      if (selectedOpt) handleOptionChange(cust.id, selectedOpt, 'single');
                    }}
                  >
                    {cust.options.map((opt) => (
                      <div key={opt.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt.id} id={`${cust.id}-${opt.id}`} />
                        <Label htmlFor={`${cust.id}-${opt.id}`} className="flex-grow cursor-pointer">
                          {opt.name} 
                          {opt.priceAdjustment !== 0 && 
                            <span className="text-muted-foreground text-sm ml-1">
                              ({opt.priceAdjustment > 0 ? '+' : ''}${opt.priceAdjustment.toFixed(2)})
                            </span>
                          }
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <div className="space-y-2">
                    {cust.options.map((opt) => (
                      <div key={opt.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${cust.id}-${opt.id}`}
                          checked={((selectedOptions?.[cust.id] as CustomizationOption[]) || []).some(o => o.id === opt.id)}
                          onCheckedChange={() => handleOptionChange(cust.id, opt, 'multiple')}
                        />
                        <Label htmlFor={`${cust.id}-${opt.id}`} className="flex-grow cursor-pointer">
                          {opt.name} 
                          {opt.priceAdjustment !== 0 && 
                            <span className="text-muted-foreground text-sm ml-1">
                              ({opt.priceAdjustment > 0 ? '+' : ''}${opt.priceAdjustment.toFixed(2)})
                            </span>
                          }
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        <DialogFooter className="mt-auto pt-4 border-t">
          <div className="flex justify-between items-center w-full">
            <p className="text-xl font-semibold">Total: ${currentPrice.toFixed(2)}</p>
            <Button onClick={handleAddToCartWithCustomizations} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Add to Cart
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
