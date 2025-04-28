import React from 'react';
import { PlusCircle, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import CropCard from '../components/farms/CropCard';
import Button from '../components/ui/Button';
import { cropData } from '../utils/mockData';

const Farms = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Farms & Crops</h1>
          <p className="text-gray-600">Manage your farms and monitor crop growth</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            icon={<Filter size={16} />}
          >
            Filter
          </Button>
          <Button 
            variant="primary" 
            icon={<PlusCircle size={16} />}
          >
            Add Crop
          </Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Green Valley Farm</h2>
            <p className="text-sm text-gray-600">Main farm - 30.8 hectares total area</p>
          </div>
          <div className="flex items-center space-x-3 mt-2 md:mt-0">
            <span className="text-sm text-gray-500">
              <span className="font-medium text-green-600">3</span> active crops
            </span>
            <Button variant="outline" size="sm">Manage Farm</Button>
          </div>
        </div>
      </div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
      >
        {cropData.map((crop) => (
          <motion.div 
            key={crop.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CropCard 
              name={crop.name}
              area={crop.area}
              plantedDate={crop.plantedDate}
              expectedHarvest={crop.expectedHarvest}
              status={crop.status}
              health={crop.health}
              image={crop.image}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Farms;