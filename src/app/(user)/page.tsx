
import MenuDisplay from '@/components/features/menu/menu-display';
import DishRecommender from '@/components/features/ai/dish-recommender';
import { menuData } from '@/data/menu-data';
import { mockOrderHistory } from '@/data/order-history';

export default function HomePage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-headline mb-2 text-center text-primary">Welcome to Antartican Co. Eats!</h1>
        <p className="text-xl text-muted-foreground text-center mb-8">Explore our delicious offerings from the heart of Antarctica.</p>
      </div>
      
      <DishRecommender orderHistory={mockOrderHistory} />
      
      <MenuDisplay categories={menuData} />
    </div>
  );
}
