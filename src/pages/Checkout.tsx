import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { useOrders } from '@/hooks/useOrders';
import { useCryptoWallets } from '@/hooks/useCryptoWallets';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShoppingBag, ArrowLeft, Copy, Check, Clock } from 'lucide-react';

const Checkout = () => {
  const { cart, getTotalPrice, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { wallets } = useCryptoWallets();
  const [step, setStep] = useState<'cart' | 'address' | 'payment' | 'confirm'>('cart');
  const [deliveryAddress, setDeliveryAddress] = useState({
    name: '',
    street: '',
    city: '',
    postalCode: '',
    country: ''
  });
  const [paymentData, setPaymentData] = useState({
    orderId: '',
    paymentAddress: '',
    totalXMR: 0,
    customerCode: ''
  });
  const [txHash, setTxHash] = useState('');
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const navigate = useNavigate();

  // Countdown timer
  useEffect(() => {
    if (step === 'payment' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Payment expired
            alert('Zahlungsfrist abgelaufen. Bitte starten Sie den Bestellvorgang erneut.');
            navigate('/');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [step, timeLeft, navigate]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (cart.length === 0 && step === 'cart') {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Warenkorb ist leer</h2>
          <p className="text-gray-400 mb-6">Fügen Sie Produkte hinzu, um fortzufahren</p>
          <Button onClick={() => navigate('/')} className="bg-red-600 hover:bg-red-700">
            Zurück zum Marktplatz
          </Button>
        </div>
      </div>
    );
  }

  const proceedToAddress = () => {
    setStep('address');
  };

  const createOrder = () => {
    if (!deliveryAddress.name || !deliveryAddress.street || !deliveryAddress.city) {
      alert('Bitte füllen Sie alle Pflichtfelder aus');
      return;
    }

    const customerCode = 'CUST-' + Math.random().toString(36).substr(2, 8).toUpperCase();
    const orderId = 'ORD-' + Date.now();
    const totalXMR = getTotalPrice();
    
    // Use admin wallet address for payment
    const paymentAddress = wallets.xmrAddress || 'WALLET_NOT_CONFIGURED';
    
    const newOrder = addOrder({
      customerId: 'anonymous',
      vendorPseudonym: cart[0].sellerPseudonym, // Assuming single vendor for simplicity
      customerCode,
      items: cart.map(item => ({
        productId: item.productId,
        title: item.title,
        price: item.price,
        quantity: item.quantity
      })),
      totalAmount: totalXMR,
      currency: 'XMR',
      status: 'pending',
      paymentAddress,
      deliveryAddress: {
        ...deliveryAddress,
        isVisible: false
      }
    });

    setPaymentData({
      orderId,
      paymentAddress,
      totalXMR,
      customerCode
    });
    setStep('payment');
  };

  const confirmPayment = () => {
    if (!txHash.trim()) {
      alert('Bitte geben Sie den Transaction Hash ein');
      return;
    }
    
    // Simulate payment confirmation (in real app, this would verify on blockchain)
    setPaymentConfirmed(true);
    setStep('confirm');
    clearCart();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/90 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => {
                if (step === 'cart') navigate(-1);
                else if (step === 'address') setStep('cart');
                else if (step === 'payment') setStep('address');
              }}
              className="text-gray-400 hover:text-gray-100"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück
            </Button>
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-red-500" />
              <h1 className="text-xl font-bold">Checkout</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {step === 'cart' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Warenkorb überprüfen</h2>
            
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.productId} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-gray-400 text-sm">Von: @{item.sellerPseudonym}</p>
                      <p className="text-red-400 font-bold mt-2">
                        {item.price} {item.currency} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{(item.price * item.quantity).toFixed(3)} {item.currency}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={proceedToAddress}
              className="w-full bg-red-600 hover:bg-red-700"
              size="lg"
            >
              Zur Lieferadresse
            </Button>
          </div>
        )}

        {step === 'address' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Lieferadresse</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={deliveryAddress.name}
                  onChange={(e) => setDeliveryAddress(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-gray-100"
                />
              </div>
              <div>
                <Label htmlFor="street">Straße *</Label>
                <Input
                  id="street"
                  value={deliveryAddress.street}
                  onChange={(e) => setDeliveryAddress(prev => ({ ...prev, street: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-gray-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="postalCode">PLZ</Label>
                  <Input
                    id="postalCode"
                    value={deliveryAddress.postalCode}
                    onChange={(e) => setDeliveryAddress(prev => ({ ...prev, postalCode: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-gray-100"
                  />
                </div>
                <div>
                  <Label htmlFor="city">Stadt *</Label>
                  <Input
                    id="city"
                    value={deliveryAddress.city}
                    onChange={(e) => setDeliveryAddress(prev => ({ ...prev, city: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-gray-100"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="country">Land</Label>
                <Input
                  id="country"
                  value={deliveryAddress.country}
                  onChange={(e) => setDeliveryAddress(prev => ({ ...prev, country: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-gray-100"
                />
              </div>
            </div>

            <Button
              onClick={createOrder}
              className="w-full bg-red-600 hover:bg-red-700"
              size="lg"
            >
              Bestellung aufgeben
            </Button>
          </div>
        )}

        {step === 'payment' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Monero Zahlung</h2>
              <div className="flex items-center gap-2 text-red-400">
                <Clock className="h-5 w-5" />
                <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h4 className="font-semibold mb-2">Zahlungsdetails</h4>
              <div className="space-y-3 text-sm">
                <div>
                  <label className="text-gray-400">Betrag:</label>
                  <p className="font-mono text-red-400 font-bold">{paymentData.totalXMR.toFixed(6)} XMR</p>
                </div>
                <div>
                  <label className="text-gray-400">Adresse:</label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="bg-gray-700 p-2 rounded text-xs break-all flex-1">
                      {paymentData.paymentAddress}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(paymentData.paymentAddress)}
                      className="border-gray-600"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-gray-400">Bestell-ID:</label>
                  <p className="font-mono text-gray-300">{paymentData.orderId}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-gray-300 font-medium">Transaction Hash eingeben:</label>
              <Input
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                placeholder="Geben Sie hier Ihren TX-Hash ein..."
                className="bg-gray-700 border-gray-600 text-gray-100 focus:border-red-500"
              />
              <Button
                onClick={confirmPayment}
                disabled={!txHash.trim()}
                className="w-full bg-red-600 hover:bg-red-700"
                size="lg"
              >
                Zahlung bestätigen
              </Button>
            </div>
          </div>
        )}

        {step === 'confirm' && paymentConfirmed && (
          <div className="text-center space-y-6">
            <div className="bg-green-900/20 border border-green-700 rounded-lg p-8">
              <Check className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-400 mb-2">Zahlung bestätigt!</h2>
              <p className="text-gray-300 mb-4">
                Ihre Coins sind in unserer Wallet eingegangen.
              </p>
              
              <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-4">
                <h3 className="font-bold text-red-300 mb-2">Ihr Kunden-Code:</h3>
                <div className="flex items-center justify-center gap-2">
                  <code className="text-red-400 font-mono text-xl font-bold">
                    {paymentData.customerCode}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(paymentData.customerCode)}
                    className="border-red-500 text-red-400"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-red-300 text-sm mt-2">
                  Teilen Sie diesen Code mit dem Verkäufer für Ihre Bestellung
                </p>
              </div>
            </div>

            <Button
              onClick={() => navigate('/')}
              className="bg-red-600 hover:bg-red-700"
            >
              Zurück zum Marktplatz
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
