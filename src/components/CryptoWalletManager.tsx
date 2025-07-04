
import { useState } from 'react';
import { useCryptoWallets } from '@/hooks/useCryptoWallets';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, Bitcoin, Circle } from 'lucide-react';

const CryptoWalletManager = () => {
  const { wallets, updateWallets } = useCryptoWallets();
  const [btcAddress, setBtcAddress] = useState(wallets.btcAddress);
  const [xmrAddress, setXmrAddress] = useState(wallets.xmrAddress);
  const [message, setMessage] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!btcAddress.trim() || !xmrAddress.trim()) {
      setMessage('Bitte beide Adressen eingeben');
      return;
    }

    updateWallets({
      btcAddress: btcAddress.trim(),
      xmrAddress: xmrAddress.trim()
    });
    
    setMessage('Wallet-Adressen erfolgreich aktualisiert');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <Card className="bg-gray-800 border-gray-700 mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-6 w-6 text-orange-400" />
          Crypto Wallet Verwaltung
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
          <p className="text-yellow-300 text-sm">
            <strong>Wichtig:</strong> Alle Kundenzahlungen werden automatisch an diese Adressen weitergeleitet. 
            Änderungen werden sofort für neue Bestellungen wirksam.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <Label htmlFor="btcAddress" className="text-gray-300 flex items-center gap-2 mb-2">
              <Bitcoin className="h-4 w-4 text-orange-500" />
              Bitcoin (BTC) Adresse
            </Label>
            <Input
              id="btcAddress"
              value={btcAddress}
              onChange={(e) => setBtcAddress(e.target.value)}
              className="bg-gray-700 border-gray-600 text-gray-100"
              placeholder="Geben Sie Ihre BTC-Adresse ein"
            />
          </div>

          <div>
            <Label htmlFor="xmrAddress" className="text-gray-300 flex items-center gap-2 mb-2">
              <Circle className="h-4 w-4 text-orange-500" />
              Monero (XMR) Adresse
            </Label>
            <Input
              id="xmrAddress"
              value={xmrAddress}
              onChange={(e) => setXmrAddress(e.target.value)}
              className="bg-gray-700 border-gray-600 text-gray-100"
              placeholder="Geben Sie Ihre XMR-Adresse ein"
            />
          </div>

          {message && (
            <div className={`text-sm ${message.includes('erfolgreich') ? 'text-green-400' : 'text-red-400'}`}>
              {message}
            </div>
          )}

          <Button type="submit" className="bg-red-600 hover:bg-red-700">
            Adressen speichern
          </Button>
        </form>

        {wallets.lastUpdated && (
          <div className="mt-4 text-sm text-gray-400">
            Zuletzt aktualisiert: {new Date(wallets.lastUpdated).toLocaleString('de-DE')}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CryptoWalletManager;
