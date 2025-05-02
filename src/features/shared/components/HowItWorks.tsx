import React from 'react';
import { MapPin, BarChart, CloudLightning, AlertCircle } from 'lucide-react';
import Button from './ui/Button';

const steps = [
  {
    number: 1,
    title: "Map Your Fields",
    description: "Easily map your fields on our interactive map. Import GeoJSON files or manually trace your plots with precision.",
    icon: <MapPin className="h-8 w-8" />,
  },
  {
    number: 2,
    title: "Configure Your Alerts",
    description: "Set up notification preferences for extreme weather conditions, changes in vegetation indices, or detected anomalies.",
    icon: <AlertCircle className="h-8 w-8" />,
  },
  {
    number: 3,
    title: "Monitor Your Crops",
    description: "Access updated satellite data, NDVI indices and weather forecasts for each plot. Visualize the evolution of your crops over time.",
    icon: <BarChart className="h-8 w-8" />,
  },
  {
    number: 4,
    title: "Receive Targeted Alerts",
    description: "Be informed in real time of weather risks, water stress or other anomalies specifically affecting your plots.",
    icon: <CloudLightning className="h-8 w-8" />,
  }
];

const HowItWorks = () => {
  return (
    <section className="py-20 border-b border-neutral-800">
      <div className="container mx-auto px-4">
        <div className="mb-16">
          <div className="text-amber-500 mb-4">HOW IT WORKS</div>
          <h2 className="text-4xl md:text-5xl font-light mb-6">
            A Simple Approach to Precision Agriculture
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl">
            A simple and effective approach to monitor your crops and optimize your agricultural production.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-black font-medium text-lg mr-3">
                  {step.number}
                </div>
                <div className="h-0.5 flex-grow bg-neutral-800"></div>
              </div>
              
              <div className="border border-neutral-800 bg-neutral-900/50 p-8 rounded-lg h-full">
                <div className="text-white mb-5">
                  {step.icon}
                </div>
                <h3 className="text-xl font-medium text-white mb-3">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
                </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Button 
            className="bg-white text-black hover:bg-gray-200 py-6 px-8 text-lg"
          >
            Get started now
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
