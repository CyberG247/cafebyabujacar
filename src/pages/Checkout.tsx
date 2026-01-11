import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';
import PaymentDialog from '@/components/PaymentDialog';
import Receipt from '@/components/Receipt';

// Enhanced validation schema with stricter security rules
const checkoutSchema = z.object({
  name: z.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),
  
  email: z.string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters")
    .toLowerCase()
    .optional()
    .or(z.literal('')),
  
  phone: z.string()
    .trim()
    .min(10, "Phone number must be at least 10 characters")
    .max(20, "Phone number must be less than 20 characters")
    .regex(/^\+?[0-9\s()-]+$/, "Phone number can only contain numbers and basic formatting characters"),
  
  address: z.string()
    .trim()
    .min(10, "Address must be at least 10 characters")
    .max(500, "Address must be less than 500 characters"),
});

// Generate a secure random token for guest orders
const generateGuestToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};
const SIMULATE_PAYMENT = import.meta.env.VITE_SIMULATE_PAYMENT === 'true';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    orderNotes: '',
    deliveryOption: 'delivery',
  });
  const [showPayment, setShowPayment] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const pendingOrderIdRef = useRef<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    try {
      checkoutSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Invalid information',
          description: error.errors[0].message,
          variant: 'destructive',
        });
        return;
      }
    }

    try {
      const subtotal = getCartTotal();
      const deliveryFee = 500;
      const total = subtotal + deliveryFee;

      if (SIMULATE_PAYMENT) {
        // Generate a friendly demo order ID
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const friendlyOrderId = `CAFE-ORD-2026-${randomNum}`;
        const guestToken = generateGuestToken();
        
        sessionStorage.setItem(`order_${friendlyOrderId}_token`, guestToken);
        setPendingOrderId(friendlyOrderId);
        if (pendingOrderIdRef) pendingOrderIdRef.current = friendlyOrderId;
        
        // Store temp order data for receipt
        sessionStorage.setItem(`order_${friendlyOrderId}_data`, JSON.stringify({
           ...formData,
           subtotal,
           deliveryFee,
           total
        }));

        setShowPayment(true);
        return;
      }

      console.log('Creating order with data:', { 
        name: formData.name, 
        email: formData.email,
        notes: formData.orderNotes,
        subtotal, 
        deliveryFee, 
        total 
      });

      const { data: { user } } = await supabase.auth.getUser();
      const guestToken = !user ? generateGuestToken() : null;

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id || null,
          guest_token: guestToken,
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          delivery_address: formData.address,
          notes: formData.orderNotes,
          subtotal,
          delivery_fee: deliveryFee,
          total,
          status: 'pending',
          payment_status: 'pending',
        })
        .select()
        .single();

      if (orderError) {
        console.error('Order creation error:', orderError);
        throw orderError;
      }

      console.log('Order created successfully:', order.id);

      // Create order items
      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        product_price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      }));

      console.log('Creating order items:', orderItems.length);

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Order items error:', itemsError);
        throw itemsError;
      }

      console.log('Order items created successfully');

      // Store guest token in sessionStorage for future access
      if (guestToken) {
        sessionStorage.setItem(`order_${order.id}_token`, guestToken);
      }

      // Store order ID for payment
      setPendingOrderId(order.id);
      if (pendingOrderIdRef) pendingOrderIdRef.current = order.id;
      
      console.log('Opening payment dialog');
      
      // Show payment dialog
      setShowPayment(true);
    } catch (error: any) {
      console.error('Error placing order:', error);
      toast({
        title: 'Error placing order',
        description: error.message || 'There was a problem placing your order. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handlePaymentSuccess = async (reference: string) => {
    const currentOrderId = pendingOrderId || (pendingOrderIdRef ? pendingOrderIdRef.current : null);
    
    if (!currentOrderId) {
      console.error('No pending order ID found');
      toast({
        title: 'Error',
        description: 'Could not find order details. Please contact support.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const guestToken = sessionStorage.getItem(`order_${currentOrderId}_token`);
      
      const isPod = reference === 'PAY-ON-DELIVERY';
      const isSimulated = reference.toString().startsWith('SIM-');
      const paymentStatus = isPod ? 'pending' : 'paid';
      
      if (!SIMULATE_PAYMENT && !isSimulated && !currentOrderId.startsWith('CAFE-ORD-')) {
        const { data: success, error } = await supabase.rpc('update_order_payment_status', {
          p_order_id: currentOrderId,
          p_guest_token: guestToken || '',
          p_payment_status: paymentStatus,
          p_status: 'confirmed'
        });

        if (error || !success) {
          console.error('Payment update error:', error);
          toast({
             title: 'Note',
             description: 'Order placed locally (Server sync failed).',
             duration: 3000,
          });
        }
      }

      // Store tracking info in sessionStorage for the receipt
      const guestTokenForTracking = sessionStorage.getItem(`order_${currentOrderId}_token`);
      
      // Prepare receipt data
      const receiptData = {
        orderId: currentOrderId,
        guestToken: guestTokenForTracking,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        deliveryAddress: formData.address,
        orderNotes: formData.orderNotes,
        items: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal: getCartTotal(),
        deliveryFee: 500,
        total: getCartTotal() + 500,
        paymentMethod: isPod ? 'Pay on Delivery' : 'Paystack (Simulated)',
        date: new Date().toLocaleString('en-NG', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'confirmed', // Initial status for tracking
        createdAt: new Date().toISOString(),
      };

      // Save to local storage for tracking (simulating backend)
      try {
        const existingOrders = JSON.parse(localStorage.getItem('cafe_orders') || '[]');
        // Check if order already exists to avoid duplicates
        if (!existingOrders.some((o: any) => o.orderId === currentOrderId)) {
          existingOrders.push(receiptData);
          localStorage.setItem('cafe_orders', JSON.stringify(existingOrders));
        }
      } catch (e) {
        console.error('Error saving order locally:', e);
      }

      setOrderData(receiptData);
      setShowReceipt(true);
      clearCart();
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: 'Payment Error',
        description: 'Payment was successful but there was an error updating the order.',
        variant: 'destructive',
      });
    }
  };

  const handleReceiptClose = () => {
    setShowReceipt(false);
    navigate('/');
  };

  if (cart.length === 0 && !showReceipt && !orderData) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="font-serif text-4xl font-bold mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <Card className="p-6 mb-6">
            <h2 className="font-serif text-2xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+234 XXX XXX XXXX"
                  required
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 mb-6">
            <h2 className="font-serif text-2xl font-semibold mb-4">Delivery Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="address">Delivery Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter your delivery address"
                  required
                />
              </div>
              <div>
                <Label htmlFor="notes">Order Notes (Optional)</Label>
                <textarea
                  id="notes"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.orderNotes}
                  onChange={(e) => setFormData({ ...formData, orderNotes: e.target.value })}
                  placeholder="Any special instructions for delivery or preparation..."
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 mb-6">
            <h2 className="font-serif text-2xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <span className="font-semibold">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">₦{getCartTotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-semibold">₦500</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">₦{(getCartTotal() + 500).toLocaleString()}</span>
              </div>
            </div>
          </Card>

          <Button type="submit" variant="hero" size="lg" className="w-full">
            Proceed to Payment
          </Button>
          <p className="text-sm text-muted-foreground text-center mt-4">
            Secure payment powered by Paystack
          </p>
        </form>

        {/* Payment Dialog */}
        <PaymentDialog
          open={showPayment}
          onClose={() => setShowPayment(false)}
          amount={getCartTotal() + 500}
          email={formData.email || 'guest@example.com'}
          name={formData.name}
          phone={formData.phone}
          onSuccess={handlePaymentSuccess}
        />

        {/* Receipt Dialog */}
        {orderData && (
          <Receipt
            open={showReceipt}
            onClose={handleReceiptClose}
            orderData={orderData}
          />
        )}
        
        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground font-medium bg-muted/50 p-3 rounded-lg inline-block">
            🚧 This is a demo application. Payments are simulated for demonstration purposes only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;