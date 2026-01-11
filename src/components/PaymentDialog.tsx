import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePaystackPayment } from 'react-paystack';
import { CreditCard, Smartphone, Building2, Truck, ArrowLeft, Loader2, Copy, CheckCircle2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PaymentDialogProps {
  open: boolean;
  onClose: () => void;
  amount: number;
  email: string;
  name: string;
  phone: string;
  onSuccess: (reference: string) => void;
}

const PaymentDialog = ({ open, onClose, amount, email, name, phone, onSuccess }: PaymentDialogProps) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [view, setView] = useState<'selection' | 'card' | 'transfer' | 'ussd'>('selection');
  const [isProcessing, setIsProcessing] = useState(false);

  // Check if Paystack key is configured
  const paystackPublicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
  const simulate = (import.meta.env.VITE_SIMULATE_PAYMENT === 'true') || !paystackPublicKey;
  
  if (!paystackPublicKey) {
    console.error('CRITICAL: Paystack public key is not configured. Running in simulation mode.');
  }

  const config = {
    reference: `CAF-${new Date().getTime()}`,
    email,
    amount: amount * 100, // Paystack expects amount in kobo
    publicKey: paystackPublicKey || 'pk_test_placeholder',
    metadata: {
      custom_fields: [
        {
          display_name: 'Customer Name',
          variable_name: 'customer_name',
          value: name,
        },
        {
          display_name: 'Phone',
          variable_name: 'phone',
          value: phone,
        },
      ],
    },
  };

  const initializePayment = usePaystackPayment(config);

  const handlePaymentSuccess = (reference: any) => {
    toast({
      title: 'Payment Successful!',
      description: 'Your payment has been processed successfully.',
    });
    onSuccess(reference.reference);
    onClose();
  };

  const handlePaymentClose = () => {
    toast({
      title: 'Payment Cancelled',
      description: 'You cancelled the payment process.',
      variant: 'destructive',
    });
  };

  const processPayment = () => {
    setIsProcessing(true);
    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false);
      const reference = { reference: `SIM-${Date.now()}` } as any;
      handlePaymentSuccess(reference);
      setTimeout(() => setView('selection'), 500); // Reset view after success
    }, 2000);
  };

  const handlePayment = (method: string) => {
    setSelectedMethod(method);

    if (method === 'pod') {
      toast({
        title: 'Order Placed',
        description: 'Your order has been placed successfully.',
      });
      onSuccess('PAY-ON-DELIVERY');
      onClose();
      return;
    }

    if (simulate && method !== 'all') {
      setView(method as any);
      return;
    }

    console.log('Initializing payment with method:', method);
    
    initializePayment({
      onSuccess: handlePaymentSuccess,
      onClose: handlePaymentClose,
      config: {
        ...config,
        channels: method === 'card' 
          ? ['card'] 
          : method === 'ussd' 
            ? ['ussd'] 
            : method === 'transfer' 
              ? ['bank_transfer'] 
              : ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (!val) {
        setView('selection');
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-md transition-all duration-300">
        <DialogHeader>
          <div className="bg-amber-100 text-amber-800 p-2 rounded-md text-center text-sm font-medium mb-2 border border-amber-200">
            Demo Payment – No Real Money Charged
          </div>
          <div className="flex items-center gap-2">
            {view !== 'selection' && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="-ml-2 h-8 w-8" 
                onClick={() => setView('selection')}
                disabled={isProcessing}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <DialogTitle className="font-serif text-2xl">
              {view === 'selection' ? 'Choose Payment Method' : 
               view === 'card' ? 'Card Payment' :
               view === 'transfer' ? 'Bank Transfer' : 'USSD Payment'}
            </DialogTitle>
          </div>
        </DialogHeader>
        
        {view === 'selection' ? (
          <div className="space-y-3 py-4">
            <div className="text-center mb-4">
              <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
              <p className="text-3xl font-bold text-primary">₦{amount.toLocaleString()}</p>
            </div>

            <Button
              onClick={() => handlePayment('pod')}
              variant="outline"
              className="w-full h-16 justify-start gap-4 hover:border-primary hover:bg-primary/5"
            >
              <Truck className="h-6 w-6" />
              <div className="text-left">
                <p className="font-semibold">Pay on Delivery</p>
                <p className="text-xs text-muted-foreground">Cash or Transfer on delivery</p>
              </div>
            </Button>

            <Button
              onClick={() => handlePayment('card')}
              variant="outline"
              className="w-full h-16 justify-start gap-4 hover:border-primary hover:bg-primary/5"
            >
              <CreditCard className="h-6 w-6" />
              <div className="text-left">
                <p className="font-semibold">Pay with Card {simulate && '(Simulated)'}</p>
                <p className="text-xs text-muted-foreground">Debit/Credit Card</p>
              </div>
            </Button>

            <Button
              onClick={() => handlePayment('transfer')}
              variant="outline"
              className="w-full h-16 justify-start gap-4 hover:border-primary hover:bg-primary/5"
            >
              <Building2 className="h-6 w-6" />
              <div className="text-left">
                <p className="font-semibold">Bank Transfer {simulate && '(Simulated)'}</p>
                <p className="text-xs text-muted-foreground">Direct bank transfer</p>
              </div>
            </Button>

            <Button
              onClick={() => handlePayment('ussd')}
              variant="outline"
              className="w-full h-16 justify-start gap-4 hover:border-primary hover:bg-primary/5"
            >
              <Smartphone className="h-6 w-6" />
              <div className="text-left">
                <p className="font-semibold">USSD {simulate && '(Simulated)'}</p>
                <p className="text-xs text-muted-foreground">Pay with USSD code</p>
              </div>
            </Button>

            <Button
              onClick={() => handlePayment('all')}
              variant="default"
              className="w-full h-16 mt-2"
            >
              <span className="font-semibold">Show All Payment Options</span>
            </Button>
          </div>
        ) : (
          <div className="py-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground mb-1">Amount to Pay</p>
              <p className="text-3xl font-bold text-primary">₦{amount.toLocaleString()}</p>
            </div>

            {view === 'card' && (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input id="card-number" placeholder="0000 0000 0000 0000" defaultValue="4242 4242 4242 4242" readOnly className="font-mono bg-muted/50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" placeholder="MM/YY" defaultValue="12/28" readOnly className="font-mono bg-muted/50" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" defaultValue="123" readOnly className="font-mono bg-muted/50" />
                  </div>
                </div>
                <div className="pt-4">
                  <Button className="w-full h-12 text-lg" onClick={processPayment} disabled={isProcessing}>
                    {isProcessing ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
                    ) : (
                      `Pay ₦${amount.toLocaleString()}`
                    )}
                  </Button>
                </div>
              </div>
            )}

            {view === 'transfer' && (
              <div className="space-y-6">
                <div className="bg-muted/50 p-6 rounded-xl border border-border space-y-4 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Bank Name</p>
                    <p className="font-bold text-lg">Café Demo Bank</p>
                  </div>
                  <div className="h-px bg-border/50" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Account Number</p>
                    <div className="flex items-center justify-center gap-2 bg-background p-2 rounded-lg border border-border border-dashed">
                      <p className="font-mono text-2xl font-bold tracking-widest">1234 5678 90</p>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="h-px bg-border/50" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Beneficiary</p>
                    <p className="font-medium">Café By Abujacar</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 text-blue-800 text-xs p-3 rounded-lg flex gap-2 items-start">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
                  <p>Transfer the exact amount of ₦{amount.toLocaleString()} to the account above. The system will automatically confirm your payment.</p>
                </div>

                <Button className="w-full h-12 text-lg" onClick={processPayment} disabled={isProcessing}>
                   {isProcessing ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Verifying Transfer...</>
                    ) : (
                      'I have sent the money'
                    )}
                </Button>
              </div>
            )}

            {view === 'ussd' && (
              <div className="space-y-6">
                <div className="bg-muted/50 p-8 rounded-xl border border-border text-center">
                  <Smartphone className="h-12 w-12 mx-auto text-primary mb-4 opacity-20" />
                  <p className="text-sm text-muted-foreground mb-4">Dial the code below on your mobile phone to complete the payment</p>
                  <div className="bg-background p-4 rounded-lg border-2 border-primary/20 inline-block shadow-sm">
                    <p className="font-mono text-2xl font-bold text-primary tracking-wider">*894*000*888#</p>
                  </div>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  <p>1. Dial the code</p>
                  <p>2. Follow the prompts</p>
                  <p>3. Click the button below</p>
                </div>

                <Button className="w-full h-12 text-lg" onClick={processPayment} disabled={isProcessing}>
                   {isProcessing ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Confirming...</>
                    ) : (
                      'I have completed the transaction'
                    )}
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="text-center text-xs text-muted-foreground mt-2">
          <p>{simulate ? 'Simulation mode: no real charge' : 'Secured by Paystack'}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
