export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'coffee' | 'pastries' | 'meals' | 'beverages';
  image: string;
  featured?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}