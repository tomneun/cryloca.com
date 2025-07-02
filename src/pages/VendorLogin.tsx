
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

const VendorLogin = () => {
  const { createSession } = useSession();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    startCode: '',
    wallet: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.username.trim() || formData.username.length < 6) {
      setError('Username must be at least 6 characters');
      return;
    }

    if (!formData.password.trim()) {
      setError('Password is required');
      return;
    }

    if (!formData.startCode.trim()) {
      setError('Start Code is required');
      return;
    }

    if (!formData.wallet.trim()) {
      setError('Wallet address is required');
      return;
    }

    // For now, create session with username (will be replaced with proper auth)
    createSession(formData.username);
    navigate('/my-shop');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="text-gray-400 hover:text-gray-100 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <ShoppingBag className="h-8 w-8 text-red-500" />
                <span className="text-2xl font-bold">Vendor Login</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="username" className="text-gray-300">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-gray-100 focus:border-red-500"
                  placeholder="Minimum 6 characters"
                  minLength={6}
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-gray-100 focus:border-red-500"
                  placeholder="Enter your password"
                />
              </div>

              <div>
                <Label htmlFor="startCode" className="text-gray-300">Start Code</Label>
                <Input
                  id="startCode"
                  type="text"
                  value={formData.startCode}
                  onChange={(e) => setFormData({...formData, startCode: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-gray-100 focus:border-red-500"
                  placeholder="Code from admin"
                />
              </div>

              <div>
                <Label htmlFor="wallet" className="text-gray-300">Wallet Address (BTC/XMR)</Label>
                <Input
                  id="wallet"
                  type="text"
                  value={formData.wallet}
                  onChange={(e) => setFormData({...formData, wallet: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-gray-100 focus:border-red-500"
                  placeholder="Your crypto wallet address"
                />
              </div>

              {error && (
                <div className="text-red-400 text-sm">{error}</div>
              )}

              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                Login to Vendor Area
              </Button>
            </form>

            <div className="mt-4 text-center text-xs text-gray-400">
              <p>Session ID for Support:</p>
              <p className="font-mono">053aa07e41ee40915fcb71fa6f2512cf7156191d3fc1742f5c76ebd4039bcebe4d</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorLogin;
