
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Copy, Euro, ArrowLeft, AlertCircle } from 'lucide-react';

const LicenseThanks = () => {
  const [searchParams] = useSearchParams();
  const [paymentAddress] = useState('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'); // Example address
  const [txHash, setTxHash] = useState('');
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const licenseId = searchParams.get('licenseId');
  const username = searchParams.get('username');
  const fee = searchParams.get('fee');

  useEffect(() => {
    if (!licenseId || !username || !fee) {
      navigate('/vendor-license');
    }
  }, [licenseId, username, fee, navigate]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txHash.trim()) {
      return;
    }

    // Update license status to paid (simulate payment confirmation)
    const licenses = JSON.parse(localStorage.getItem('vendor_licenses') || '[]');
    const updatedLicenses = licenses.map((license: any) => 
      license.id === licenseId 
        ? { ...license, status: 'paid', txHash: txHash, paidAt: new Date().toISOString() }
        : license
    );
    localStorage.setItem('vendor_licenses', JSON.stringify(updatedLicenses));
    
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-12 pb-12 text-center">
              <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-green-400 mb-4">Payment Submitted!</h2>
              <p className="text-gray-300 mb-6">
                Your payment has been submitted for verification. You will be able to register 
                your vendor account once the payment is confirmed (usually within 10-60 minutes).
              </p>
              <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 mb-6">
                <p className="text-green-300 text-sm">
                  <strong>License ID:</strong> {licenseId}<br/>
                  <strong>Username:</strong> {username}<br/>
                  <strong>Status:</strong> Payment Processing
                </p>
              </div>
              <Button 
                onClick={() => navigate('/rules')}
                className="bg-red-600 hover:bg-red-700"
              >
                Return to Rules
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">License Payment</h1>
          <Button 
            variant="outline"
            onClick={() => navigate('/vendor-license')}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        {/* License Summary */}
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-400">
              <CheckCircle className="h-6 w-6" />
              License Generated Successfully
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">License ID:</span>
                  <p className="text-gray-100 font-mono">{licenseId}</p>
                </div>
                <div>
                  <span className="text-gray-400">Username:</span>
                  <p className="text-gray-100 font-semibold">{username}</p>
                </div>
                <div>
                  <span className="text-gray-400">Fee:</span>
                  <p className="text-red-400 font-bold">€{fee}</p>
                </div>
                <div>
                  <span className="text-gray-400">Status:</span>
                  <p className="text-yellow-400">Awaiting Payment</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Instructions */}
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-400">
              <Euro className="h-6 w-6" />
              Payment Instructions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-300 text-sm">
                    <strong>Important:</strong> Send exactly €{fee} to the address below. 
                    This license will expire in 24 hours if payment is not received.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-gray-300 text-sm">Payment Address:</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  value={paymentAddress}
                  readOnly
                  className="bg-gray-700 border-gray-600 text-gray-100 font-mono text-xs"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(paymentAddress)}
                  className="border-gray-600"
                >
                  {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-300 mb-2">Payment Steps:</h4>
              <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
                <li>Send exactly €{fee} to the payment address above</li>
                <li>Copy the transaction hash from your payment</li>
                <li>Paste the transaction hash in the form below</li>
                <li>Click "Confirm Payment" to activate your license</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Payment Confirmation */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Confirm Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitPayment} className="space-y-4">
              <div>
                <Label htmlFor="txHash" className="text-gray-300">
                  Transaction Hash
                </Label>
                <Input
                  id="txHash"
                  type="text"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  className="mt-1 bg-gray-700 border-gray-600 text-gray-100"
                  placeholder="Paste your transaction hash here..."
                />
                <p className="text-xs text-gray-400 mt-1">
                  Enter the transaction hash from your payment to confirm the license
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={!txHash.trim()}
              >
                Confirm Payment
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LicenseThanks;
