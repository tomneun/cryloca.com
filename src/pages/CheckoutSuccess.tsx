
import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Copy, AlertTriangle } from 'lucide-react';
import AdminContact from '@/components/AdminContact';

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('orderId');
  const customerCode = searchParams.get('customerCode');

  const copyCode = () => {
    if (customerCode) {
      navigator.clipboard.writeText(customerCode);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-400">
              <CheckCircle className="h-8 w-8" />
              Payment Successful!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-900/20 border border-green-700 rounded-lg p-6">
              <p className="text-green-300 text-lg font-semibold mb-4">
                Your order has been processed successfully!
              </p>
              <div className="space-y-2">
                <p className="text-gray-300">Order ID: <code className="font-mono">{orderId}</code></p>
              </div>
            </div>

            <div className="bg-red-900/20 border border-red-700 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-red-300 font-bold text-lg mb-2">IMPORTANT!</h3>
                  <p className="text-red-300 mb-4">
                    Please save this customer code and share it with the vendor to complete your order:
                  </p>
                  
                  <div className="bg-gray-800 rounded-lg p-4 border border-red-500">
                    <div className="flex items-center justify-between">
                      <code className="text-red-400 font-mono text-lg font-bold">
                        {customerCode}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={copyCode}
                        className="border-red-500 text-red-400 hover:bg-red-900/20"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Code
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-red-300 text-sm mt-3">
                    Without this code, the vendor cannot verify your purchase and process your order.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-gray-200">Next Steps:</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Copy and save your customer code above</li>
                <li>• Contact the vendor with your customer code</li>
                <li>• Vendor will verify the code and process your order</li>
                <li>• You will receive your digital goods once verified</li>
              </ul>
            </div>

            <Button
              onClick={() => navigate('/')}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              Return to Marketplace
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <AdminContact />
    </div>
  );
};

export default CheckoutSuccess;
