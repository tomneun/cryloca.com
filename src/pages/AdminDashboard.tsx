
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Settings, Euro, ArrowLeft, Code } from 'lucide-react';
import VendorCodeManager from '@/components/VendorCodeManager';
import AdminContact from '@/components/AdminContact';

const AdminDashboard = () => {
  const [sessionId, setSessionId] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [licenseFee, setLicenseFee] = useState<number>(500);
  const [newFee, setNewFee] = useState<string>('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const ADMIN_SESSION_ID = '053aa07e41ee40915fcb71fa6f2512cf7156191d3fc1742f5c76ebd4039bcebe4d';

  useEffect(() => {
    const savedFee = localStorage.getItem('vendor_license_fee');
    if (savedFee) {
      setLicenseFee(parseFloat(savedFee));
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (sessionId === ADMIN_SESSION_ID) {
      setIsAuthenticated(true);
      setMessage('');
    } else {
      setMessage('Invalid admin session ID');
    }
  };

  const handleUpdateFee = (e: React.FormEvent) => {
    e.preventDefault();
    const fee = parseFloat(newFee);
    if (isNaN(fee) || fee <= 0) {
      setMessage('Please enter a valid fee amount');
      return;
    }
    
    setLicenseFee(fee);
    localStorage.setItem('vendor_license_fee', fee.toString());
    setNewFee('');
    setMessage(`License fee updated to €${fee}`);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-center">
              <Shield className="h-6 w-6 text-red-500" />
              Admin Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="sessionId" className="text-gray-300">
                  Admin Session ID
                </Label>
                <Input
                  id="sessionId"
                  type="password"
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  className="mt-1 bg-gray-700 border-gray-600 text-gray-100"
                  placeholder="Enter admin session ID"
                />
              </div>
              
              {message && (
                <div className="text-red-400 text-sm">{message}</div>
              )}
              
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                Login
              </Button>
            </form>
            
            <div className="mt-4 text-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/rules')}
                className="text-gray-400 hover:text-gray-100"
              >
                Back to Rules
              </Button>
            </div>
          </CardContent>
        </Card>
        <AdminContact />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-red-500" />
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
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

        {/* Current Settings */}
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-6 w-6 text-blue-400" />
              Current Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-lg">
                <span className="text-gray-400">Current Vendor License Fee:</span>
                <span className="text-red-400 font-bold ml-2">€{licenseFee}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Update License Fee */}
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Euro className="h-6 w-6 text-green-400" />
              Update License Fee
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateFee} className="space-y-4">
              <div>
                <Label htmlFor="newFee" className="text-gray-300">
                  New License Fee (EUR)
                </Label>
                <Input
                  id="newFee"
                  type="number"
                  min="1"
                  step="0.01"
                  value={newFee}
                  onChange={(e) => setNewFee(e.target.value)}
                  className="mt-1 bg-gray-700 border-gray-600 text-gray-100"
                  placeholder="Enter new fee amount"
                />
              </div>
              
              {message && (
                <div className="text-green-400 text-sm">{message}</div>
              )}
              
              <Button type="submit" className="bg-red-600 hover:bg-red-700">
                Update Fee
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Vendor Code Management */}
        <VendorCodeManager />
      </div>
      
      <AdminContact />
    </div>
  );
};

export default AdminDashboard;
