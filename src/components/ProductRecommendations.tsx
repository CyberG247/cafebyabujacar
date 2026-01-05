import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { products } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import { supabase } from '@/integrations/supabase/client';
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

    try {
      const { data, error } = await supabase.functions.invoke('recommend', {
        body: { preferences },
      });

      if (error) throw error;

      setRecommendations(data?.recommendations || []);
    } catch (error) {
      console.error('Recommendation error:', error);
      toast({
        title: 'Error getting recommendations',
        description: 'Please try again later.',
        variant: 'destructive',
      });
      setRecommendations([]);
    } finally {
      setIsLoading(false);
    }
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
    <Card className="mb-12">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI-Powered Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          Tell us what you like and we'll suggest the perfect items for you!
        </p>
        
        <div className="flex gap-3 mb-6">
          <Input
            placeholder="E.g., I love strong coffee and healthy meals..."
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="flex-1"
          />
          <Button onClick={getRecommendations} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Finding...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Get Recommendations
              </>
            )}
          </Button>
        </div>

        {hasSearched && recommendations.length > 0 && (
          <div>
            <h4 className="font-semibold mb-4">Recommended for you:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendations.map((rec) => {
                const product = getProductById(rec.id);
                if (!product) return null;
                return (
                  <div key={rec.id} className="space-y-2">
                    <ProductCard product={product} />
                    <p className="text-sm text-muted-foreground italic px-2">
                      "{rec.reason}"
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {hasSearched && recommendations.length === 0 && !isLoading && (
          <p className="text-muted-foreground text-center py-4">
            No recommendations found. Try different preferences!
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductRecommendations;
