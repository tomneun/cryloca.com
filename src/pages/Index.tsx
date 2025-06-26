import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShoppingBag, Shield, Eye } from 'lucide-react';
const Index = () => {
  const {
    session,
    createSession,
    isAuthenticated
  } = useSession();
  const {
    getPublicProducts
  } = useProducts();
  const [pseudonym, setPseudonym] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!pseudonym.trim()) {
      setError('Pseudonym ist erforderlich');
      return;
    }
    if (pseudonym.length < 3 || pseudonym.length > 20) {
      setError('Pseudonym muss zwischen 3-20 Zeichen lang sein');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(pseudonym)) {
      setError('Nur alphanumerische Zeichen und Unterstriche erlaubt');
      return;
    }
    createSession(pseudonym);
    navigate('/my-shop');
  };
  if (isAuthenticated) {
    const publicProducts = getPublicProducts();
    return <div className="min-h-screen bg-gray-900 text-gray-100">
        {/* Header */}
        <header className="border-b border-gray-800 bg-gray-900/90 backdrop-blur">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-8 w-8 text-red-500" />
                <h1 className="text-2xl font-bold">AnonShop</h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400">@{session?.pseudonym}</span>
                <Button onClick={() => navigate('/my-shop')} className="bg-red-600 hover:bg-red-700">
                  Mein Shop
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Anonymer Marktplatz</h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Verkaufen und kaufen Sie digitale Güter vollständig anonym über das Tor-Netzwerk
            </p>
            <div className="flex justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-red-500" />
                <span>Tor Hidden Service</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-red-500" />
                <span>Keine Registrierung</span>
              </div>
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-red-500" />
                <span>Monero Zahlungen</span>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h3 className="text-2xl font-bold mb-8 text-center">Aktuelle Angebote</h3>
            {publicProducts.length === 0 ? <div className="text-center py-12">
                <ShoppingBag className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Noch keine Produkte verfügbar</p>
              </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {publicProducts.slice(0, 6).map(product => <div key={product.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-red-500/50 transition-colors">
                    <div className="aspect-video bg-gray-700 relative">
                      {product.images.length > 0 ? <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full">
                          <ShoppingBag className="h-12 w-12 text-gray-500" />
                        </div>}
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold mb-2 truncate">{product.title}</h4>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-red-400 font-bold">{product.price} {product.currency}</span>
                        <Button size="sm" onClick={() => navigate(`/shop/${product.pseudonym}/product/${product.id}`)} className="bg-red-600 hover:bg-red-700">
                          Ansehen
                        </Button>
                      </div>
                    </div>
                  </div>)}
              </div>}
          </div>
        </section>
      </div>;
  }
  return <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <ShoppingBag className="h-12 w-12 text-red-500" />
            <h1 className="text-3xl font-bold">No Limit  Center</h1>
          </div>
          <p className="text-gray-400">Anonymer Marktplatz über Tor</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-6 text-center">Pseudonym wählen</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="pseudonym" className="text-gray-300">
                Pseudonym (3-20 Zeichen)
              </Label>
              <Input id="pseudonym" type="text" value={pseudonym} onChange={e => setPseudonym(e.target.value)} placeholder="mein_pseudonym" className="mt-1 bg-gray-700 border-gray-600 text-gray-100 focus:border-red-500" maxLength={20} />
              <p className="text-xs text-gray-400 mt-1">
                Nur Buchstaben, Zahlen und Unterstriche
              </p>
            </div>

            {error && <div className="text-red-400 text-sm">{error}</div>}

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={!pseudonym.trim()}>
              Shop erstellen
            </Button>
          </form>

          <div className="mt-6 text-xs text-gray-400 space-y-1">
            <p>• Keine E-Mail oder Passwort erforderlich</p>
            <p>• Session wird lokal gespeichert</p>
            <p>• Vollständig anonym über Tor</p>
          </div>
        </div>
      </div>
    </div>;
};
export default Index;