import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ShoppingBag, Euro, ArrowLeft, User } from 'lucide-react';
import AdminContact from '@/components/AdminContact';

const VendorLicense = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [vendorCode, setVendorCode] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [signalId, setSignalId] = useState('');
  const [btcAddress, setBtcAddress] = useState('');
  const [xmrAddress, setXmrAddress] = useState('');
  const [usdcAddress, setUsdcAddress] = useState('');
  const [ltcAddress, setLtcAddress] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [licenseFee, setLicenseFee] = useState<number>(500);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedFee = localStorage.getItem('vendor_license_fee');
    if (savedFee) {
      setLicenseFee(parseFloat(savedFee));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password || !vendorCode || (!sessionId && !signalId) || !acceptedTerms) {
      setError('Please fill in all required fields (Session-ID or Signal-ID required)');
      return;
    }

    if (!btcAddress && !xmrAddress && !usdcAddress && !ltcAddress) {
      setError('Please provide at least one crypto address for payouts');
      return;
    }

    // Check if vendor code exists
    const vendorCodes = JSON.parse(localStorage.getItem('vendor_codes') || '[]');
    const codeExists = vendorCodes.find((c: any) => c.code === vendorCode && !c.isUsed);
    
    if (!codeExists) {
      setError('Invalid or already used vendor code');
      return;
    }

    // Check if username is unique
    const existingLicenses = JSON.parse(localStorage.getItem('vendor_licenses') || '[]');
    if (existingLicenses.find((l: any) => l.username === username)) {
      setError('Username already taken');
      return;
    }

    // Generate license ID
    const licenseId = 'LIC-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

    const licenseData = {
      id: licenseId,
      username,
      password,
      vendorCode,
      sessionId: sessionId || '',
      signalId: signalId || '',
      cryptoAddresses: {
        btc: btcAddress || '',
        xmr: xmrAddress || '',
        usdc: usdcAddress || '',
        ltc: ltcAddress || ''
      },
      fee: licenseFee,
      status: 'pending', // Admin must approve payment
      acceptedTerms: acceptedTerms,
      createdAt: new Date().toISOString()
    };

    // Save license
    existingLicenses.push(licenseData);
    localStorage.setItem('vendor_licenses', JSON.stringify(existingLicenses));

    // Mark vendor code as used
    const updatedCodes = vendorCodes.map((c: any) => 
      c.code === vendorCode ? { ...c, isUsed: true, usedBy: username } : c
    );
    localStorage.setItem('vendor_codes', JSON.stringify(updatedCodes));

    navigate(`/license-thanks?licenseId=${licenseId}&username=${username}&fee=${licenseFee}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-8 w-8 text-red-500" />
            <h1 className="text-3xl font-bold">Vendor License Purchase</h1>
          </div>
          <Button variant="outline" onClick={() => navigate('/rules')} className="border-gray-600 text-gray-300 hover:bg-gray-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Rules
          </Button>
        </div>

        {/* License Info */}
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-400">
              <Euro className="h-6 w-6" />
              License Fee: €{licenseFee}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
              <p className="text-yellow-300 text-sm">
                <strong>Important:</strong> Payment will be confirmed by admin. Provide valid crypto addresses for payouts.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Purchase Form */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-6 w-6 text-blue-400" />
              Vendor Registration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="vendorCode" className="text-gray-300">
                  Vendor Registration Code (from Admin) *
                </Label>
                <Input 
                  id="vendorCode" 
                  value={vendorCode} 
                  onChange={(e) => setVendorCode(e.target.value.toUpperCase())} 
                  className="mt-1 bg-gray-700 border-gray-600 text-gray-100 focus:border-red-500" 
                  placeholder="VND-XXXXXXXX" 
                />
              </div>

              <div>
                <Label htmlFor="username" className="text-gray-300">
                  Desired Username *
                </Label>
                <Input 
                  id="username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  className="mt-1 bg-gray-700 border-gray-600 text-gray-100 focus:border-red-500" 
                  placeholder="your_vendor_name" 
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-300">
                  Password *
                </Label>
                <Input 
                  id="password" 
                  type="password"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="mt-1 bg-gray-700 border-gray-600 text-gray-100 focus:border-red-500" 
                  placeholder="Choose a secure password" 
                />
              </div>

              <div>
                <Label htmlFor="sessionId" className="text-gray-300">
                  Session-ID (optional if Signal provided)
                </Label>
                <Input 
                  id="sessionId" 
                  value={sessionId} 
                  onChange={(e) => setSessionId(e.target.value)} 
                  className="mt-1 bg-gray-700 border-gray-600 text-gray-100 focus:border-red-500" 
                  placeholder="Your Session Messenger ID" 
                />
              </div>

              <div>
                <Label htmlFor="signalId" className="text-gray-300">
                  Signal Account ID (optional if Session provided)
                </Label>
                <Input 
                  id="signalId" 
                  value={signalId} 
                  onChange={(e) => setSignalId(e.target.value)} 
                  className="mt-1 bg-gray-700 border-gray-600 text-gray-100 focus:border-red-500" 
                  placeholder="Your Signal ID" 
                />
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-700">
                <h3 className="text-lg font-semibold text-gray-200">Crypto Payout Addresses *</h3>
                <p className="text-sm text-gray-400">Provide at least one address for receiving payments</p>
                
                <div>
                  <Label htmlFor="btcAddress" className="text-gray-300">Bitcoin (BTC) Address</Label>
                  <Input
                    id="btcAddress"
                    placeholder="bc1..."
                    value={btcAddress}
                    onChange={(e) => setBtcAddress(e.target.value)}
                    className="mt-1 bg-gray-700 border-gray-600 text-gray-100"
                  />
                </div>

                <div>
                  <Label htmlFor="xmrAddress" className="text-gray-300">Monero (XMR) Address</Label>
                  <Input
                    id="xmrAddress"
                    placeholder="4..."
                    value={xmrAddress}
                    onChange={(e) => setXmrAddress(e.target.value)}
                    className="mt-1 bg-gray-700 border-gray-600 text-gray-100"
                  />
                </div>

                <div>
                  <Label htmlFor="usdcAddress" className="text-gray-300">USDC Address</Label>
                  <Input
                    id="usdcAddress"
                    placeholder="0x..."
                    value={usdcAddress}
                    onChange={(e) => setUsdcAddress(e.target.value)}
                    className="mt-1 bg-gray-700 border-gray-600 text-gray-100"
                  />
                </div>

                <div>
                  <Label htmlFor="ltcAddress" className="text-gray-300">Litecoin (LTC) Address</Label>
                  <Input
                    id="ltcAddress"
                    placeholder="L..."
                    value={ltcAddress}
                    onChange={(e) => setLtcAddress(e.target.value)}
                    className="mt-1 bg-gray-700 border-gray-600 text-gray-100"
                  />
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-gray-200">Terms and Conditions</h4>
                <div className="text-sm text-gray-300 space-y-2 max-h-40 overflow-y-auto">
                  <p>• Payment confirmation by admin required</p>
                  <p>• All prices must be set in EUR</p>
                  <p>• Responsible for product quality and delivery</p>
                  <p>• License fees are non-refundable</p>
                  <p>• Must comply with all platform rules</p>
                </div>
                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox 
                    id="terms" 
                    checked={acceptedTerms} 
                    onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)} 
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I accept the terms and conditions
                  </Label>
                </div>
              </div>

              {error && <div className="text-red-400 text-sm bg-red-500/10 border border-red-500 rounded p-3">{error}</div>}

              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">License Fee:</span>
                  <span className="text-red-400 font-bold text-xl">€{licenseFee}</span>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700" 
                disabled={!username.trim() || !password.trim() || !vendorCode.trim() || !acceptedTerms}
              >
                Submit License Application
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      
      <AdminContact />
    </div>
  );
};

export default VendorLicense;
