
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ArrowLeft, ShoppingCart } from 'lucide-react';

const Shop = () => {
  const { pseudonym } = useParams<{ pseudonym: string }>();
  const { getProductsByPseudonym } = useProducts();
  const { addToCart, getTotalItems } = useCart();
  const navigate = useNavigate();

  if (!pseudonym) {
    navigate('/');
    return null;
  }

  const products = getProductsByPseudonym(pseudonym);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/90 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-gray-400 hover:text-gray-100"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Zurück
              </Button>
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-6 w-6 text-red-500" />
                <h1 className="text-xl font-bold">@{pseudonym}</h1>
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
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Shop von @{pseudonym}</h2>
          <p className="text-gray-400">{products.length} Produkte verfügbar</p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">Keine Produkte gefunden</h3>
            <p className="text-gray-500">Dieser Shop hat noch keine öffentlichen Produkte</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-red-500/50 transition-colors">
                <div className="aspect-video bg-gray-700 relative">
                  {product.images.length > 0 ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ShoppingBag className="h-12 w-12 text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2 truncate">{product.title}</h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-3">{product.description}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-red-400 font-bold">{product.price} {product.currency}</span>
                    <span className="text-sm text-gray-500">Lager: {product.stock}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/shop/${pseudonym}/product/${product.id}`)}
                      className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Details
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => addToCart({
                        productId: product.id,
                        title: product.title,
                        price: product.price,
                        currency: product.currency,
                        sellerPseudonym: product.pseudonym,
                        image: product.images[0]
                      })}
                      className="bg-red-600 hover:bg-red-700"
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
