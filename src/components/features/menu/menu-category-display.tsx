
import type { CategoryType } from '@/types';
import MenuItemCard from './menu-item-card';

interface MenuCategoryDisplayProps {
  category: CategoryType;
}

export default function MenuCategoryDisplay({ category }: MenuCategoryDisplayProps) {
  return (
    <section aria-labelledby={`category-${category.id}-heading`}>
      <h3 id={`category-${category.id}-heading`} className="text-2xl font-headline text-secondary mb-4">
        {category.name}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.items.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
