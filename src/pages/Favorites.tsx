import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { products } from '@/lib/products';
import { useFavorites } from '@/contexts/FavoritesContext';

const Favorites = () => {
  const { favorites } = useFavorites();
  
  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block p-4 rounded-full bg-primary/5 mb-6">
             <Heart className="h-12 w-12 text-primary fill-primary/20" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-dark">
            Your Wishlist
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A curated collection of your most loved items. Ready to order when you are.
          </p>
        </motion.div>

        {favoriteProducts.length > 0 ? (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {favoriteProducts.map((product) => (
                <motion.div 
                  key={product.id} 
                  variants={item}
                  layout
                  exit={{ scale: 0.8, opacity: 0 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
              <div className="relative bg-card p-8 rounded-full shadow-xl border border-border">
                <Heart className="h-16 w-16 text-muted-foreground/50" />
              </div>
            </div>
            <h2 className="font-serif text-3xl font-bold mb-4">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              It seems you haven't found any favorites yet. Explore our menu to find delicious items to love.
            </p>
            <Link to="/menu">
              <Button size="lg" className="rounded-full px-8 h-12 text-lg shadow-lg hover:shadow-primary/25 transition-all hover:scale-105">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Explore Menu
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
