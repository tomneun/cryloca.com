
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefreshCw } from 'lucide-react';

interface CaptchaChallengeProps {
  onSuccess: () => void;
}

const CaptchaChallenge = ({ onSuccess }: CaptchaChallengeProps) => {
  const [captchaCode, setCaptchaCode] = useState('');
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState('');

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(result);
    setUserInput('');
    setError('');
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.toUpperCase() === captchaCode) {
      onSuccess();
    } else {
      setError('Incorrect CAPTCHA. Please try again.');
      generateCaptcha();
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-4 text-center">Security Verification</h3>
      
      <div className="mb-4">
        <div className="bg-gray-700 p-4 rounded text-center mb-3">
          <span className="text-2xl font-mono tracking-widest text-gray-100 select-none">
            {captchaCode}
          </span>
        </div>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={generateCaptcha}
          className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          New Code
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Enter the code above"
            className="bg-gray-700 border-gray-600 text-gray-100 focus:border-red-500"
            maxLength={6}
          />
        </div>
        
        {error && (
          <div className="text-red-400 text-sm text-center">{error}</div>
        )}
        
        <Button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700"
        >
          Verify
        </Button>
      </form>
    </div>
  );
};

export default CaptchaChallenge;
