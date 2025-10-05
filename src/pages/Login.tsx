import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { ShoppingBag } from 'lucide-react';
import CaptchaChallenge from '@/components/CaptchaChallenge';

const Login = () => {
  const [step, setStep] = useState<'captcha1' | 'captcha2'>('captcha1');
  const navigate = useNavigate();

  const handleCaptcha1Success = () => {
    setStep('captcha2');
  };

  const handleCaptcha2Success = () => {
    navigate('/choose-role');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700 p-8">
        <div className="text-center mb-6">
          <ShoppingBag className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-100">NO LIMIT CENTER</h1>
        </div>

        {step === 'captcha1' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-100 mb-2">Sicherheitsprüfung 1/2</h2>
              <p className="text-gray-400">Bitte lösen Sie das erste Captcha</p>
            </div>
            <CaptchaChallenge onSuccess={handleCaptcha1Success} />
          </div>
        )}

        {step === 'captcha2' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-100 mb-2">Sicherheitsprüfung 2/2</h2>
              <p className="text-gray-400">Bitte lösen Sie das zweite Captcha</p>
            </div>
            <CaptchaChallenge onSuccess={handleCaptcha2Success} />
          </div>
        )}
      </Card>
    </div>
  );
};

export default Login;
