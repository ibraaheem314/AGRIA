import React from 'react';
import { Search, Filter, ShoppingBag, GridIcon, ListIcon } from 'lucide-react';
import ProductCard from '../components/marketplace/ProductCard';
import Button from '../components/ui/Button';
import { marketplaceItems } from '../utils/mockData';

const Marketplace = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      {/* En-tête */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-1 bg-green-600"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-medium text-gray-800">Marché agricole</h1>
            <p className="text-gray-500 mt-1">Achetez des semences, des outils et des fournitures agricoles</p>
          </div>
          <div className="flex gap-2">
            <button 
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 text-sm"
            >
              <ShoppingBag size={16} className="mr-2 text-green-600" />
              Mes commandes
            </button>
          </div>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <input 
              type="text"
              placeholder="Rechercher des produits..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:border-green-600 focus:ring-green-600 focus:ring-1 focus:outline-none"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search size={18} />
            </div>
          </div>

          <div className="flex gap-2">
            <select className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:border-green-600 focus:ring-green-600 focus:ring-1 focus:outline-none">
              <option value="">Toutes les catégories</option>
              <option value="fertilizers">Engrais</option>
              <option value="pesticides">Pesticides</option>
              <option value="seeds">Semences</option>
              <option value="equipment">Équipement</option>
            </select>
            <button 
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 text-sm"
            >
              <Filter size={16} className="mr-2 text-gray-500" />
              Filtrer
            </button>
            <div className="hidden md:flex border border-gray-300 rounded-lg overflow-hidden">
              <button className="p-2 bg-gray-50 text-gray-700 border-r border-gray-300 hover:bg-gray-100">
                <GridIcon size={18} />
              </button>
              <button className="p-2 bg-white text-green-600 hover:bg-gray-50">
                <ListIcon size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grille de produits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {marketplaceItems.map((item) => (
          <ProductCard 
            key={item.id}
            name={item.name}
            category={item.category}
            price={item.price}
            unit={item.unit}
            seller={item.seller}
            rating={item.rating}
            image={item.image}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-10 flex justify-center">
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            <span className="sr-only">Précédent</span>
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </a>
          <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">1</a>
          <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-green-50 text-sm font-medium text-green-700 hover:bg-green-100">2</a>
          <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">3</a>
          <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            <span className="sr-only">Suivant</span>
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </a>
        </nav>
      </div>
    </div>
  );
};

export default Marketplace;