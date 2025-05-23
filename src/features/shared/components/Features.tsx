import React from 'react';
import { Satellite, CloudRain, LineChart, Map, Layers, BarChart3, Droplets, Sun } from 'lucide-react';
import Button from './ui/Button';

const Features = () => {
  return (
    <div className="py-20 border-b border-neutral-800">
      <div className="container mx-auto px-4">
        <div className="mb-16">
          <div className="text-amber-500 mb-4">CORE FEATURES</div>
          <h2 className="text-4xl md:text-5xl font-light mb-6">
            Advanced Solutions for Precision Agriculture
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl">
            Our platform combines satellite imagery, weather data, and advanced analytics to help you make better decisions for your crops.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <FeatureCard 
            icon={<Satellite className="h-8 w-8" />}
            title="High-Resolution Satellite Imagery"
            description="Access the latest satellite images with daily updates and 10m per pixel resolution."
          />
          <FeatureCard 
            icon={<CloudRain className="h-8 w-8" />}
            title="Precise Weather Forecasts"
            description="Hyperlocal forecasts up to 14 days to plan your agricultural activities with confidence."
          />
          <FeatureCard 
            icon={<LineChart className="h-8 w-8" />}
            title="NDVI Vegetation Indices"
            description="Monitor crop health with normalized vegetation index analyses updated weekly."
          />
          <FeatureCard 
            icon={<Map className="h-8 w-8" />}
            title="Field Management"
            description="Easily create and manage your fields with our intuitive and accurate mapping system."
          />
          <FeatureCard 
            icon={<Layers className="h-8 w-8" />}
            title="Soil Analysis"
            description="Get detailed data on the composition and moisture of your soils to optimize your crops."
          />
          <FeatureCard 
            icon={<BarChart3 className="h-8 w-8" />}
            title="Custom Dashboards"
            description="Visualize all your critical data on a dashboard tailored to your specific needs."
          />
        </div>

        <div className="mt-16 text-center">
          <Button 
            className="bg-white text-black hover:bg-gray-200 py-6 px-8 text-lg"
          >
            Explore all features
          </Button>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="border border-neutral-800 bg-neutral-900/50 p-8 rounded-lg">
      <div className="text-white mb-5">
        {icon}
      </div>
      <h3 className="text-xl font-medium text-white mb-3">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
};

export default Features;
