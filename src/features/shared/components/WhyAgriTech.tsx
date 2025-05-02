import React from 'react';
import { Leaf, Shield, Brain, BarChart2, Calculator, ArrowRight } from 'lucide-react';
import Button from '../../shared/ui/components/Button';

const benefits = [
  {
    icon: <Leaf className="h-8 w-8" />,
    title: "Sustainable Agriculture",
    description: "Reduce your carbon footprint through optimized and precise farming practices."
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Security and Transparency",
    description: "Your data is encrypted and securely stored, available for your certifications."
  },
  {
    icon: <Brain className="h-8 w-8" />,
    title: "Advanced Predictions",
    description: "Anticipate risks and opportunities with our predictive artificial intelligence."
  },
  {
    icon: <BarChart2 className="h-8 w-8" />,
    title: "Resource Optimization",
    description: "Irrigation, fertilizers, treatments - reduce your costs while optimizing your yields."
  }
];

const WhyAgriTech = () => {
  return (
    <div className="py-20 border-b border-neutral-800">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="mb-16">
          <div className="text-amber-500 mb-4">OUR MISSION</div>
          <h2 className="text-4xl md:text-5xl font-light mb-6">
            Why Choose AgriTech?
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl">
            Our platform uses the latest technologies in artificial intelligence and satellite imagery to revolutionize your farming methods and operations.
          </p>
      </div>
      
        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="border border-neutral-800 bg-neutral-900/50 p-8 rounded-lg"
            >
              <div className="text-white mb-5">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-medium text-white mb-3">{benefit.title}</h3>
              <p className="text-gray-400">{benefit.description}</p>
            </div>
          ))}
        </div>
        
        {/* CTA Section */}
        <div className="border border-neutral-800 bg-black p-16 rounded-lg text-center mb-20">
          <h2 className="text-4xl font-light mb-6">
            Ready to Revolutionize Your Agriculture?
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
            Join thousands of farmers who have already transformed their operations with our innovative solutions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Button 
              className="bg-white text-black hover:bg-gray-200 py-6 px-8 text-lg"
            >
              Get started for free
              <ArrowRight className="ml-2" size={16} />
            </Button>
            <Button 
              variant="outline" 
              className="text-white border-white hover:bg-white hover:text-black py-6 px-8 text-lg"
            >
              Watch a demo
            </Button>
          </div>
        </div>

        {/* Impact Calculator */}
        <div className="border border-neutral-800 bg-neutral-900/50 p-16 rounded-lg text-center">
          <div className="text-amber-500 mb-4">POTENTIAL IMPACT</div>
          <h2 className="text-4xl font-light mb-6">
            Measure Your Impact
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">
            Our impact calculator allows you to estimate the economic and environmental benefits you could achieve by adopting AgriTech.
          </p>
          <Button 
            className="bg-white text-black hover:bg-gray-200 py-6 px-8 text-lg"
          >
            Calculate my impact
            <Calculator className="ml-2" size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WhyAgriTech;
