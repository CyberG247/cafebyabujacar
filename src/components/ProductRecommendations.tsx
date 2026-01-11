import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { products } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import { useToast } from '@/hooks/use-toast';

type Recommendation = {
  id: string;
  name: string;
  reason: string;
};

const ProductRecommendations = () => {
  const [preferences, setPreferences] = useState('');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  const getRecommendations = async () => {
    if (!preferences.trim()) {
      toast({
        title: 'Please enter your preferences',
        description: 'Tell us what you like (e.g., "I love coffee and sweet pastries")',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    setRecommendations([]); // Clear previous results immediately

    // Simulate AI processing delay
    setTimeout(() => {
      try {
        const terms = preferences.toLowerCase().split(/\s+/).filter(t => t.length > 2);
        
        // Score products based on keyword matches
        const scoredProducts = products.map(product => {
          let score = 0;
          const searchText = `${product.name} ${product.description} ${product.category}`.toLowerCase();
          
          terms.forEach(term => {
            if (searchText.includes(term)) score += 1;
          });

          return { product, score };
        });

        // Sort by score and take top 3
        const matchedProducts = scoredProducts
          .filter(item => item.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 3)
          .map(item => ({
            id: item.product.id,
            name: item.product.name,
            reason: `Matches your interest in "${preferences}"`
          }));

        // Fallback if no direct matches found, show some popular items (optional, but good for "AI" feel)
        // For now, let's stick to strict matching to be accurate, or show a random one if empty?
        // Let's keep it strict for now.
        
        setRecommendations(matchedProducts);
        
        if (matchedProducts.length === 0) {
           // If nothing matches, maybe suggest our best sellers?
           // No, let's just show the empty state message.
        }

      } catch (error) {
        console.error('Recommendation error:', error);
        toast({
          title: 'Error getting recommendations',
          description: 'Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }, 1500);
  };

  const getProductById = (id: string) => {
    return products.find((p) => p.id === id);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      getRecommendations();
    }
  };

  return (
    <Card className="mb-16 max-w-3xl mx-auto shadow-xl border-primary/10 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-light" />
      <CardHeader className="text-center pb-2">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl font-serif">
          <Sparkles className="h-6 w-6 text-primary animate-pulse" />
          AI-Powered Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        <p className="text-muted-foreground text-center max-w-lg mx-auto">
          Tell us what you like and we'll suggest the perfect items for you!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
          <Input
            placeholder="E.g., I love strong coffee and healthy meals..."
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="flex-1 h-12 text-lg shadow-sm"
          />
          <Button onClick={getRecommendations} disabled={isLoading} size="lg" className="h-12 px-8 shadow-md">
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Thinking...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Ask AI
              </>
            )}
          </Button>
        </div>

        {hasSearched && !isLoading && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {recommendations.length > 0 ? (
              <>
                <div className="flex items-center justify-center gap-2 mb-6 mt-8">
                  <div className="h-px bg-border flex-1 max-w-[100px]" />
                  <h4 className="font-semibold text-primary">Recommended for you</h4>
                  <div className="h-px bg-border flex-1 max-w-[100px]" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-2 pb-4">
                  {recommendations.map((rec) => {
                    const product = getProductById(rec.id);
                    if (!product) return null;
                    return (
                      <div key={rec.id} className="space-y-3 group">
                        <div className="transform transition-all duration-300 group-hover:-translate-y-1">
                          <ProductCard product={product} />
                        </div>
                        <p className="text-sm text-muted-foreground italic text-center bg-muted/30 p-2 rounded-lg">
                          "{rec.reason}"
                        </p>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-8 bg-muted/10 rounded-xl border border-dashed border-muted mx-4">
                <p className="text-muted-foreground">
                  We couldn't find an exact match, but our 
                  <span className="font-semibold text-primary cursor-pointer hover:underline ml-1" onClick={() => setPreferences('coffee')}>Signature Cappuccino</span> is always a good choice!
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductRecommendations;
