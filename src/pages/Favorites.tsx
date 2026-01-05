import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { products } from '@/lib/products';
import { useFavorites } from '@/contexts/FavoritesContext';

const Favorites = () => {
  const { favorites } = useFavorites();
  
  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl font-bold mb-4 flex items-center justify-center gap-3">
            <Heart className="h-10 w-10 text-primary fill-primary" />
            My Favorites
          </h1>
          <p className="text-lg text-muted-foreground">
            Items you've saved for later
          </p>
        </div>

        {favoriteProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteProducts.map((product) => (
              <div key={product.id} className="animate-fade-in">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="font-serif text-2xl font-semibold mb-2">No favorites yet</h2>
            <p className="text-muted-foreground mb-6">
              Start adding items to your favorites by clicking the heart icon
            </p>
            <Link to="/menu">
              <Button variant="hero">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Browse Menu
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
