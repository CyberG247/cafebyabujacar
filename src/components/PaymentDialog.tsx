import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { usePaystackPayment } from 'react-paystack';
import { CreditCard, Smartphone, Building2 } from 'lucide-react';
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

  // Check if Paystack key is configured
  const paystackPublicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
  
  if (!paystackPublicKey) {
    console.error('CRITICAL: Paystack public key is not configured. Please add PAYSTACK_PUBLIC_KEY to your secrets.');
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

  const handlePayment = (method: string) => {
    if (!paystackPublicKey) {
      toast({
        title: 'Payment Configuration Error',
        description: 'Payment system is not configured. Please contact support.',
        variant: 'destructive',
      });
      return;
    }

    setSelectedMethod(method);
    
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Choose Payment Method</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 py-4">
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
            <p className="text-3xl font-bold text-primary">₦{amount.toLocaleString()}</p>
          </div>

          <Button
            onClick={() => handlePayment('card')}
            variant="outline"
            className="w-full h-16 justify-start gap-4"
          >
            <CreditCard className="h-6 w-6" />
            <div className="text-left">
              <p className="font-semibold">Pay with Card</p>
              <p className="text-xs text-muted-foreground">Debit/Credit Card</p>
            </div>
          </Button>

          <Button
            onClick={() => handlePayment('transfer')}
            variant="outline"
            className="w-full h-16 justify-start gap-4"
          >
            <Building2 className="h-6 w-6" />
            <div className="text-left">
              <p className="font-semibold">Bank Transfer</p>
              <p className="text-xs text-muted-foreground">Direct bank transfer</p>
            </div>
          </Button>

          <Button
            onClick={() => handlePayment('ussd')}
            variant="outline"
            className="w-full h-16 justify-start gap-4"
          >
            <Smartphone className="h-6 w-6" />
            <div className="text-left">
              <p className="font-semibold">USSD</p>
              <p className="text-xs text-muted-foreground">Pay with USSD code</p>
            </div>
          </Button>

          <Button
            onClick={() => handlePayment('all')}
            variant="default"
            className="w-full h-16"
          >
            <span className="font-semibold">Show All Payment Options</span>
          </Button>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          <p>Secured by Paystack</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
