import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
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
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Card className="overflow-hidden group hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 relative border-primary/10">
        {/* Favorite Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(product.id);
          }}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-background/80 backdrop-blur hover:bg-background transition-colors shadow-sm"
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={`h-5 w-5 transition-colors ${
              favorite ? 'fill-primary text-primary' : 'text-muted-foreground hover:text-primary'
            }`}
          />
        </motion.button>

        <Link to={`/product/${product.id}`}>
          <div className="aspect-square overflow-hidden">
            <motion.img
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.6 }}
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
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
            className="w-full relative overflow-hidden"
            size="lg"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProductCard;