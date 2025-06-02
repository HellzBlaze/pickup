
import type { CategoryType, MenuItemType, Customization } from '@/types';

const pizzaCustomizations: Customization[] = [
  {
    id: 'size',
    name: 'Size',
    type: 'single',
    options: [
      { id: 'small', name: 'Small (10")', priceAdjustment: 0 },
      { id: 'medium', name: 'Medium (12")', priceAdjustment: 3 },
      { id: 'large', name: 'Large (14")', priceAdjustment: 6 },
    ],
    defaultOption: 'small',
  },
  {
    id: 'crust',
    name: 'Crust',
    type: 'single',
    options: [
      { id: 'classic', name: 'Classic Hand-Tossed', priceAdjustment: 0 },
      { id: 'thin', name: 'Thin Crust', priceAdjustment: 0 },
      { id: 'stuffed', name: 'Cheese-Stuffed Crust', priceAdjustment: 2.5 },
    ],
    defaultOption: 'classic',
  },
  {
    id: 'toppings',
    name: 'Extra Toppings',
    type: 'multiple',
    options: [
      { id: 'pepperoni', name: 'Pepperoni', priceAdjustment: 1.5 },
      { id: 'mushrooms', name: 'Mushrooms', priceAdjustment: 1 },
      { id: 'olives', name: 'Olives', priceAdjustment: 1 },
      { id: 'extra_cheese', name: 'Extra Cheese', priceAdjustment: 2 },
    ],
  },
];

const burgerCustomizations: Customization[] = [
  {
    id: 'patty_doneness',
    name: 'Patty Doneness',
    type: 'single',
    options: [
      { id: 'medium_rare', name: 'Medium Rare', priceAdjustment: 0 },
      { id: 'medium', name: 'Medium', priceAdjustment: 0 },
      { id: 'medium_well', name: 'Medium Well', priceAdjustment: 0 },
      { id: 'well_done', name: 'Well Done', priceAdjustment: 0 },
    ],
    defaultOption: 'medium',
  },
  {
    id: 'addons',
    name: 'Add-ons',
    type: 'multiple',
    options: [
      { id: 'bacon', name: 'Crispy Bacon', priceAdjustment: 2 },
      { id: 'extra_patty', name: 'Extra Patty', priceAdjustment: 3 },
      { id: 'avocado', name: 'Avocado Slices', priceAdjustment: 1.5 },
    ],
  },
];

const saladCustomizations: Customization[] = [
  {
    id: 'dressing',
    name: 'Dressing',
    type: 'single',
    options: [
        { id: 'vinaigrette', name: 'Balsamic Vinaigrette', priceAdjustment: 0 },
        { id: 'ranch', name: 'Ranch', priceAdjustment: 0 },
        { id: 'caesar', name: 'Caesar Dressing', priceAdjustment: 0 },
    ],
    defaultOption: 'vinaigrette',
  },
  {
    id: 'protein',
    name: 'Add Protein',
    type: 'single',
    options: [
        { id: 'none', name: 'None', priceAdjustment: 0 },
        { id: 'chicken', name: 'Grilled Chicken', priceAdjustment: 3 },
        { id: 'salmon', name: 'Grilled Salmon', priceAdjustment: 5 },
        { id: 'tofu', name: 'Marinated Tofu', priceAdjustment: 2.5 },
    ],
    defaultOption: 'none',
  }
];


export const menuData: CategoryType[] = [
  {
    id: 'pizzas',
    name: 'Pizzas from the Permafrost',
    items: [
      {
        id: 'penguin_pepperoni',
        name: 'Penguin Pepperoni Blast',
        description: 'Classic pepperoni pizza with a zesty tomato sauce and mozzarella cheese, baked to perfection.',
        price: 12.99,
        imageUrl: 'https://placehold.co/600x400.png',
        dataAiHint: 'pepperoni pizza',
        category: 'Pizzas from the Permafrost',
        customizations: pizzaCustomizations,
      },
      {
        id: 'glacial_veggie',
        name: 'Glacial Veggie Delight',
        description: 'A delightful mix of fresh bell peppers, onions, olives, mushrooms, and spinach on a creamy garlic base.',
        price: 11.99,
        imageUrl: 'https://placehold.co/600x400.png',
        dataAiHint: 'vegetarian pizza',
        category: 'Pizzas from the Permafrost',
        customizations: pizzaCustomizations,
      },
    ],
  },
  {
    id: 'burgers',
    name: 'Blizzard Burgers',
    items: [
      {
        id: 'antarctic_classic',
        name: 'The Antarctic Classic Burger',
        description: 'Juicy beef patty with lettuce, tomato, onion, pickles, and our signature polar sauce on a toasted brioche bun.',
        price: 9.50,
        imageUrl: 'https://placehold.co/600x400.png',
        dataAiHint: 'classic burger',
        category: 'Blizzard Burgers',
        customizations: burgerCustomizations,
      },
      {
        id: 'iceberg_chicken',
        name: 'Iceberg Crispy Chicken Sandwich',
        description: 'Crispy fried chicken breast, spicy mayo, lettuce, and pickles on a soft potato roll.',
        price: 10.25,
        imageUrl: 'https://placehold.co/600x400.png',
        dataAiHint: 'chicken sandwich',
        category: 'Blizzard Burgers',
      },
    ],
  },
  {
    id: 'salads',
    name: 'Subzero Salads',
    items: [
      {
        id: 'arctic_garden',
        name: 'Arctic Garden Salad',
        description: 'A refreshing mix of mixed greens, cherry tomatoes, cucumbers, carrots, and croutons.',
        price: 7.99,
        imageUrl: 'https://placehold.co/600x400.png',
        dataAiHint: 'garden salad',
        category: 'Subzero Salads',
        customizations: saladCustomizations,
      },
    ],
  },
  {
    id: 'drinks',
    name: 'Frosty Beverages',
    items: [
      {
        id: 'polar_punch',
        name: 'Polar Punch',
        description: 'A fruity and refreshing punch, perfect for a warm day (or a cold one!).',
        price: 3.50,
        imageUrl: 'https://placehold.co/300x300.png',
        dataAiHint: 'fruit punch',
        category: 'Frosty Beverages',
      },
      {
        id: 'glacial_water',
        name: 'Glacial Spring Water',
        description: 'Pure, crisp Antarctic spring water.',
        price: 2.00,
        imageUrl: 'https://placehold.co/300x300.png',
        dataAiHint: 'water bottle',
        category: 'Frosty Beverages',
      },
    ],
  },
];
