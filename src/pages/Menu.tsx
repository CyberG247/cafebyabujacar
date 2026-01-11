import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import ProductRecommendations from '@/components/ProductRecommendations';
import { products, categories } from '@/lib/products';
import { PageTransition } from '@/components/PageTransition';
import { ScrollReveal } from '@/components/ScrollReveal';

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <PageTransition className="min-h-screen py-16 md:py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <ScrollReveal animation="fade-up" className="text-center mb-16">
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 text-primary-dark tracking-tight">Our Menu</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our curated selection of premium coffee, delicious meals, and refreshing beverages.
          </p>
        </ScrollReveal>

        {/* AI Recommendations */}
        <ScrollReveal animation="fade-up" delay={0.1}>
          <ProductRecommendations />
        </ScrollReveal>

        {/* Category Filter */}
        <ScrollReveal animation="fade-up" delay={0.2} className="w-full">
          <div className="flex flex-wrap justify-center gap-3 mb-16 sticky top-20 z-10 py-4 bg-background/80 backdrop-blur-md rounded-2xl border border-primary/5 shadow-sm">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
                className={`transition-all duration-300 rounded-full px-6 ${
                  selectedCategory === category.id 
                    ? 'shadow-lg scale-105' 
                    : 'hover:bg-primary/5 hover:border-primary/30'
                }`}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </ScrollReveal>

        {/* Products Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          <AnimatePresence mode='popLayout'>
            {filteredProducts.map((product) => (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 25 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProducts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <p className="text-muted-foreground text-xl">No products found in this category.</p>
            <Button 
              variant="link" 
              onClick={() => setSelectedCategory('all')}
              className="mt-4 text-primary"
            >
              View all products
            </Button>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
};

export default Menu;