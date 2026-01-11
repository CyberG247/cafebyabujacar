import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, Truck, MapPin, Loader2, Search, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered';

interface Order {
  orderId: string;
  status: OrderStatus;
  paymentMethod: string;
  customerName: string;
  deliveryAddress: string;
  total: number;
  createdAt: string;
  date: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

const statusSteps: { status: OrderStatus; label: string; icon: React.ElementType }[] = [
  { status: 'pending', label: 'Order Placed', icon: Clock },
  { status: 'confirmed', label: 'Confirmed', icon: CheckCircle },
  { status: 'preparing', label: 'Preparing', icon: Package },
  { status: 'out_for_delivery', label: 'On the Way', icon: Truck },
  { status: 'delivered', label: 'Delivered', icon: MapPin },
];

const getStatusIndex = (status: string): number => {
  const index = statusSteps.findIndex((s) => s.status === status);
  return index >= 0 ? index : 0;
};

// Simulate status progression based on time elapsed
const getSimulatedStatus = (createdAt: string): OrderStatus => {
  const now = new Date();
  const created = new Date(createdAt);
  const diffInMinutes = (now.getTime() - created.getTime()) / 1000 / 60;

  if (diffInMinutes < 2) return 'pending';
  if (diffInMinutes < 10) return 'confirmed';
  if (diffInMinutes < 25) return 'preparing';
  if (diffInMinutes < 45) return 'out_for_delivery';
  return 'delivered';
};

const TrackOrder = () => {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get('id') || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  // Fetch order on mount if params provided
  useEffect(() => {
    if (searchParams.get('id')) {
      fetchOrder(searchParams.get('id') || '');
    }
  }, []);

  const fetchOrder = async (searchId: string = orderId) => {
    const targetId = searchId.trim();
    if (!targetId) {
      toast({
        title: 'Order ID required',
        description: 'Please enter your order ID',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    setOrder(null);

    // Simulate network delay
    setTimeout(() => {
      try {
        const storedOrders = JSON.parse(localStorage.getItem('cafe_orders') || '[]');
        const foundOrder = storedOrders.find((o: any) => o.orderId === targetId);

        if (foundOrder) {
          // Update status based on time
          const currentStatus = getSimulatedStatus(foundOrder.createdAt);
          const updatedOrder = { ...foundOrder, status: currentStatus };
          setOrder(updatedOrder);
        } else {
          toast({
            title: 'Order not found',
            description: 'Could not find an order with that ID.',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch order details',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleSearch = () => fetchOrder(orderId);

  const currentStatusIndex = order ? getStatusIndex(order.status) : 0;

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl font-bold mb-4 flex items-center justify-center gap-3">
            <Package className="h-10 w-10 text-primary" />
            Track Order
          </h1>
          <p className="text-lg text-muted-foreground">
            Enter your order ID to track your delivery in real-time
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Enter Order ID (e.g. CAFE-ORD-2026-XXXX)"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Track
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Order Status */}
        {order && (
          <div className="space-y-6 animate-fade-in">
            {/* Status Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Order Status</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    #{order.orderId}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
                  <div
                    className="absolute left-6 top-0 w-0.5 bg-primary transition-all duration-500"
                    style={{
                      height: `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%`,
                    }}
                  />

                  {/* Status Steps */}
                  <div className="space-y-8">
                    {statusSteps.map((step, index) => {
                      const isCompleted = index <= currentStatusIndex;
                      const isCurrent = index === currentStatusIndex;
                      const Icon = step.icon;

                      return (
                        <div key={step.status} className="relative flex items-center gap-4">
                          <div
                            className={`z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                              isCompleted
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-border bg-background text-muted-foreground'
                            } ${isCurrent ? 'ring-4 ring-primary/20' : ''}`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p
                              className={`font-semibold ${
                                isCompleted ? 'text-foreground' : 'text-muted-foreground'
                              }`}
                            >
                              {step.label}
                            </p>
                            {isCurrent && (
                              <p className="text-sm text-primary animate-pulse">Current status</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Details */}
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Customer</p>
                    <p className="font-semibold">{order.customerName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Delivery Address</p>
                    <p className="font-semibold">{order.deliveryAddress}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Order Date</p>
                    <p className="font-semibold">
                      {order.date}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Payment Method</p>
                    <p className="font-semibold">{order.paymentMethod}</p>
                  </div>
                </div>

                {order.items.length > 0 && (
                  <div className="border-t pt-4">
                    <p className="text-sm text-muted-foreground mb-2">Items</p>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm py-1">
                        <span>
                          {item.name} x{item.quantity}
                        </span>
                        <span className="font-semibold">₦{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                      <span>Total</span>
                      <span className="text-primary">₦{order.total.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* No Order Found */}
        {hasSearched && !order && !isLoading && (
          <Card className="text-center py-12">
            <CardContent>
              <AlertCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="font-serif text-2xl font-semibold mb-2">Order not found</h2>
              <p className="text-muted-foreground mb-6">
                Please check your order ID and try again.
              </p>
              <Link to="/menu">
                <Button variant="hero">Browse Menu</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
