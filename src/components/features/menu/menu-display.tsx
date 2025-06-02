
"use client";

import type { CategoryType } from '@/types';
import MenuCategoryDisplay from './menu-category-display';

interface MenuDisplayProps {
  categories: CategoryType[];
}

export default function MenuDisplay({ categories }: MenuDisplayProps) {
  return (
    <section aria-labelledby="menu-heading">
      <h2 id="menu-heading" className="text-3xl font-headline text-primary mb-6 border-b-2 border-primary pb-2">
        Our Menu
      </h2>
      <div className="space-y-8">
        {categories.map((category) => (
          <MenuCategoryDisplay key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
}
