
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Euro, ArrowLeft, User } from 'lucide-react';

const VendorLicense = () => {
  const [username, setUsername] = useState('');
  const [licenseFee, setLicenseFee] = useState<number>(500);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Load current license fee
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

    // Check if username already exists
    const existingLicenses = JSON.parse(localStorage.getItem('vendor_licenses') || '[]');
    if (existingLicenses.some((license: any) => license.username === username)) {
      setError('Username already taken');
      return;
    }

    // Generate license ID
    const licenseId = 'LIC-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    
    // Create license record
    const newLicense = {
      id: licenseId,
      username: username,
      fee: licenseFee,
      status: 'unpaid',
      createdAt: new Date().toISOString()
    };

    // Save license
    existingLicenses.push(newLicense);
    localStorage.setItem('vendor_licenses', JSON.stringify(existingLicenses));

    // Navigate to confirmation page
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
          <Button 
            variant="outline"
            onClick={() => navigate('/rules')}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
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
                <strong>Important:</strong> Your license will be reserved for 24 hours after generation. 
                Payment must be completed within this time frame or the license will be automatically cancelled.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Purchase Form */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-6 w-6 text-blue-400" />
              Reserve Your Username
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="username" className="text-gray-300">
                  Desired Username (3-20 characters)
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 bg-gray-700 border-gray-600 text-gray-100 focus:border-red-500"
                  placeholder="your_vendor_name"
                  maxLength={20}
                />
                <p className="text-xs text-gray-400 mt-1">
                  Only letters, numbers, and underscores allowed
                </p>
              </div>

              {error && (
                <div className="text-red-400 text-sm">{error}</div>
              )}

              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">License Fee:</span>
                  <span className="text-red-400 font-bold text-xl">€{licenseFee}</span>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={!username.trim()}
              >
                Generate License & Proceed to Payment
              </Button>
            </form>

            <div className="mt-6 text-xs text-gray-400 space-y-1">
              <p>• Username will be reserved upon license generation</p>
              <p>• Payment instructions will be provided on the next page</p>
              <p>• License must be paid within 24 hours</p>
              <p>• No refunds after payment confirmation</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorLicense;
