import { Link } from 'react-router-dom';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Package } from 'lucide-react';
import logo from '@/assets/logo.jpg';

interface ReceiptProps {
  open: boolean;
  onClose: () => void;
  orderData: {
    orderId: string;
    guestToken?: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    deliveryAddress: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    subtotal: number;
    deliveryFee: number;
    total: number;
    paymentMethod: string;
    date: string;
  };
}

const Receipt = ({ open, onClose, orderData }: ReceiptProps) => {
  const handlePrint = () => {
    window.print();
  };

  const trackingUrl = orderData.guestToken 
    ? `/track-order?id=${orderData.orderId}&token=${orderData.guestToken}`
    : `/track-order?id=${orderData.orderId}`;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 gap-0">
        <div id="receipt-content" className="bg-white text-black p-6 font-mono text-sm">
          {/* Header */}
          <div className="text-center mb-4">
            <img src={logo} alt="Café By ABUJACAR" className="w-20 h-20 mx-auto mb-2 rounded-full object-cover" />
            <h2 className="font-bold text-lg">CAFÉ BY ABUJACAR</h2>
            <p className="text-xs">Where Luxury Meets Flavor</p>
            <p className="text-xs mt-1">Abuja, Nigeria</p>
            <p className="text-xs">Phone: +234 XXX XXX XXXX</p>
          </div>

          <Separator className="my-3 bg-black" />

          {/* Order Details */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Order #:</span>
              <span className="font-bold">{orderData.orderId.slice(0, 8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{orderData.date}</span>
            </div>
            <div className="flex justify-between">
              <span>Customer:</span>
              <span>{orderData.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span>Phone:</span>
              <span>{orderData.customerPhone}</span>
            </div>
          </div>

          <Separator className="my-3 bg-black" />

          {/* Items */}
          <div className="space-y-2">
            <p className="font-bold text-xs">ITEMS:</p>
            {orderData.items.map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>{item.name}</span>
                </div>
                <div className="flex justify-between text-xs pl-2">
                  <span>{item.quantity} x ₦{item.price.toLocaleString()}</span>
                  <span className="font-bold">₦{(item.quantity * item.price).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-3 bg-black" />

          {/* Totals */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₦{orderData.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee:</span>
              <span>₦{orderData.deliveryFee.toLocaleString()}</span>
            </div>
            <Separator className="my-2 bg-black" />
            <div className="flex justify-between font-bold text-base">
              <span>TOTAL:</span>
              <span>₦{orderData.total.toLocaleString()}</span>
            </div>
          </div>

          <Separator className="my-3 bg-black" />

          {/* Payment Method */}
          <div className="text-xs">
            <div className="flex justify-between">
              <span>Payment Method:</span>
              <span className="font-bold">{orderData.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-green-600 font-bold mt-1">
              <span>Status:</span>
              <span>PAID</span>
            </div>
          </div>

          <Separator className="my-3 bg-black" />

          {/* Delivery Address */}
          <div className="text-xs">
            <p className="font-bold mb-1">DELIVERY ADDRESS:</p>
            <p className="pl-2">{orderData.deliveryAddress}</p>
          </div>

          <Separator className="my-3 bg-black" />

          {/* Footer */}
          <div className="text-center text-xs mt-4">
            <p className="font-bold">Thank you for your order!</p>
            <p className="mt-1">We'll deliver it to your doorstep!</p>
            <p className="mt-2 text-[10px]">*** CUSTOMER COPY ***</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 p-4 bg-muted print:hidden">
          <Link to={trackingUrl} className="w-full">
            <Button variant="hero" className="w-full">
              <Package className="h-4 w-4 mr-2" />
              Track Your Order
            </Button>
          </Link>
          <div className="flex gap-2">
            <Button onClick={handlePrint} className="flex-1">
              Print Receipt
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Receipt;
