
import { useState, useEffect } from 'react';
import { useSession } from '@/hooks/useSession';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, Key } from 'lucide-react';

const ConfigurationTab = () => {
  const { session } = useSession();
  const [walletAddress, setWalletAddress] = useState('');
  const [currentWalletAddress, setCurrentWalletAddress] = useState('');
  const [password, setPassword] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [currentSessionId, setCurrentSessionId] = useState('');
  const [sessionPassword, setSessionPassword] = useState('');

  useEffect(() => {
    if (session) {
      const savedWallet = localStorage.getItem(`wallet_${session.pseudonym}`);
      const savedSession = localStorage.getItem(`custom_session_${session.pseudonym}`);
      if (savedWallet) setCurrentWalletAddress(savedWallet);
      if (savedSession) setCurrentSessionId(savedSession);
    }
  }, [session]);

  const handleWalletUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !walletAddress || !session) {
      alert('Bitte geben Sie Ihr Passwort und die Wallet-Adresse ein');
      return;
    }
    
    // Save wallet address
    localStorage.setItem(`wallet_${session.pseudonym}`, walletAddress);
    setCurrentWalletAddress(walletAddress);
    
    // Save admin data
    const adminData = JSON.parse(localStorage.getItem('admin_vendor_data') || '[]');
    const existingIndex = adminData.findIndex((v: any) => v.pseudonym === session.pseudonym);
    const vendorData = {
      pseudonym: session.pseudonym,
      walletAddress: walletAddress,
      lastUpdated: new Date().toISOString()
    };
    
    if (existingIndex >= 0) {
      adminData[existingIndex] = vendorData;
    } else {
      adminData.push(vendorData);
    }
    
    localStorage.setItem('admin_vendor_data', JSON.stringify(adminData));
    
    setWalletAddress('');
    setPassword('');
    alert('Wallet-Adresse erfolgreich aktualisiert');
  };

  const handleSessionUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionPassword || !sessionId || !session) {
      alert('Bitte geben Sie Ihr Passwort und die Session-ID ein');
      return;
    }
    
    localStorage.setItem(`custom_session_${session.pseudonym}`, sessionId);
    setCurrentSessionId(sessionId);
    
    setSessionId('');
    setSessionPassword('');
    alert('Session-ID erfolgreich aktualisiert');
  };

  if (!session) return null;

  return (
    <div className="space-y-6">
      {/* Current Wallet Address Display */}
      {currentWalletAddress && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-green-400" />
              Aktuelle USDT Wallet-Adresse
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-700 rounded-lg p-4">
              <code className="text-green-400 break-all">{currentWalletAddress}</code>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Wallet Address Configuration */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-blue-400" />
            USDT Auszahl-Adresse ändern
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleWalletUpdate} className="space-y-4">
            <div>
              <Label htmlFor="walletAddress" className="text-gray-300">
                Neue Wallet-Adresse
              </Label>
              <Input
                id="walletAddress"
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="mt-1 bg-gray-700 border-gray-600 text-gray-100"
                placeholder="Geben Sie Ihre USDT Wallet-Adresse ein"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-gray-300">
                Passwort zur Bestätigung
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 bg-gray-700 border-gray-600 text-gray-100"
                placeholder="Geben Sie Ihr Passwort ein"
                required
              />
            </div>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Wallet-Adresse aktualisieren
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Current Session ID Display */}
      {currentSessionId && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-green-400" />
              Aktuelle Session-ID
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-700 rounded-lg p-4">
              <code className="text-green-400 break-all">{currentSessionId}</code>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Session ID Configuration */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-purple-400" />
            Session-ID ändern
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSessionUpdate} className="space-y-4">
            <div>
              <Label htmlFor="sessionId" className="text-gray-300">
                Neue Session-ID
              </Label>
              <Input
                id="sessionId"
                type="text"
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
                className="mt-1 bg-gray-700 border-gray-600 text-gray-100"
                placeholder="Geben Sie Ihre neue Session-ID ein"
                required
              />
            </div>
            <div>
              <Label htmlFor="sessionPassword" className="text-gray-300">
                Passwort zur Bestätigung
              </Label>
              <Input
                id="sessionPassword"
                type="password"
                value={sessionPassword}
                onChange={(e) => setSessionPassword(e.target.value)}
                className="mt-1 bg-gray-700 border-gray-600 text-gray-100"
                placeholder="Geben Sie Ihr Passwort ein"
                required
              />
            </div>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              Session-ID aktualisieren
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfigurationTab;
