import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Plus, Edit, Trash2, Eye, EyeOff, LogOut, Wallet, Key } from 'lucide-react';
import ProductForm from '@/components/ProductForm';
import VendorBanner from '@/components/VendorBanner';

const MyShop = () => {
  const { session, destroySession } = useSession();
  const { products, deleteProduct, updateProduct } = useProducts();
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [currentWalletAddress, setCurrentWalletAddress] = useState('');
  const [password, setPassword] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [currentSessionId, setCurrentSessionId] = useState('');
  const [sessionPassword, setSessionPassword] = useState('');
  const navigate = useNavigate();

  if (!session) {
    navigate('/');
    return null;
  }

  const myProducts = products.filter(p => p.pseudonym === session.pseudonym);

  // Load current wallet address and session ID
  useEffect(() => {
    const savedWallet = localStorage.getItem(`wallet_${session.pseudonym}`);
    const savedSession = localStorage.getItem(`custom_session_${session.pseudonym}`);
    if (savedWallet) setCurrentWalletAddress(savedWallet);
    if (savedSession) setCurrentSessionId(savedSession);
  }, [session.pseudonym]);

  const handleLogout = () => {
    if (confirm('Möchten Sie Ihren Shop wirklich löschen? Alle Daten gehen verloren.')) {
      destroySession();
      navigate('/');
    }
  };

  const toggleVisibility = (productId: string, currentVisibility: boolean) => {
    updateProduct(productId, { visibility: !currentVisibility });
  };

  const handleWalletUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !walletAddress) {
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
    if (!sessionPassword || !sessionId) {
      alert('Bitte geben Sie Ihr Passwort und die Session-ID ein');
      return;
    }
    
    localStorage.setItem(`custom_session_${session.pseudonym}`, sessionId);
    setCurrentSessionId(sessionId);
    
    setSessionId('');
    setSessionPassword('');
    alert('Session-ID erfolgreich aktualisiert');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/90 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-8 w-8 text-red-500" />
              <h1 className="text-2xl font-bold">No Limit Center: Vendor Area</h1>
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="outline" onClick={() => navigate('/')} className="border-gray-600 text-white rounded-md bg-red-700 hover:bg-red-600">
                Marktplatz
              </Button>
              <Button variant="destructive" onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
                <LogOut className="h-4 w-4 mr-2" />
                Shop löschen
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="shop" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-gray-800 mb-8">
            <TabsTrigger value="shop">Shop</TabsTrigger>
            <TabsTrigger value="banner">Banner</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
          </TabsList>

          {/* Shop Tab */}
          <TabsContent value="shop">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Shop: @{session.pseudonym}</h2>
                  <p className="text-gray-400">Erstellt am: {new Date(session.createdAt).toLocaleDateString('de-DE')}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Shop-URL: /shop/{session.pseudonym}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Banner Tab */}
          <TabsContent value="banner">
            <VendorBanner />
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Meine Produkte ({myProducts.length})</h3>
              <Button onClick={() => setShowProductForm(true)} className="bg-red-600 hover:bg-red-700">
                <Plus className="h-4 w-4 mr-2" />
                Produkt hinzufügen
              </Button>
            </div>

            {myProducts.length === 0 ? (
              <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
                <ShoppingBag className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-400 mb-2">Noch keine Produkte</h4>
                <p className="text-gray-500 mb-4">Fügen Sie Ihr erstes digitales Produkt hinzu</p>
                <Button onClick={() => setShowProductForm(true)} className="bg-red-600 hover:bg-red-700">
                  Erstes Produkt erstellen
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myProducts.map(product => (
                  <div key={product.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                    <div className="aspect-video bg-gray-700 relative">
                      <img src={product.images[0] || '/placeholder.svg'} alt={product.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2">
                        <Button size="sm" variant="secondary" onClick={() => toggleVisibility(product.id, product.visibility)} className="bg-gray-900/80 hover:bg-gray-900">
                          {product.visibility ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold mb-2 truncate">{product.title}</h4>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-red-400 font-bold">{product.price} {product.currency}</span>
                        <span className="text-sm text-gray-500">Lager: {product.stock}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => {
                          setEditingProduct(product.id);
                          setShowProductForm(true);
                        }} className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700">
                          <Edit className="h-4 w-4 mr-1" />
                          Bearbeiten
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => {
                          if (confirm('Produkt wirklich löschen?')) {
                            deleteProduct(product.id);
                          }
                        }} className="bg-red-600 hover:bg-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>Bestellungen</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Hier werden Ihre Bestellungen angezeigt.</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configuration Tab */}
          <TabsContent value="configuration">
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
          </TabsContent>
        </Tabs>
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <ProductForm
          productId={editingProduct}
          onClose={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default MyShop;
