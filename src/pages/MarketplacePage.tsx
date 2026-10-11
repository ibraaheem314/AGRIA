import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Star, ShoppingCart, Package, Truck, Shield, Heart, Plus, Minus } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  seller: string;
  sellerRating: number;
  image: string;
  description: string;
  inStock: boolean;
  delivery: string;
  certified: boolean;
  badge?: string;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Semences Bio Blé Tendre',
    category: 'Semences',
    price: 45.90,
    originalPrice: 52.90,
    rating: 4.8,
    reviews: 127,
    seller: 'AgroSem France',
    sellerRating: 4.9,
    image: '/api/placeholder/300/200',
    description: 'Semences certifiées biologiques de blé tendre, variété résistante aux maladies.',
    inStock: true,
    delivery: 'Livraison 24-48h',
    certified: true,
    badge: 'BIO'
  },
  {
    id: '2',
    name: 'Engrais Organique NPK 15-10-10',
    category: 'Fertilisants',
    price: 28.50,
    rating: 4.6,
    reviews: 89,
    seller: 'BioNutrients Pro',
    sellerRating: 4.7,
    image: '/api/placeholder/300/200',
    description: 'Engrais organique équilibré pour toutes cultures, 100% naturel.',
    inStock: true,
    delivery: 'Livraison 2-3 jours',
    certified: true,
    badge: 'ECO'
  },
  {
    id: '3',
    name: 'Système d\'irrigation Goutte-à-goutte',
    category: 'Équipements',
    price: 189.99,
    originalPrice: 220.00,
    rating: 4.9,
    reviews: 156,
    seller: 'AquaTech Solutions',
    sellerRating: 4.8,
    image: '/api/placeholder/300/200',
    description: 'Kit complet pour irrigation précise, économie d\'eau garantie.',
    inStock: true,
    delivery: 'Livraison gratuite',
    certified: true
  },
  {
    id: '4',
    name: 'Pesticide Bio Anti-Pucerons',
    category: 'Protection',
    price: 15.75,
    rating: 4.4,
    reviews: 73,
    seller: 'EcoProtect',
    sellerRating: 4.5,
    image: '/api/placeholder/300/200',
    description: 'Solution naturelle contre les pucerons, respectueuse des auxiliaires.',
    inStock: false,
    delivery: 'Rupture de stock',
    certified: true,
    badge: 'BIO'
  },
  {
    id: '5',
    name: 'Capteur Humidité Sol IoT',
    category: 'Technologies',
    price: 89.90,
    rating: 4.7,
    reviews: 45,
    seller: 'SmartFarm Tech',
    sellerRating: 4.6,
    image: '/api/placeholder/300/200',
    description: 'Capteur connecté pour surveillance précise de l\'humidité du sol.',
    inStock: true,
    delivery: 'Livraison express',
    certified: false,
    badge: 'INNOVATION'
  },
  {
    id: '6',
    name: 'Graines Tomates Anciennes',
    category: 'Semences',
    price: 12.90,
    rating: 4.9,
    reviews: 203,
    seller: 'Graines du Terroir',
    sellerRating: 4.9,
    image: '/api/placeholder/300/200',
    description: 'Assortiment de variétés anciennes de tomates, saveurs authentiques.',
    inStock: true,
    delivery: 'Livraison 24h',
    certified: true,
    badge: 'HERITAGE'
  }
];

const categories = [
  'Tous les produits',
  'Semences',
  'Fertilisants',
  'Protection',
  'Équipements',
  'Technologies',
  'Outils'
];

const MarketplacePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous les produits');
  const [cart, setCart] = useState<{[key: string]: number}>({});
  const [showCart, setShowCart] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.seller.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tous les produits' || 
                           product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (productId: string) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId]--;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  };

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((total, [productId, quantity]) => {
      const product = mockProducts.find(p => p.id === productId);
      return total + (product ? product.price * quantity : 0);
    }, 0);
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'BIO': return 'bg-green-100 text-green-800';
      case 'ECO': return 'bg-blue-100 text-blue-800';
      case 'INNOVATION': return 'bg-purple-100 text-purple-800';
      case 'HERITAGE': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto px-6 py-12"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            Marketplace <span className="text-purple-600 font-normal">Agricole</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez une sélection de produits agricoles de qualité. 
            Vendeurs certifiés, livraison rapide.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher des produits, vendeurs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <Button
              variant="primary"
              className="bg-purple-600 hover:bg-purple-700 relative"
              onClick={() => setShowCart(true)}
            >
              <ShoppingCart size={20} className="mr-2" />
              Panier {getTotalItems() > 0 && `(${getTotalItems()})`}
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="relative">
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <Package size={48} className="text-gray-400" />
                  </div>
                  
                  {/* Badge */}
                  {product.badge && (
                    <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(product.badge)}`}>
                      {product.badge}
                    </div>
                  )}
                  
                  {/* Favorite */}
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                  >
                    <Heart 
                      size={16} 
                      className={favorites.includes(product.id) ? 'text-red-500 fill-current' : 'text-gray-400'} 
                    />
                  </button>

                  {/* Stock status */}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-medium">Rupture de stock</span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="mb-3">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{product.rating}</span>
                      <span className="text-sm text-gray-500">({product.reviews})</span>
                    </div>
                    {product.certified && (
                      <Shield size={14} className="text-green-500" />
                    )}
                  </div>

                  <div className="mb-3">
                    <p className="text-sm text-gray-600">
                      Vendu par <span className="font-medium">{product.seller}</span>
                    </p>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Truck size={12} />
                      <span>{product.delivery}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-gray-900">
                          {product.price.toFixed(2)}€
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            {product.originalPrice.toFixed(2)}€
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {cart[product.id] ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeFromCart(product.id)}
                            className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center hover:bg-purple-200"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-medium">{cart[product.id]}</span>
                          <button
                            onClick={() => addToCart(product.id)}
                            disabled={!product.inStock}
                            className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center hover:bg-purple-200 disabled:opacity-50"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="primary"
                          className="bg-purple-600 hover:bg-purple-700"
                          onClick={() => addToCart(product.id)}
                          disabled={!product.inStock}
                        >
                          <ShoppingCart size={16} className="mr-1" />
                          Ajouter
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              Aucun produit trouvé pour votre recherche.
            </p>
          </div>
        )}
      </motion.div>

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-md w-full p-6 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Votre Panier</h3>
              <button
                onClick={() => setShowCart(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {Object.keys(cart).length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Votre panier est vide</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {Object.entries(cart).map(([productId, quantity]) => {
                    const product = mockProducts.find(p => p.id === productId);
                    if (!product) return null;
                    
                    return (
                      <div key={productId} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="w-12 h-12 bg-gray-200 rounded flex-shrink-0"></div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{product.name}</h4>
                          <p className="text-sm text-gray-600">{product.price.toFixed(2)}€</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeFromCart(productId)}
                            className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="font-medium">{quantity}</span>
                          <button
                            onClick={() => addToCart(productId)}
                            className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold">Total:</span>
                    <span className="text-xl font-bold text-purple-600">
                      {getTotalPrice().toFixed(2)}€
                    </span>
                  </div>
                  
                  <Button
                    variant="primary"
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={() => {
                      setShowCart(false);
                      // Ici on ajouterait la logique de commande
                    }}
                  >
                    Passer la commande
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MarketplacePage; 