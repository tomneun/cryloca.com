import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefreshCw, Clock } from 'lucide-react';
interface CaptchaChallengeProps {
  onSuccess: () => void;
}
const CaptchaChallenge = ({
  onSuccess
}: CaptchaChallengeProps) => {
  const [captchaCode, setCaptchaCode] = useState('');
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState('');
  const [stage, setStage] = useState(1); // 1 for first captcha, 2 for second
  const [isWaiting, setIsWaiting] = useState(false);
  const [waitTime, setWaitTime] = useState(10);
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
  }, [stage]);

  // Countdown timer for waiting period
  useEffect(() => {
    if (isWaiting && waitTime > 0) {
      const timer = setTimeout(() => setWaitTime(waitTime - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isWaiting && waitTime === 0) {
      setIsWaiting(false);
      setStage(2);
      setWaitTime(10);
    }
  }, [waitTime, isWaiting]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.toUpperCase() === captchaCode) {
      if (stage === 1) {
        // First captcha solved, start waiting period
        setIsWaiting(true);
      } else {
        // Second captcha solved, proceed
        onSuccess();
      }
    } else {
      setError(stage === 1 ? 'Falscher CAPTCHA-Code. Bitte versuchen Sie es erneut.' : 'Falscher CAPTCHA-Code. Bitte versuchen Sie es erneut.');
      generateCaptcha();
    }
  };
  if (isWaiting) {
    return <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 max-w-md mx-auto">
        <div className="text-center">
          <Clock className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-4">Sicherheitsprüfung läuft...</h3>
          <p className="text-gray-400 mb-4">
            Bitte warten Sie {waitTime} Sekunden, bevor Sie mit der zweiten Verifizierung fortfahren können.
          </p>
          <div className="bg-gray-700 rounded-full h-2 mb-4">
            <div className="bg-yellow-500 h-2 rounded-full transition-all duration-1000" style={{
            width: `${(10 - waitTime) / 10 * 100}%`
          }} />
          </div>
          <p className="text-sm text-gray-500">
            Dies dient Ihrer Sicherheit und verhindert automatisierte Zugriffe.
          </p>
        </div>
      </div>;
  }
  return <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-4 text-center text-slate-300">
        Sicherheitsverifizierung {stage === 1 ? '(Schritt 1 von 2)' : '(Schritt 2 von 2)'}
      </h3>
      
      <div className="mb-4">
        <div className="bg-gray-700 p-4 rounded text-center mb-3">
          <span className="text-2xl font-mono tracking-widest text-gray-100 select-none">
            {captchaCode}
          </span>
        </div>
        
        <Button type="button" variant="outline" size="sm" onClick={generateCaptcha} className="w-full border-gray-600 hover:bg-gray-700 text-slate-100">
          <RefreshCw className="h-4 w-4 mr-2" />
          Neuen Code generieren
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input type="text" value={userInput} onChange={e => setUserInput(e.target.value)} placeholder="Geben Sie den Code oben ein" className="bg-gray-700 border-gray-600 text-gray-100 focus:border-red-500" maxLength={6} />
        </div>
        
        {error && <div className="text-red-400 text-sm text-center">{error}</div>}
        
        <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
          {stage === 1 ? 'Ersten Code verifizieren' : 'Verifizierung abschließen'}
        </Button>
      </form>

      {stage === 1 && <p className="text-xs text-gray-500 text-center mt-4">
          Nach dem ersten Schritt folgt eine kurze Wartezeit für zusätzliche Sicherheit.
        </p>}
    </div>;
};
export default CaptchaChallenge;