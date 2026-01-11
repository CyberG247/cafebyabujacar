import { Link } from 'react-router-dom';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Download, Home, Share2 } from 'lucide-react';
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
    orderNotes?: string;
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
  const handleDownload = () => {
    const element = document.getElementById('receipt-content');
    const opt = {
      margin: 10,
      filename: `Receipt-${orderData.orderId}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false, scrollY: 0 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // @ts-ignore
    if (window.html2pdf) {
      // @ts-ignore
      window.html2pdf().set(opt).from(element).save().catch(err => {
        console.error('PDF generation failed:', err);
        window.print();
      });
    } else {
      window.print();
    }
  };

  const trackingUrl = orderData.guestToken 
    ? `/track-order?id=${orderData.orderId}&token=${orderData.guestToken}`
    : `/track-order?id=${orderData.orderId}`;

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <style>{`
        @media print {
          body > * {
            display: none !important;
          }
          body:after {
            content: "";
            display: none;
          }
          /* Make sure the receipt content is the only thing visible */
          #receipt-content {
            display: block !important;
            visibility: visible !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 20px !important;
            background: white !important;
            color: black !important;
            z-index: 99999 !important;
            overflow: visible !important;
            max-height: none !important;
          }
          #receipt-content * {
            visibility: visible !important;
            color: black !important;
          }
          /* Hide buttons */
          .print\:hidden {
            display: none !important;
          }
        }
      `}</style>
      <DialogContent className="max-w-md p-0 gap-0 overflow-hidden">
        <div id="receipt-content" className="bg-white text-black p-6 font-mono text-sm max-h-[80vh] overflow-y-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden border-2 border-primary/20 p-1">
              <img src={logo} alt="Café By ABUJACAR" className="w-full h-full rounded-full object-cover" />
            </div>
            <h2 className="font-serif font-bold text-xl tracking-wide text-primary">CAFÉ BY ABUJACAR</h2>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Where Luxury Meets Flavor</p>
            
            <div className="text-xs text-muted-foreground space-y-0.5">
              <p>Plot 53 Bala Kona St, Kado</p>
              <p>FCT Abuja, Nigeria</p>
              <p>info@cafeabujacar.com</p>
              <p>+234 800 CAFÉ CAR</p>
            </div>
          </div>

          <div className="border-t-2 border-b-2 border-dashed border-gray-200 py-3 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Order No</span>
              <span className="font-mono font-bold text-lg">{orderData.orderId.toUpperCase()}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Date</span>
              <span>{orderData.date}</span>
            </div>
          </div>

          {/* Customer Details */}
          <div className="mb-4 text-xs space-y-1 bg-muted/30 p-3 rounded-lg">
            <p className="font-bold text-muted-foreground uppercase text-[10px] mb-2">Customer Details</p>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-medium">{orderData.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phone:</span>
              <span className="font-medium">{orderData.customerPhone}</span>
            </div>
            {orderData.customerEmail && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{orderData.customerEmail}</span>
              </div>
            )}
          </div>

          <Separator className="my-3" />

          {/* Items */}
          <div className="space-y-3 mb-4">
            <p className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Order Items</p>
            {orderData.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm group">
                <div className="flex gap-2">
                  <span className="font-bold w-6 text-center bg-muted rounded text-xs py-0.5 h-fit">{item.quantity}x</span>
                  <span className="group-hover:text-primary transition-colors">{item.name}</span>
                </div>
                <span className="font-medium">₦{(item.quantity * item.price).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <Separator className="my-3" />

          {/* Totals */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>₦{orderData.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Delivery Fee</span>
              <span>₦{orderData.deliveryFee.toLocaleString()}</span>
            </div>
            <div className="my-2 border-t border-black/10" />
            <div className="flex justify-between font-bold text-lg items-end">
              <span>Total Amount</span>
              <span className="text-primary">₦{orderData.total.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-6 bg-muted/50 p-3 rounded border border-border">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Payment Method</span>
              <span className="font-medium">{orderData.paymentMethod}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Status</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                orderData.paymentMethod === 'Pay on Delivery' 
                  ? 'bg-orange-100 text-orange-700' 
                  : 'bg-green-100 text-green-700'
              }`}>
                {orderData.paymentMethod === 'Pay on Delivery' ? 'PENDING PAYMENT' : 'PAID SUCCESSFUL'}
              </span>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="mt-4 text-xs text-center">
            <p className="font-bold text-muted-foreground uppercase text-[10px] mb-1">Delivering To</p>
            <p className="font-medium">{orderData.deliveryAddress}</p>
          </div>

          {orderData.orderNotes && (
            <div className="mt-4 text-xs text-center">
              <p className="font-bold text-muted-foreground uppercase text-[10px] mb-1">Order Notes</p>
              <p className="italic text-muted-foreground">"{orderData.orderNotes}"</p>
            </div>
          )}

          {/* Footer */}
          <div className="text-center mt-8 pt-4 border-t border-dashed border-gray-200">
            <div className="flex justify-center mb-2">
              <img src={logo} alt="Logo" className="w-8 h-8 opacity-20 grayscale" />
            </div>
            <p className="font-serif font-bold text-sm">Thank you for dining with us!</p>
            <p className="text-[10px] text-muted-foreground mt-1">
              For support, contact info@cafeabujacar.com
            </p>
            <p className="mt-4 text-[10px] font-mono text-muted-foreground/50">
              {new Date().toISOString()} • {orderData.orderId}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 p-6 bg-muted/30 border-t print:hidden">
          <Button onClick={handleDownload} size="lg" className="w-full shadow-lg hover:shadow-xl transition-all">
            <Download className="mr-2 h-4 w-4" />
            Download Receipt (PDF)
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
             <Button variant="outline" className="w-full" onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'Café By Abujacar Receipt',
                    text: `Receipt for Order ${orderData.orderId}`,
                    url: window.location.href
                  }).catch(console.error);
                } else {
                  handleDownload();
                }
             }}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button onClick={onClose} variant="outline" className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Receipt;
