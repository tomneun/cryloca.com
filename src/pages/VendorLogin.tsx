import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Store } from 'lucide-react';
import { toast } from 'sonner';

const VendorLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error('Bitte geben Sie Benutzernamen und Passwort ein');
      return;
    }

    // Check vendor credentials
    const licenses = JSON.parse(localStorage.getItem('vendor_licenses') || '[]');
    const vendor = licenses.find((l: any) => 
      l.username === username && 
      l.password === password && 
      l.status === 'approved'
    );

    if (vendor) {
      // Vendor login successful
      localStorage.setItem('anonshop_vendor_session', JSON.stringify({
        username: vendor.username,
        type: 'vendor',
        vendorData: vendor
      }));
      toast.success('Login erfolgreich!');
      navigate('/my-shop');
      return;
    }

    toast.error('Ungültige Anmeldedaten oder Konto nicht genehmigt');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700 p-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/choose-role')}
          className="mb-6 text-gray-400 hover:text-gray-200"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zurück
        </Button>

        <div className="text-center mb-6">
          <Store className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-100 mb-2">Verkäufer Login</h1>
          <p className="text-gray-400">Melden Sie sich mit Ihren Verkäufer-Zugangsdaten an</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="username">Benutzername</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-gray-700 border-gray-600"
              placeholder="Ihr Benutzername"
            />
          </div>

          <div>
            <Label htmlFor="password">Passwort</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-700 border-gray-600"
              placeholder="Ihr Passwort"
            />
          </div>

          <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
            Anmelden
          </Button>

          <div className="text-center pt-4 border-t border-gray-700">
            <p className="text-gray-400 text-sm mb-2">Noch kein Verkäufer-Konto?</p>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/vendor-license')}
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Verkäufer-Lizenz kaufen
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default VendorLogin;
