import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Settings, Euro, ArrowLeft, Store, MessageSquare, Wallet, Bot } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import VendorCodeManager from '@/components/VendorCodeManager';
import AdminContact from '@/components/AdminContact';
import { toast } from 'sonner';

interface VendorLicense {
  id: string;
  username: string;
  sessionId: string;
  signalId: string;
  cryptoAddresses: {
    btc: string;
    xmr: string;
    usdc: string;
    ltc: string;
  };
  status: string;
  createdAt: string;
}

const AdminDashboard = () => {
  const [sessionId, setSessionId] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [licenseFee, setLicenseFee] = useState<number>(500);
  const [newFee, setNewFee] = useState<string>('');
  const [vendors, setVendors] = useState<VendorLicense[]>([]);
  const [adminWallets, setAdminWallets] = useState({
    btc: '',
    xmr: '',
    usdc: '',
    ltc: ''
  });
  const [messageToVendor, setMessageToVendor] = useState('');
  const [selectedVendor, setSelectedVendor] = useState('');
  const navigate = useNavigate();

  const ADMIN_SESSION_ID = '053aa07e41ee40915fcb71fa6f2512cf7156191d3fc1742f5c76ebd4039bcebe4d';
  const ADMIN_PASSWORD = 'Tz08154711';

  useEffect(() => {
    const savedFee = localStorage.getItem('vendor_license_fee');
    if (savedFee) {
      setLicenseFee(parseFloat(savedFee));
    }

    const savedWallets = localStorage.getItem('admin_wallets');
    if (savedWallets) {
      setAdminWallets(JSON.parse(savedWallets));
    }

    loadVendors();
  }, []);

  const loadVendors = () => {
    const licenses = JSON.parse(localStorage.getItem('vendor_licenses') || '[]');
    setVendors(licenses);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (sessionId === ADMIN_SESSION_ID && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast.success('Admin-Anmeldung erfolgreich');
    } else {
      toast.error('Ungültige Admin-Anmeldedaten');
    }
  };

  const handleUpdateFee = (e: React.FormEvent) => {
    e.preventDefault();
    const fee = parseFloat(newFee);
    if (isNaN(fee) || fee <= 0) {
      toast.error('Bitte geben Sie einen gültigen Betrag ein');
      return;
    }
    
    setLicenseFee(fee);
    localStorage.setItem('vendor_license_fee', fee.toString());
    setNewFee('');
    toast.success(`Lizenzgebühr aktualisiert auf €${fee}`);
  };

  const handleUpdateWallets = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('admin_wallets', JSON.stringify(adminWallets));
    toast.success('Admin-Wallets aktualisiert');
  };

  const handleApproveVendor = (vendorId: string) => {
    const licenses = JSON.parse(localStorage.getItem('vendor_licenses') || '[]');
    const updatedLicenses = licenses.map((l: any) => 
      l.id === vendorId ? { ...l, status: 'approved' } : l
    );
    localStorage.setItem('vendor_licenses', JSON.stringify(updatedLicenses));
    loadVendors();
    toast.success('Verkäufer genehmigt');
  };

  const handleRejectVendor = (vendorId: string) => {
    const licenses = JSON.parse(localStorage.getItem('vendor_licenses') || '[]');
    const updatedLicenses = licenses.map((l: any) => 
      l.id === vendorId ? { ...l, status: 'rejected' } : l
    );
    localStorage.setItem('vendor_licenses', JSON.stringify(updatedLicenses));
    loadVendors();
    toast.success('Verkäufer abgelehnt');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVendor || !messageToVendor) {
      toast.error('Bitte wählen Sie einen Verkäufer und geben Sie eine Nachricht ein');
      return;
    }
    
    // In a real app, this would send via Session/Signal
    const vendor = vendors.find(v => v.id === selectedVendor);
    console.log(`Nachricht an ${vendor?.username}:`, messageToVendor);
    console.log(`Session-ID: ${vendor?.sessionId}, Signal-ID: ${vendor?.signalId}`);
    
    toast.success(`Nachricht an ${vendor?.username} gesendet (via ${vendor?.sessionId ? 'Session' : 'Signal'})`);
    setMessageToVendor('');
    setSelectedVendor('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-center justify-center">
              <Shield className="h-6 w-6 text-red-500" />
              Admin-Zugang
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="sessionId" className="text-gray-300">
                  Admin Session-ID
                </Label>
                <Input
                  id="sessionId"
                  type="password"
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  className="mt-1 bg-gray-700 border-gray-600 text-gray-100"
                  placeholder="Admin Session-ID eingeben"
                />
              </div>
              
              <div>
                <Label htmlFor="password" className="text-gray-300">
                  Admin-Passwort
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 bg-gray-700 border-gray-600 text-gray-100"
                  placeholder="Admin-Passwort eingeben"
                />
              </div>
              
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                Anmelden
              </Button>
            </form>
            
            <div className="mt-4 text-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/rules')}
                className="text-gray-400 hover:text-gray-100"
              >
                Zurück zu Regeln
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
      <div className="container mx-auto max-w-6xl">
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
            Zurück
          </Button>
        </div>

        <Tabs defaultValue="settings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-gray-800">
            <TabsTrigger value="settings">Einstellungen</TabsTrigger>
            <TabsTrigger value="vendors">Verkäufer</TabsTrigger>
            <TabsTrigger value="wallets">Wallets</TabsTrigger>
            <TabsTrigger value="messages">Nachrichten</TabsTrigger>
            <TabsTrigger value="codes">Codes</TabsTrigger>
          </TabsList>

          <TabsContent value="settings">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-6 w-6 text-blue-400" />
                  Aktuelle Einstellungen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-700 rounded-lg p-4 mb-6">
                  <p className="text-lg">
                    <span className="text-gray-400">Aktuelle Verkäufer-Lizenzgebühr:</span>
                    <span className="text-red-400 font-bold ml-2">€{licenseFee}</span>
                  </p>
                </div>

                <form onSubmit={handleUpdateFee} className="space-y-4">
                  <div>
                    <Label htmlFor="newFee" className="text-gray-300">
                      Neue Lizenzgebühr (EUR)
                    </Label>
                    <Input
                      id="newFee"
                      type="number"
                      min="1"
                      step="0.01"
                      value={newFee}
                      onChange={(e) => setNewFee(e.target.value)}
                      className="mt-1 bg-gray-700 border-gray-600 text-gray-100"
                      placeholder="Neuen Betrag eingeben"
                    />
                  </div>
                  
                  <Button type="submit" className="bg-red-600 hover:bg-red-700">
                    Gebühr aktualisieren
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vendors">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-6 w-6 text-green-400" />
                  Verkäufer-Übersicht
                </CardTitle>
              </CardHeader>
              <CardContent>
                {vendors.length === 0 ? (
                  <p className="text-gray-400">Keine Verkäufer vorhanden</p>
                ) : (
                  <div className="space-y-4">
                    {vendors.map((vendor) => (
                      <div key={vendor.id} className="bg-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-lg font-bold text-gray-100">{vendor.username}</h3>
                            <p className="text-sm text-gray-400">Status: <span className={vendor.status === 'approved' ? 'text-green-400' : vendor.status === 'rejected' ? 'text-red-400' : 'text-yellow-400'}>{vendor.status}</span></p>
                          </div>
                          {vendor.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleApproveVendor(vendor.id)} className="bg-green-600 hover:bg-green-700">
                                Genehmigen
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleRejectVendor(vendor.id)}>
                                Ablehnen
                              </Button>
                            </div>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-400">Session-ID:</span>
                            <p className="text-gray-200 font-mono text-xs break-all">{vendor.sessionId || 'Nicht angegeben'}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Signal-ID:</span>
                            <p className="text-gray-200 font-mono text-xs break-all">{vendor.signalId || 'Nicht angegeben'}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">BTC:</span>
                            <p className="text-gray-200 font-mono text-xs break-all">{vendor.cryptoAddresses.btc || '-'}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">XMR:</span>
                            <p className="text-gray-200 font-mono text-xs break-all">{vendor.cryptoAddresses.xmr || '-'}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">USDC:</span>
                            <p className="text-gray-200 font-mono text-xs break-all">{vendor.cryptoAddresses.usdc || '-'}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">LTC:</span>
                            <p className="text-gray-200 font-mono text-xs break-all">{vendor.cryptoAddresses.ltc || '-'}</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Erstellt: {new Date(vendor.createdAt).toLocaleString('de-DE')}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wallets">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-6 w-6 text-yellow-400" />
                  Admin Wallet-Adressen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400 mb-4">Diese Adressen werden Käufern beim Checkout angezeigt</p>
                <form onSubmit={handleUpdateWallets} className="space-y-4">
                  <div>
                    <Label htmlFor="adminBtc" className="text-gray-300">Bitcoin (BTC) Adresse</Label>
                    <Input
                      id="adminBtc"
                      value={adminWallets.btc}
                      onChange={(e) => setAdminWallets({...adminWallets, btc: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-gray-100 font-mono text-sm"
                      placeholder="bc1..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="adminXmr" className="text-gray-300">Monero (XMR) Adresse</Label>
                    <Input
                      id="adminXmr"
                      value={adminWallets.xmr}
                      onChange={(e) => setAdminWallets({...adminWallets, xmr: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-gray-100 font-mono text-sm"
                      placeholder="4..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="adminUsdc" className="text-gray-300">USDC Adresse</Label>
                    <Input
                      id="adminUsdc"
                      value={adminWallets.usdc}
                      onChange={(e) => setAdminWallets({...adminWallets, usdc: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-gray-100 font-mono text-sm"
                      placeholder="0x..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="adminLtc" className="text-gray-300">Litecoin (LTC) Adresse</Label>
                    <Input
                      id="adminLtc"
                      value={adminWallets.ltc}
                      onChange={(e) => setAdminWallets({...adminWallets, ltc: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-gray-100 font-mono text-sm"
                      placeholder="L..."
                    />
                  </div>
                  <Button type="submit" className="bg-red-600 hover:bg-red-700">
                    Wallets speichern
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-6 w-6 text-purple-400" />
                  Nachricht an Verkäufer senden
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSendMessage} className="space-y-4">
                  <div>
                    <Label htmlFor="vendorSelect" className="text-gray-300">Verkäufer auswählen</Label>
                    <select
                      id="vendorSelect"
                      value={selectedVendor}
                      onChange={(e) => setSelectedVendor(e.target.value)}
                      className="w-full mt-1 bg-gray-700 border-gray-600 text-gray-100 rounded-md p-2"
                    >
                      <option value="">-- Verkäufer wählen --</option>
                      {vendors.filter(v => v.status === 'approved').map(vendor => (
                        <option key={vendor.id} value={vendor.id}>
                          {vendor.username} ({vendor.sessionId ? 'Session' : 'Signal'})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="message" className="text-gray-300">Nachricht</Label>
                    <Textarea
                      id="message"
                      value={messageToVendor}
                      onChange={(e) => setMessageToVendor(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-gray-100"
                      rows={5}
                      placeholder="Nachricht eingeben..."
                    />
                  </div>
                  <Button type="submit" className="bg-red-600 hover:bg-red-700">
                    Nachricht senden
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="codes">
            <VendorCodeManager />
          </TabsContent>
        </Tabs>
      </div>
      
      <AdminContact />
    </div>
  );
};

export default AdminDashboard;
