import React from 'react';
import { Search, Filter, ShoppingBag } from 'lucide-react';
import ProductCard from '../components/marketplace/ProductCard';
import Button from '../components/ui/Button';
import { marketplaceItems } from '../utils/mockData';

const Marketplace = () => {
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Marketplace</h1>
          <p className="text-gray-600">Buy seeds, tools, and agricultural supplies</p>
        </div>
        <div className="mt-3 md:mt-0">
          <Button 
            variant="outline" 
            icon={<ShoppingBag size={16} />}
          >
            My Orders
          </Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <input 
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <Search size={18} />
            </div>
          </div>

          <div className="flex gap-2">
            <select className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option value="">All Categories</option>
              <option value="fertilizers">Fertilizers</option>
              <option value="pesticides">Pesticides</option>
              <option value="seeds">Seeds</option>
              <option value="equipment">Equipment</option>
            </select>
            <Button 
              variant="outline" 
              icon={<Filter size={16} />}
            >
              Filter
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      <div className="mt-6 text-center">
        <Button variant="outline">Load More Products</Button>
      </div>
    </div>
  );
};

export default Marketplace;