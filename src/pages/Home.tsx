import { Link } from 'react-router-dom';
import { ArrowRight, Coffee, Clock, MapPin } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { products } from '@/lib/products';
import heroImage from '@/assets/hero-image.jpg';
import { ScrollReveal } from '@/components/ScrollReveal';
import { PageTransition } from '@/components/PageTransition';

const Home = () => {
  const featuredProducts = products.filter((p) => p.featured);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]);
  
  return (
    <PageTransition className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})`, y }}
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
        <div className="absolute inset-0 gradient-hero" />
        
        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight drop-shadow-2xl">
              Welcome to <br/>
              <span className="text-primary-light block mt-6 md:mt-8 whitespace-nowrap">
                Café By ABUJACAR
              </span>
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto font-light text-gray-200 drop-shadow-lg"
          >
            Experience luxury dining with premium coffee, delicious meals, and exceptional service
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/menu">
              <Button variant="hero" size="lg" className="text-lg px-10 h-16 rounded-full shadow-lg hover:shadow-primary/50 transition-all hover:scale-105 border-2 border-white">
                Order Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/about">
              <Button
                variant="outline"
                size="lg"
                className="text-lg bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white hover:text-primary h-16 rounded-full px-10 hover:scale-105 transition-all"
              >
                Learn More
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollReveal animation="fade-up" delay={0.1} className="h-full">
              <div className="text-center p-8 rounded-3xl hover:bg-muted/50 transition-colors duration-500 h-full border border-transparent hover:border-primary/10 hover:shadow-2xl">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-8 group-hover:scale-110 transition-transform duration-500">
                  <Coffee className="h-12 w-12 text-primary" />
                </div>
                <h3 className="font-serif text-3xl font-semibold mb-4">Premium Quality</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Only the finest ingredients and expertly crafted beverages for an unmatched taste.
                </p>
              </div>
            </ScrollReveal>
            
            <ScrollReveal animation="fade-up" delay={0.2} className="h-full">
              <div className="text-center p-8 rounded-3xl hover:bg-muted/50 transition-colors duration-500 h-full border border-transparent hover:border-primary/10 hover:shadow-2xl">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-8 group-hover:scale-110 transition-transform duration-500">
                  <Clock className="h-12 w-12 text-primary" />
                </div>
                <h3 className="font-serif text-3xl font-semibold mb-4">Fast Delivery</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Quick and reliable delivery right to your doorstep, ensuring your food arrives hot and fresh.
                </p>
              </div>
            </ScrollReveal>
            
            <ScrollReveal animation="fade-up" delay={0.3} className="h-full">
              <div className="text-center p-8 rounded-3xl hover:bg-muted/50 transition-colors duration-500 h-full border border-transparent hover:border-primary/10 hover:shadow-2xl">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-8 group-hover:scale-110 transition-transform duration-500">
                  <MapPin className="h-12 w-12 text-primary" />
                </div>
                <h3 className="font-serif text-3xl font-semibold mb-4">Prime Location</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Located in the heart of Kado, Abuja, offering a serene environment for your enjoyment.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="slide-left" className="text-center mb-20">
            <h2 className="font-serif text-4xl md:text-6xl font-bold mb-6 text-primary-dark">Featured Items</h2>
            <div className="h-1.5 w-24 bg-primary mx-auto mb-8 rounded-full" />
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
              Discover our most popular menu selections, curated for your delight
            </p>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {featuredProducts.map((product, index) => (
              <ScrollReveal key={product.id} animation="scale-up" delay={index * 0.1}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
          
          <ScrollReveal animation="fade-up" className="text-center">
            <Link to="/menu">
              <Button variant="hero" size="lg" className="rounded-full px-12 h-14 text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                View Full Menu
                <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-20 md:py-32 bg-background overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
           <div className="absolute top-10 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
           <div className="absolute bottom-10 -right-20 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal animation="fade-up" className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-4xl md:text-6xl font-bold mb-10">About Café By ABUJA CAR</h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed">
              Founded by visionary entrepreneur <span className="text-primary font-bold">Sadiq Saminu Geidam</span>, 
              Café By ABUJACAR brings together premium quality, luxury service, and exceptional taste. 
              We're committed to providing an unforgettable dining experience.
            </p>
            <Link to="/about">
              <Button variant="outline" size="lg" className="rounded-full px-10 h-14 border-primary text-primary hover:bg-primary hover:text-white text-lg transition-all hover:scale-105">
                Learn More About Us
                <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </PageTransition>
  );
};

export default Home;