import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { products } from '@/lib/products';
import { useCart } from '@/contexts/CartContext';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <Link to="/menu">
            <Button variant="hero">Back to Menu</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <Link to="/menu">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Menu
          </Button>
        </Link>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="animate-fade-in">
            <div className="aspect-square rounded-lg overflow-hidden shadow-primary">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="animate-slide-up">
            <div className="inline-block px-3 py-1 bg-primary-light text-primary text-sm font-medium rounded-full mb-4">
              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </div>
            <h1 className="font-serif text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-lg text-muted-foreground mb-6">{product.description}</p>
            <div className="text-4xl font-bold text-primary mb-8">
              ₦{product.price.toLocaleString()}
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => addToCart(product)}
                variant="hero"
                size="lg"
                className="w-full text-lg"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Link to="/menu" className="block">
                <Button variant="outline" size="lg" className="w-full text-lg">
                  Continue Shopping
                </Button>
              </Link>
            </div>

            <div className="mt-8 p-6 bg-card rounded-lg border border-border">
              <h3 className="font-semibold text-lg mb-3">Product Details</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>✓ Made with premium ingredients</li>
                <li>✓ Prepared fresh to order</li>
                <li>✓ Available for dine-in and delivery</li>
                <li>✓ Quality guaranteed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;