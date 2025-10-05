import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import CaptchaChallenge from '@/components/CaptchaChallenge';
import BuySellChoice from '@/components/BuySellChoice';

const Login = () => {
  const [step, setStep] = useState<'captcha1' | 'captcha2' | 'login' | 'choice'>('captcha1');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCaptcha1Success = () => {
    setStep('captcha2');
  };

  const handleCaptcha2Success = () => {
    setStep('login');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter username and password');
      return;
    }

    // Check vendor credentials
    const licenses = JSON.parse(localStorage.getItem('anonshop_licenses') || '[]');
    const vendor = licenses.find((l: any) => 
      l.username === username && 
      l.password === password && 
      l.status === 'approved'
    );

    if (vendor) {
      // Vendor login successful
      localStorage.setItem('anonshop_vendor_session', JSON.stringify({
        username: vendor.username,
        pseudonym: vendor.username,
        type: 'vendor'
      }));
      setStep('choice');
      return;
    }

    // Check buyer credentials (could be stored separately or same system)
    const buyers = JSON.parse(localStorage.getItem('anonshop_buyers') || '[]');
    const buyer = buyers.find((b: any) => 
      b.username === username && 
      b.password === password
    );

    if (buyer) {
      localStorage.setItem('anonshop_buyer_session', JSON.stringify({
        username: buyer.username,
        type: 'buyer'
      }));
      setStep('choice');
      return;
    }

    setError('Invalid credentials or account not approved');
  };

  const handleRoleChoice = (role: 'buyer' | 'seller') => {
    const session = JSON.parse(localStorage.getItem('anonshop_vendor_session') || 
                              localStorage.getItem('anonshop_buyer_session') || '{}');
    
    if (role === 'seller' && session.type === 'vendor') {
      navigate('/my-shop');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700 p-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 text-gray-400 hover:text-gray-200"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        {step === 'captcha1' && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-100 mb-2">Security Check 1/2</h1>
              <p className="text-gray-400">Please solve the first captcha</p>
            </div>
            <CaptchaChallenge onSuccess={handleCaptcha1Success} />
          </div>
        )}

        {step === 'captcha2' && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-100 mb-2">Security Check 2/2</h1>
              <p className="text-gray-400">Please solve the second captcha</p>
            </div>
            <CaptchaChallenge onSuccess={handleCaptcha2Success} />
          </div>
        )}

        {step === 'login' && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-100 mb-2">Login</h1>
              <p className="text-gray-400">Enter your credentials</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-gray-700 border-gray-600"
                  placeholder="Your username"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-700 border-gray-600"
                  placeholder="Your password"
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </div>
        )}

        {step === 'choice' && (
          <BuySellChoice onChoice={handleRoleChoice} />
        )}
      </Card>
    </div>
  );
};

export default Login;
