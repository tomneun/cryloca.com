
import { useState, useEffect } from 'react';
import { useSession } from '@/hooks/useSession';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, AlertCircle } from 'lucide-react';
import { validateUSDTAddress } from '@/utils/validationUtils';

const WalletConfiguration = () => {
  const { session } = useSession();
  const [walletAddress, setWalletAddress] = useState('');
  const [currentWalletAddress, setCurrentWalletAddress] = useState('');
  const [password, setPassword] = useState('');
  const [walletError, setWalletError] = useState('');

  useEffect(() => {
    if (session) {
      const savedWallet = localStorage.getItem(`wallet_${session.pseudonym}`);
      if (savedWallet) setCurrentWalletAddress(savedWallet);
    }
  }, [session]);

  const handleWalletUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setWalletError('');
    
    if (!password || !walletAddress || !session) {
      setWalletError('Bitte geben Sie Ihr Passwort und die Wallet-Adresse ein');
      return;
    }

    if (!validateUSDTAddress(walletAddress)) {
      setWalletError('Ungültige USDT-Adresse. Bitte geben Sie eine gültige Tron (TRC-20), Ethereum (ERC-20) oder Bitcoin (Omni) Adresse ein.');
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
                Neue Wallet-Adresse (TRC-20, ERC-20 oder Omni)
              </Label>
              <Input
                id="walletAddress"
                type="text"
                value={walletAddress}
                onChange={(e) => {
                  setWalletAddress(e.target.value);
                  setWalletError('');
                }}
                className="mt-1 bg-gray-700 border-gray-600 text-gray-100"
                placeholder="Geben Sie Ihre USDT Wallet-Adresse ein"
                required
              />
              {walletError && (
                <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{walletError}</span>
                </div>
              )}
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
    </div>
  );
};

export default WalletConfiguration;
