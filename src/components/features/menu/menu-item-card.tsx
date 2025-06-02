
"use client";

import Image from 'next/image';
import type { MenuItemType } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/context/cart-context';
import { PlusCircle, Settings2 } from 'lucide-react';
import { useState } from 'react';
import ItemCustomizationDialog from './item-customization-dialog';

interface MenuItemCardProps {
  item: MenuItemType;
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const { addToCart } = useCart();
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);

  const handleAddToCart = () => {
    if (item.customizations && item.customizations.length > 0) {
      setIsCustomizeOpen(true);
    } else {
      addToCart(item, 1);
    }
  };

  return (
    <>
      <Card className="flex flex-col overflow-hidden h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="p-0">
          <div className="aspect-[3/2] relative w-full">
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              style={{objectFit: "cover"}}
              data-ai-hint={item.dataAiHint}
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-xl font-headline mb-1 text-primary">{item.name}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground mb-2 h-16 overflow-y-auto">
            {item.description}
          </CardDescription>
          <p className="text-lg font-semibold text-secondary">${item.price.toFixed(2)}</p>
        </CardContent>
        <CardFooter className="p-4 border-t">
          <Button onClick={handleAddToCart} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            {item.customizations && item.customizations.length > 0 ? (
              <Settings2 className="mr-2 h-5 w-5" />
            ) : (
              <PlusCircle className="mr-2 h-5 w-5" />
            )}
            {item.customizations && item.customizations.length > 0 ? 'Customize & Add' : 'Add to Cart'}
          </Button>
        </CardFooter>
      </Card>
      {item.customizations && item.customizations.length > 0 && (
        <ItemCustomizationDialog
          isOpen={isCustomizeOpen}
          setIsOpen={setIsCustomizeOpen}
          item={item}
        />
      )}
    </>
  );
}
