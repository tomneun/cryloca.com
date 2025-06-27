
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Euro, Users, ArrowLeft } from 'lucide-react';
import AdminContact from '@/components/AdminContact';

const Rules = () => {
  const [licenseFee, setLicenseFee] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const savedFee = localStorage.getItem('vendor_license_fee');
    if (savedFee) {
      setLicenseFee(parseFloat(savedFee));
    } else {
      setLicenseFee(500);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Shield className="h-12 w-12 text-red-500" />
            <h1 className="text-4xl font-bold">NO LIMIT CENTER</h1>
          </div>
          <p className="text-xl text-gray-400">Platform Rules & Vendor Licensing</p>
        </div>

        {/* Vendor License Info */}
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-400">
              <Euro className="h-6 w-6" />
              Vendor License Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
              <p className="text-red-300 font-semibold text-lg">
                Current Vendor License Fee: €{licenseFee}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                All vendors must purchase a license and provide a registration code to operate on the platform.
              </p>
            </div>
            <Button 
              onClick={() => navigate('/vendor-license')}
              className="bg-red-600 hover:bg-red-700"
            >
              Purchase Vendor License
            </Button>
          </CardContent>
        </Card>

        {/* Platform Rules */}
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-400" />
              Platform Rules & Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose prose-invert max-w-none">
              <h3 className="text-lg font-semibold text-gray-200">General Rules</h3>
              <ul className="text-gray-300 space-y-2">
                <li>All vendors must purchase and maintain a valid license with admin-issued registration code</li>
                <li>Vendor usernames must be unique and professional</li>
                <li>All transactions must be conducted through the platform</li>
                <li>Vendors must specify their shipping country during registration</li>
                <li>All prices must be set in EUR (automatically converted to crypto rates)</li>
                <li>Vendors receive 40% of sale proceeds immediately</li>
                <li>60% goes to admin (2% retained, 58% paid out in USDT to prevent value loss)</li>
                <li>Vendors are responsible for their product quality and delivery</li>
                <li>Platform reserves the right to suspend accounts for violations</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-200 mt-6">Licensing Requirements</h3>
              <ul className="text-gray-300 space-y-2">
                <li>License fee must be paid in full before vendor registration</li>
                <li>Valid registration code from admin required</li>
                <li>Licenses are non-refundable once activated</li>
                <li>Each license is tied to a specific username</li>
                <li>License transfers are not permitted</li>
                <li>Vendors must accept terms and conditions during registration</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-200 mt-6">Payment & Revenue Terms</h3>
              <ul className="text-gray-300 space-y-2">
                <li>All license fees are quoted in EUR</li>
                <li>Product prices set in EUR, displayed in EUR and crypto equivalents</li>
                <li>Vendors receive 40% of gross sales automatically</li>
                <li>Admin retains 60% (2% platform fee + 58% for later USDT payout)</li>
                <li>Payment must be completed within 24 hours of license generation</li>
                <li>Unpaid licenses will be automatically cancelled</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-200 mt-6">Customer Service</h3>
              <ul className="text-gray-300 space-y-2">
                <li>Customers receive unique purchase codes after successful payment</li>
                <li>Purchase codes are automatically generated and must be shared with vendors</li>
                <li>Vendors must verify purchase codes before fulfilling orders</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Admin Access */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-4">
                Admin Session ID: 053aa07e41ee40915fcb71fa6f2512cf7156191d3fc1742f5c76ebd4039bcebe4d
              </p>
              <Button 
                variant="outline"
                onClick={() => navigate('/admin')}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Admin Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <AdminContact />
    </div>
  );
};

export default Rules;
