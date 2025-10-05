import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { useCryptoRates } from '@/hooks/useCryptoRates';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, decreaseQuantity, increaseQuantity, getTotalPrice, clearCart } = useCart();
  const { rates, convertEurToCrypto } = useCryptoRates();
  
  const [step, setStep] = useState<'cart' | 'currency' | 'details' | 'payment'>('cart');
  const [selectedCurrency, setSelectedCurrency] = useState<'btc' | 'xmr' | 'ltc' | 'usdt'>('btc');
  const [contactMethod, setContactMethod] = useState<'email' | 'session' | 'signal'>('email');
  const [contactValue, setContactValue] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentAddress, setPaymentAddress] = useState('');
  const [orderId, setOrderId] = useState('');

  const totalEur = getTotalPrice();

  const currencyNames = {
    btc: 'Bitcoin',
    xmr: 'Monero',
    ltc: 'Litecoin',
    usdt: 'USDT'
  };

  if (cart.length === 0 && step === 'cart') {
    return (
      <div className="min-h-screen bg-gray-900 p-4">
        <div className="container mx-auto max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6 text-gray-400"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Marketplace
          </Button>
          <Card className="bg-gray-800 border-gray-700 p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-100 mb-4">Your cart is empty</h2>
            <p className="text-gray-400 mb-6">Add some products before checking out</p>
            <Button onClick={() => navigate('/')}>Browse Products</Button>
          </Card>
        </div>
      </div>
    );
  }

  const handleCurrencySelection = () => {
    setStep('details');
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactValue || !shippingAddress) {
      alert('Please fill in all required fields');
      return;
    }

    // Generate order ID
    const newOrderId = 'ORD-' + Date.now();
    setOrderId(newOrderId);

    // Get vendor's crypto address
    const firstItem = cart[0];
    const licenses = JSON.parse(localStorage.getItem('vendor_licenses') || '[]');
    const vendor = licenses.find((l: any) => l.username === firstItem.sellerPseudonym);
    
    let address = '';
    if (vendor?.cryptoAddresses) {
      switch(selectedCurrency) {
        case 'btc': address = vendor.cryptoAddresses.btc; break;
        case 'xmr': address = vendor.cryptoAddresses.xmr; break;
        case 'ltc': address = vendor.cryptoAddresses.ltc; break;
        case 'usdt': address = vendor.cryptoAddresses.usdc; break;
      }
    }

    setPaymentAddress(address || 'Address not configured by vendor');
    
    // Save order
    const orders = JSON.parse(localStorage.getItem('anonshop_orders') || '[]');
    orders.push({
      orderId: newOrderId,
      items: cart,
      totalEur,
      currency: selectedCurrency,
      cryptoAmount: convertEurToCrypto(totalEur, selectedCurrency),
      contactMethod,
      contactValue,
      shippingAddress,
      paymentAddress: address,
      status: 'pending',
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('anonshop_orders', JSON.stringify(orders));

    setStep('payment');
  };

  const handlePaymentConfirm = () => {
    clearCart();
    navigate('/checkout/success');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="container mx-auto max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => step === 'cart' ? navigate('/') : setStep('cart')}
          className="mb-6 text-gray-400"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {step === 'cart' && (
          <Card className="bg-gray-800 border-gray-700 p-6">
            <h2 className="text-2xl font-bold text-gray-100 mb-6">Shopping Cart</h2>
            
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.productId} className="flex items-center gap-4 p-4 bg-gray-700 rounded-lg">
                  {item.image && (
                    <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-100">{item.title}</h3>
                    <p className="text-sm text-gray-400">by {item.sellerPseudonym}</p>
                    <p className="text-lg text-green-400 font-bold">€{item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => decreaseQuantity(item.productId)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center text-gray-100">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => increaseQuantity(item.productId)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeFromCart(item.productId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-600">
              <div className="flex justify-between items-center text-xl font-bold text-gray-100">
                <span>Total (EUR):</span>
                <span>€{totalEur.toFixed(2)}</span>
              </div>
            </div>

            <Button onClick={() => setStep('currency')} className="w-full mt-6">
              Continue to Currency Selection
            </Button>
          </Card>
        )}

        {step === 'currency' && (
          <Card className="bg-gray-800 border-gray-700 p-6">
            <h2 className="text-2xl font-bold text-gray-100 mb-6">Select Payment Currency</h2>
            
            <div className="mb-6">
              <p className="text-gray-400 mb-4">Total: €{totalEur.toFixed(2)}</p>
            </div>

            <RadioGroup value={selectedCurrency} onValueChange={(v: any) => setSelectedCurrency(v)}>
              <div className="space-y-3">
                {(['btc', 'xmr', 'ltc', 'usdt'] as const).map((currency) => (
                  <div key={currency} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value={currency} id={currency} />
                      <Label htmlFor={currency} className="text-lg cursor-pointer">
                        {currencyNames[currency]} ({currency.toUpperCase()})
                      </Label>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-bold">
                        {convertEurToCrypto(totalEur, currency)} {currency.toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-400">
                        Rate: 1 {currency.toUpperCase()} = €{rates[currency].toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>

            <Button onClick={handleCurrencySelection} className="w-full mt-6">
              Continue
            </Button>
          </Card>
        )}

        {step === 'details' && (
          <Card className="bg-gray-800 border-gray-700 p-6">
            <h2 className="text-2xl font-bold text-gray-100 mb-6">Contact & Shipping Details</h2>
            
            <form onSubmit={handleDetailsSubmit} className="space-y-6">
              <div>
                <Label className="text-lg mb-3 block">Contact Method</Label>
                <RadioGroup value={contactMethod} onValueChange={(v: any) => setContactMethod(v)}>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="email" id="email" />
                      <Label htmlFor="email" className="cursor-pointer">Email</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="session" id="session" />
                      <Label htmlFor="session" className="cursor-pointer">Session-ID</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="signal" id="signal" />
                      <Label htmlFor="signal" className="cursor-pointer">Signal Number</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="contact">
                  {contactMethod === 'email' && 'Email Address'}
                  {contactMethod === 'session' && 'Session-ID'}
                  {contactMethod === 'signal' && 'Signal Number'}
                </Label>
                <Input
                  id="contact"
                  value={contactValue}
                  onChange={(e) => setContactValue(e.target.value)}
                  placeholder={
                    contactMethod === 'email' ? 'your@email.com' :
                    contactMethod === 'session' ? 'Session ID' :
                    'Signal Number'
                  }
                  className="bg-gray-700 border-gray-600"
                  required
                />
              </div>

              <div>
                <Label htmlFor="address">Shipping Address</Label>
                <Textarea
                  id="address"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Enter your full shipping address..."
                  className="bg-gray-700 border-gray-600 min-h-[200px]"
                  rows={10}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Continue to Payment
              </Button>
            </form>
          </Card>
        )}

        {step === 'payment' && (
          <Card className="bg-gray-800 border-gray-700 p-6">
            <h2 className="text-2xl font-bold text-gray-100 mb-6">Payment Information</h2>
            
            <div className="space-y-4 mb-6">
              <div className="p-4 bg-gray-700 rounded">
                <p className="text-sm text-gray-400">Order ID</p>
                <p className="text-lg font-mono text-gray-100">{orderId}</p>
              </div>

              <div className="p-4 bg-gray-700 rounded">
                <p className="text-sm text-gray-400">Amount to Pay</p>
                <p className="text-2xl font-bold text-green-400">
                  {convertEurToCrypto(totalEur, selectedCurrency)} {selectedCurrency.toUpperCase()}
                </p>
                <p className="text-sm text-gray-400">≈ €{totalEur.toFixed(2)}</p>
              </div>

              <div className="p-4 bg-gray-700 rounded">
                <p className="text-sm text-gray-400 mb-2">Send payment to this address:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-2 bg-gray-900 rounded text-xs text-gray-100 break-all">
                    {paymentAddress}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(paymentAddress)}
                  >
                    Copy
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500 rounded">
                <p className="text-sm text-blue-400">
                  After sending the payment, the vendor will contact you via your provided contact method
                  to confirm the order and arrange delivery.
                </p>
              </div>
            </div>

            <Button onClick={handlePaymentConfirm} className="w-full">
              I have sent the payment
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Checkout;
