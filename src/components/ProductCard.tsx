import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Product } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(product.id);

  return (
    <Card className="overflow-hidden group hover:shadow-primary transition-smooth relative">
      {/* Favorite Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleFavorite(product.id);
        }}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-background/80 backdrop-blur hover:bg-background transition-all duration-300 hover:scale-110"
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart
          className={`h-5 w-5 transition-colors ${
            favorite ? 'fill-primary text-primary' : 'text-muted-foreground hover:text-primary'
          }`}
        />
      </button>

      <Link to={`/product/${product.id}`}>
        <div className="aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-serif text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
          {product.description}
        </p>
        <p className="text-2xl font-bold text-primary">₦{product.price.toLocaleString()}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => addToCart(product)}
          className="w-full"
          size="lg"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;