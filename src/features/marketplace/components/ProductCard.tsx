import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface ProductCardProps {
  name: string;
  category: string;
  price: number;
  unit: string;
  seller: string;
  rating: number;
  image: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  category,
  price,
  unit,
  seller,
  rating,
  image
}) => {
  return (
    <Card className="overflow-hidden bg-[#151818] border border-neutral-800">
      <div className="h-40 overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          {category}
        </span>
        <h3 className="text-lg font-semibold text-white mt-1">{name}</h3>
        <p className="text-sm text-gray-400 mt-1">Vendu par {seller}</p>
        
        <div className="flex items-center mt-2">
          <div className="flex items-center">
            <Star size={16} className="text-yellow-400 fill-current" />
            <span className="ml-1 text-sm text-gray-400">{rating.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-white">{price}€</span>
            <span className="text-sm text-gray-400 ml-1">{unit}</span>
          </div>
          <Button 
            variant="primary" 
            size="sm"
            icon={<ShoppingCart size={16} />}
          >
            Ajouter
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
