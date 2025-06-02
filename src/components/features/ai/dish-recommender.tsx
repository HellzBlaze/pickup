
"use client";

import { useEffect, useState } from 'react';
import { recommendDishes, type RecommendDishesInput, type RecommendDishesOutput } from '@/ai/flows/recommend-dishes';
import type { OrderHistoryItem, MenuItemType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, ShoppingCart } from 'lucide-react';
import { menuData } from '@/data/menu-data'; // To find item details for recommended dishes
import { useCart } from '@/context/cart-context';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

interface DishRecommenderProps {
  orderHistory: OrderHistoryItem[];
}

const allMenuItems: MenuItemType[] = menuData.flatMap(category => category.items);

export default function DishRecommender({ orderHistory }: DishRecommenderProps) {
  const [recommendations, setRecommendations] = useState<MenuItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchRecommendations() {
      if (orderHistory.length === 0) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const input: RecommendDishesInput = {
          orderHistory: JSON.stringify(orderHistory.map(item => ({ name: item.dishName, quantity: item.quantity }))),
        };
        const result: RecommendDishesOutput = await recommendDishes(input);
        
        let parsedDishes: string[] = [];
        try {
            // Attempt to parse as JSON array first
            parsedDishes = JSON.parse(result.recommendedDishes);
        } catch (parseError) {
            console.warn("AI output was not a strict JSON array string. Attempting flexible parsing. Output:", result.recommendedDishes, "Error:", parseError);
            // Fallback for non-standard formats (e.g. "dish1, dish2" or "['dish1', 'dish2']")
            if (typeof result.recommendedDishes === 'string') {
                // Remove potential wrapping brackets and standardize quotes
                const cleanedString = result.recommendedDishes
                    .replace(/^\[|\]$/g, '')    // Remove leading/trailing brackets
                    .replace(/'/g, '"');        // Replace single quotes with double quotes

                // Split by comma, trim whitespace, and remove empty strings or quotes around names
                const dishNames = cleanedString
                    .split(',')
                    .map(name => name.trim().replace(/^"|"$/g, '')) 
                    .filter(name => name.length > 0); // Ensure no empty names

                if (dishNames.length > 0) {
                    parsedDishes = dishNames;
                } else {
                    // If still no valid dishes, it might be an empty string or malformed.
                    console.error("Flexible parsing failed to extract dish names.", result.recommendedDishes);
                    parsedDishes = []; // Default to empty array on failed flexible parse
                }
            } else {
                // If not a string, cannot parse.
                console.error("Recommended dishes is not a string, cannot parse.", result.recommendedDishes);
                parsedDishes = [];
            }
        }

        if (!Array.isArray(parsedDishes)) {
           // This should ideally not be reached if flexible parsing sets an array.
           console.error("Parsed recommendations are not in array format:", parsedDishes);
           parsedDishes = []; // Ensure it's an array
        }

        const detailedRecommendations = parsedDishes
          .map(name => allMenuItems.find(item => item.name.toLowerCase() === name.toLowerCase()))
          .filter(item => item !== undefined) as MenuItemType[];
        
        setRecommendations(detailedRecommendations);
      } catch (e) {
        console.error('Error fetching recommendations:', e);
        setError('Could not fetch recommendations at this time.');
        setRecommendations([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecommendations();
  }, [orderHistory]);

  if (orderHistory.length === 0 && !isLoading) {
    return null; // Don't show if no history and not loading
  }

  return (
    <Card className="mb-8 shadow-lg bg-background">
      <CardHeader>
        <CardTitle className="text-2xl font-headline text-primary flex items-center">
          <Lightbulb className="mr-2 h-6 w-6 text-accent" />
          Chef's Suggestions For You
        </CardTitle>
        <CardDescription>Based on your previous Antarctic adventures!</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-2 p-4 border rounded-lg">
                <Skeleton className="h-32 w-full rounded-md" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full mt-2" />
              </div>
            ))}
          </div>
        )}
        {!isLoading && error && <p className="text-destructive">{error}</p>}
        {!isLoading && !error && recommendations.length === 0 && (
          <p className="text-muted-foreground">No specific recommendations for you right now, but feel free to explore our full menu!</p>
        )}
        {!isLoading && !error && recommendations.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map(item => (
              <Card key={item.id} className="overflow-hidden flex flex-col">
                <div className="relative w-full h-40">
                   <Image src={item.imageUrl} alt={item.name} fill style={{objectFit:"cover"}} data-ai-hint={item.dataAiHint} />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">{item.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => addToCart(item, 1)} size="sm" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                    <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart (${item.price.toFixed(2)})
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
