
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ArrowLeft, ShoppingCart, Calendar, Package } from 'lucide-react';

const ProductDetail = () => {
  const { pseudonym, id } = useParams<{ pseudonym: string; id: string }>();
  const { getProductById } = useProducts();
  const { addToCart, getTotalItems } = useCart();
  const navigate = useNavigate();

  if (!pseudonym || !id) {
    navigate('/');
    return null;
  }

  const product = getProductById(id);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Produkt nicht gefunden</h2>
          <Button onClick={() => navigate(`/shop/${pseudonym}`)} className="bg-red-600 hover:bg-red-700">
            Zurück zum Shop
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/90 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate(`/shop/${pseudonym}`)}
                className="text-gray-400 hover:text-gray-100"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Zurück zum Shop
              </Button>
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-6 w-6 text-red-500" />
                <span className="text-gray-400">@{pseudonym}</span>
              </div>
            </div>
            <Button
              onClick={() => navigate('/checkout')}
              className="bg-red-600 hover:bg-red-700 relative"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Warenkorb
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
              <img 
                src={product.images[0] || '/placeholder.svg'} 
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1, 5).map((image, index) => (
                  <div key={index} className="aspect-square bg-gray-800 rounded overflow-hidden border border-gray-700">
                    <img src={image} alt={`${product.title} ${index + 2}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
              <p className="text-gray-400">von @{product.pseudonym}</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="text-3xl font-bold text-red-400 mb-2">
                {product.price} {product.currency}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Package className="h-4 w-4" />
                  <span>Lager: {product.stock}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(product.createdAt).toLocaleDateString('de-DE')}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Produktbeschreibung</h3>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <p className="text-gray-300 whitespace-pre-wrap">{product.description}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Kategorie</h3>
              <span className="inline-block bg-red-900/30 text-red-300 px-3 py-1 rounded-full text-sm border border-red-700">
                {product.category}
              </span>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={() => addToCart({
                  productId: product.id,
                  title: product.title,
                  price: product.price,
                  currency: product.currency,
                  sellerPseudonym: product.pseudonym,
                  image: product.images[0]
                })}
                className="w-full bg-red-600 hover:bg-red-700"
                size="lg"
                disabled={product.stock === 0}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {product.stock === 0 ? 'Ausverkauft' : 'In den Warenkorb'}
              </Button>

              <div className="text-xs text-gray-400 space-y-1">
                <p>• Zahlung über Monero (XMR)</p>
                <p>• Sofortiger Download nach Bestätigung</p>
                <p>• Download-Link läuft nach 24h ab</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
