
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingBag, ArrowLeft, Copy, Check } from 'lucide-react';

const Checkout = () => {
  const { cart, getTotalPrice, clearCart } = useCart();
  const [step, setStep] = useState<'cart' | 'payment' | 'confirm'>('cart');
  const [paymentData, setPaymentData] = useState({
    orderId: '',
    paymentAddress: '',
    totalXMR: 0
  });
  const [txHash, setTxHash] = useState('');
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

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

  const createOrder = () => {
    // Simulate API call to create order
    const mockOrderId = 'order-' + Date.now();
    const mockAddress = '4' + Array.from({length: 94}, () => Math.random().toString(36)[2]).join('');
    const totalXMR = getTotalPrice();

    setPaymentData({
      orderId: mockOrderId,
      paymentAddress: mockAddress,
      totalXMR
    });
    setStep('payment');
  };

  const confirmPayment = () => {
    if (!txHash.trim()) {
      alert('Bitte geben Sie den Transaction Hash ein');
      return;
    }
    
    // Simulate payment confirmation
    setStep('confirm');
    clearCart();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateQRCode = (address: string) => {
    // Simple QR code simulation using placeholder
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=monero:${address}?amount=${paymentData.totalXMR}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/90 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => step === 'cart' ? navigate(-1) : setStep('cart')}
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

            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex justify-between text-xl font-bold">
                <span>Gesamt:</span>
                <span className="text-red-400">{getTotalPrice().toFixed(3)} XMR</span>
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
            <h2 className="text-2xl font-bold">Monero Zahlung</h2>
            
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
              <h3 className="text-lg font-semibold mb-4">QR-Code scannen</h3>
              <div className="bg-white p-4 rounded-lg inline-block mb-4">
                <img 
                  src={generateQRCode(paymentData.paymentAddress)}
                  alt="Monero Payment QR Code"
                  className="w-48 h-48"
                />
              </div>
              <p className="text-sm text-gray-400">Oder Adresse manuell kopieren:</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
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

            <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
              <p className="text-yellow-300 text-sm">
                <strong>Wichtig:</strong> Senden Sie genau den angegebenen Betrag an die Adresse. 
                Nach der Zahlung geben Sie den Transaction Hash unten ein.
              </p>
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

        {step === 'confirm' && (
          <div className="text-center space-y-6">
            <div className="bg-green-900/20 border border-green-700 rounded-lg p-8">
              <Check className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-400 mb-2">Zahlung eingegangen!</h2>
              <p className="text-gray-300">
                Ihre Bestellung wird verarbeitet. Sie erhalten Ihre Downloads nach der Bestätigung.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 text-left">
              <h3 className="font-semibold mb-2">Nächste Schritte:</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Warten Sie auf 10+ Netzwerk-Bestätigungen</li>
                <li>• Download-Links werden dann verfügbar</li>
                <li>• Links laufen nach 24 Stunden ab</li>
              </ul>
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
