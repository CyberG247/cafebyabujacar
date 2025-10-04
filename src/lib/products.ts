import { Product } from '@/types/product';
import coffeeImg from '@/assets/coffee-1.jpg';
import pastryImg from '@/assets/pastry-1.jpg';
import mealImg from '@/assets/meal-1.jpg';
import drinkImg from '@/assets/drink-1.jpg';

export const products: Product[] = [
  {
    id: '1',
    name: 'Signature Cappuccino',
    description: 'Rich espresso with velvety steamed milk and perfect foam art',
    price: 2500,
    category: 'coffee',
    image: coffeeImg,
    featured: true,
  },
  {
    id: '2',
    name: 'Chocolate Croissant',
    description: 'Buttery, flaky croissant filled with premium dark chocolate',
    price: 1800,
    category: 'pastries',
    image: pastryImg,
    featured: true,
  },
  {
    id: '3',
    name: 'Grilled Chicken Salad',
    description: 'Fresh mixed greens with perfectly grilled chicken and house dressing',
    price: 4500,
    category: 'meals',
    image: mealImg,
    featured: true,
  },
  {
    id: '4',
    name: 'Tropical Iced Tea',
    description: 'Refreshing iced tea with tropical fruit infusion',
    price: 2000,
    category: 'beverages',
    image: drinkImg,
    featured: true,
  },
  {
    id: '5',
    name: 'Café Latte',
    description: 'Smooth espresso with steamed milk, perfectly balanced',
    price: 2300,
    category: 'coffee',
    image: coffeeImg,
  },
  {
    id: '6',
    name: 'Espresso',
    description: 'Bold, concentrated coffee shot with rich crema',
    price: 1500,
    category: 'coffee',
    image: coffeeImg,
  },
  {
    id: '7',
    name: 'Almond Biscotti',
    description: 'Twice-baked Italian cookies, perfect with coffee',
    price: 1200,
    category: 'pastries',
    image: pastryImg,
  },
  {
    id: '8',
    name: 'Club Sandwich',
    description: 'Triple-decker sandwich with chicken, bacon, and fresh vegetables',
    price: 3800,
    category: 'meals',
    image: mealImg,
  },
];

export const categories = [
  { id: 'all', name: 'All Items' },
  { id: 'coffee', name: 'Coffee' },
  { id: 'pastries', name: 'Pastries' },
  { id: 'meals', name: 'Meals' },
  { id: 'beverages', name: 'Beverages' },
] as const;