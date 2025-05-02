import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Button from './ui/Button';

const Hero = () => {
  return (
    <div className="pt-32 pb-20 relative border-b border-neutral-800">
      <div className="absolute inset-0 opacity-10 bg-grid-pattern"></div>
      <div className="container mx-auto px-4">
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
