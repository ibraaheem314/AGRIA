import React from 'react';
import { motion } from 'framer-motion';
import { Satellite, CloudRain, LineChart, Map, Layers, BarChart3, Droplets, Sun } from 'lucide-react';
import Button from './ui/Button';

const Features = () => {
  return (
    <div className="py-20 border-b border-neutral-800">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <div className="text-amber-500 mb-4">CORE FEATURES</div>
          <h2 className="text-4xl md:text-5xl font-light mb-6">
            Advanced Solutions for Precision Agriculture
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Our platform combines satellite imagery, weather data, and advanced analytics to help you make better decisions for your crops.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <FeatureCard 
            icon={<Satellite className="h-8 w-8" />}
            title="High-Resolution Satellite Imagery"
            description="Access the latest satellite images with daily updates and 10m per pixel resolution."
            image="/images/features/satellite-imagery.jpg"
            index={0}
          />
          <FeatureCard 
            icon={<CloudRain className="h-8 w-8" />}
            title="Precise Weather Forecasts"
            description="Hyperlocal forecasts up to 14 days to plan your agricultural activities with confidence."
            image="/images/features/weather-forecast.jpg"
            index={1}
          />
          <FeatureCard 
            icon={<LineChart className="h-8 w-8" />}
            title="NDVI Vegetation Indices"
            description="Monitor crop health with normalized vegetation index analyses updated weekly."
            image="/images/features/ndvi-analysis.jpg"
            index={2}
          />
          <FeatureCard 
            icon={<Map className="h-8 w-8" />}
            title="Field Management"
            description="Easily create and manage your fields with our intuitive and accurate mapping system."
            image="/images/features/field-management.jpg"
            index={3}
          />
          <FeatureCard 
            icon={<Layers className="h-8 w-8" />}
            title="Soil Analysis"
            description="Get detailed data on the composition and moisture of your soils to optimize your crops."
            image="/images/features/soil-analysis.jpg"
            index={4}
          />
          <FeatureCard 
            icon={<BarChart3 className="h-8 w-8" />}
            title="Custom Dashboards"
            description="Visualize all your critical data on a dashboard tailored to your specific needs."
            image="/images/features/dashboard.jpg"
            index={5}
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <Button 
            className="bg-white text-black hover:bg-gray-200 py-6 px-8 text-lg"
          >
            Explore all features
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  image: string;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, image, index }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="border border-neutral-800 bg-neutral-900/50 rounded-lg overflow-hidden hover:border-primary/30 hover:shadow-glow-sm transition-all duration-300"
    >
      <div className="h-48 relative overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute top-4 left-4 bg-primary/80 backdrop-blur-sm p-2 rounded-lg text-white">
          {icon}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-medium text-white mb-3">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </motion.div>
  );
};

export default Features;
