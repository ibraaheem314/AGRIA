import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Button from './ui/Button';

const Hero = () => {
  return (
    <div className="pt-32 pb-20 relative border-b border-neutral-800">
      <div className="absolute inset-0 opacity-10 bg-grid-pattern"></div>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-4xl">
            <div className="text-amber-500 mb-4">AGRICULTURAL INTELLIGENCE</div>
            <h1 className="text-5xl md:text-7xl font-light mb-8 leading-tight">
              Satellite and Weather Data for Precision Farming
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mb-12 leading-relaxed">
              Our platform combines satellite imagery, weather data, and AI analytics to provide actionable insights for smarter agricultural decisions.
            </p>
            
            <div className="flex flex-wrap gap-6">
              <Button
                className="bg-white text-black hover:bg-gray-200 py-6 px-8 text-lg"
              >
                Get started
                <ArrowRight className="ml-2" size={16} />
              </Button>
              <Button
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-black py-6 px-8 text-lg"
              >
                Request a demo
              </Button>
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-lg overflow-hidden relative border border-primary/30 shadow-glow-sm">
              <img 
                src="/images/hero-satellite-view.jpg" 
                alt="Satellite view of agricultural fields with data overlay" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-white text-sm">Live satellite data</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-300">Field health index</div>
                    <div className="text-2xl text-white font-light">92.5%</div>
                  </div>
                  <div className="bg-black/50 backdrop-blur-sm py-2 px-4 rounded-full">
                    <div className="text-sm text-green-400">+12% since last month</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-6 -right-6 bg-primary/20 backdrop-blur-sm border border-primary/30 py-2 px-4 rounded-md">
              <div className="text-sm text-white">Updated 2 hours ago</div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Key Metrics Section */}
      <div className="container mx-auto px-4 mt-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="border-l-2 border-amber-500 pl-6">
            <div className="text-5xl font-light mb-4">82%</div>
            <div className="text-gray-400">Increased Accuracy</div>
          </div>
          <div className="border-l-2 border-amber-500 pl-6">
            <div className="text-5xl font-light mb-4">30%</div>
            <div className="text-gray-400">Resource Optimization</div>
          </div>
          <div className="border-l-2 border-amber-500 pl-6">
            <div className="text-5xl font-light mb-4">15K+</div>
            <div className="text-gray-400">Active Users</div>
          </div>
          <div className="border-l-2 border-amber-500 pl-6">
            <div className="text-5xl font-light mb-4">40M</div>
            <div className="text-gray-400">Hectares Monitored</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
