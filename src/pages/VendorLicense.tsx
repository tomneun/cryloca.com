import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingBag, Euro, ArrowLeft, User, MapPin } from 'lucide-react';
import AdminContact from '@/components/AdminContact';
const COUNTRIES = ['Germany', 'Netherlands', 'Belgium', 'France', 'Spain', 'Italy', 'Austria', 'Switzerland', 'Poland', 'Czech Republic', 'Portugal', 'Denmark', 'Sweden', 'Norway', 'Finland', 'United Kingdom', 'Ireland', 'Luxembourg'];
const VendorLicense = () => {
  const [username, setUsername] = useState('');
  const [vendorCode, setVendorCode] = useState('');
  const [shippingCountry, setShippingCountry] = useState('');
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
    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    if (username.length < 3 || username.length > 20) {
      setError('Username must be between 3-20 characters');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers, and underscores');
      return;
    }
    if (!vendorCode.trim()) {
      setError('Vendor registration code is required');
      return;
    }
    if (!shippingCountry) {
      setError('Shipping country is required');
      return;
    }
    if (!acceptedTerms) {
      setError('You must accept the terms and conditions');
      return;
    }

    // Verify vendor code
    const vendorCodes = JSON.parse(localStorage.getItem('vendor_codes') || '[]');
    const codeExists = vendorCodes.find((code: any) => code.code === vendorCode && !code.isUsed);
    if (!codeExists) {
      setError('Invalid or already used vendor code');
      return;
    }

    // Check if username already exists
    const existingLicenses = JSON.parse(localStorage.getItem('vendor_licenses') || '[]');
    if (existingLicenses.some((license: any) => license.username === username)) {
      setError('Username already taken');
      return;
    }

    // Mark code as used
    const updatedCodes = vendorCodes.map((code: any) => code.code === vendorCode ? {
      ...code,
      isUsed: true,
      usedBy: username
    } : code);
    localStorage.setItem('vendor_codes', JSON.stringify(updatedCodes));

    // Generate license ID
    const licenseId = 'LIC-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

    // Create license record
    const newLicense = {
      id: licenseId,
      username: username,
      vendorCode: vendorCode,
      shippingCountry: shippingCountry,
      fee: licenseFee,
      status: 'unpaid',
      acceptedTerms: acceptedTerms,
      createdAt: new Date().toISOString()
    };

    // Save license
    existingLicenses.push(newLicense);
    localStorage.setItem('vendor_licenses', JSON.stringify(existingLicenses));

    // Navigate to confirmation page
    navigate(`/license-thanks?licenseId=${licenseId}&username=${username}&fee=${licenseFee}`);
  };
  return <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4">
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
                <strong>Important:</strong> You need a valid vendor registration code from the admin. 
                Your license will be reserved for 24 hours after generation. 
                Payment must be completed within this time frame.
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
                <Input id="vendorCode" type="text" value={vendorCode} onChange={e => setVendorCode(e.target.value.toUpperCase())} className="mt-1 bg-gray-700 border-gray-600 text-gray-100 focus:border-red-500" placeholder="VND-XXXXXXXX" />
              </div>

              <div>
                <Label htmlFor="username" className="text-gray-300">
                  Desired Username (3-20 characters) *
                </Label>
                <Input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} className="mt-1 bg-gray-700 border-gray-600 text-gray-100 focus:border-red-500" placeholder="your_vendor_name" maxLength={20} />
                <p className="text-xs text-gray-400 mt-1">
                  Only letters, numbers, and underscores allowed
                </p>
              </div>

              <div>
                <Label htmlFor="shippingCountry" className="text-gray-300">
                  Shipping Country *
                </Label>
                <Select value={shippingCountry} onValueChange={setShippingCountry}>
                  <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-gray-100">
                    <SelectValue placeholder="Select your shipping country" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    {COUNTRIES.map(country => <SelectItem key={country} value={country} className="text-gray-100">
                        {country}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-400 mt-1">
                  Include shipping costs in your product prices
                </p>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-gray-200">Terms and Conditions</h4>
                <div className="text-sm text-gray-300 space-y-2 max-h-40 overflow-y-auto">
                  <p>• Vendors receive 40% of gross sales automatically</p>
                  <p>• 60% goes to admin (2% platform fee + 58% paid to you on arrival in USDT)</p>
                  <p>• All prices must be set in EUR</p>
                  <p>• Must specify shipping country during registration</p>
                  <p>• Responsible for product quality and delivery</p>
                  <p>• License fees are non-refundable</p>
                  <p>• Username cannot be changed after registration</p>
                  <p>• Must comply with all platform rules</p>
                </div>
                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox id="terms" checked={acceptedTerms} onCheckedChange={checked => setAcceptedTerms(checked as boolean)} />
                  <Label htmlFor="terms" className="text-sm">
                    I accept the terms and conditions
                  </Label>
                </div>
              </div>

              {error && <div className="text-red-400 text-sm">{error}</div>}

              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">License Fee:</span>
                  <span className="text-red-400 font-bold text-xl">€{licenseFee}</span>
                </div>
              </div>

              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={!username.trim() || !vendorCode.trim() || !shippingCountry || !acceptedTerms}>
                Generate License & Proceed to Payment
              </Button>
            </form>

            <div className="mt-6 text-xs text-gray-400 space-y-1">
              <p>• Valid vendor code required from admin</p>
              <p>• Username will be reserved upon license generation</p>
              <p>• Payment instructions will be provided on the next page</p>
              <p>• License must be paid within 24 hours</p>
              <p>• No refunds after payment confirmation</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <AdminContact />
    </div>;
};
export default VendorLicense;