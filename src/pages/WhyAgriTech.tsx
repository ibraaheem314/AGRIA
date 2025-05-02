import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Shield, Brain, BarChart2, Calculator, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';

const benefits = [
  {
    icon: <Leaf className="h-8 w-8" />,
    title: "Sustainable Agriculture",
    description: "Reduce your carbon footprint through optimized and precise farming practices.",
    image: "/images/why/sustainable.jpg",
    color: "from-green-500/20 to-green-700/20"
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Security and Transparency",
    description: "Your data is encrypted and securely stored, available for your certifications.",
    image: "/images/why/security.jpg",
    color: "from-blue-500/20 to-blue-700/20"
  },
  {
    icon: <Brain className="h-8 w-8" />,
    title: "Advanced Predictions",
    description: "Anticipate risks and opportunities with our predictive artificial intelligence.",
    image: "/images/why/ai.jpg",
    color: "from-purple-500/20 to-purple-700/20"
  },
  {
    icon: <BarChart2 className="h-8 w-8" />,
    title: "Resource Optimization",
    description: "Irrigation, fertilizers, treatments - reduce your costs while optimizing your yields.",
    image: "/images/why/optimization.jpg",
    color: "from-amber-500/20 to-amber-700/20"
  }
];

const WhyAgriTech = () => {
  return (
    <div className="py-20 border-b border-neutral-800 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-[120px] z-0"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 flex flex-col md:flex-row items-center gap-12"
        >
          <div className="md:w-1/2">
            <div className="text-amber-500 mb-4">OUR MISSION</div>
            <h2 className="text-4xl md:text-5xl font-light mb-6">
              Why Choose AgriTech?
            </h2>
            <p className="text-xl text-gray-400">
              Our platform uses the latest technologies in artificial intelligence and satellite imagery to revolutionize your farming methods and operations.
            </p>
          </div>
          <div className="md:w-1/2 h-80 relative">
            <motion.img 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              src="/images/why/agriculture-tech.jpg" 
              alt="Agriculture Technology" 
              className="w-full h-full object-cover rounded-lg shadow-glow-sm"
            />
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute -bottom-6 -right-6 bg-dark/80 backdrop-blur-sm border border-primary/30 p-4 rounded-lg max-w-xs"
            >
              <div className="flex gap-3 items-center mb-2">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Leaf className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-medium text-white">Positive Impact</h3>
              </div>
              <p className="text-sm text-gray-300">Our users have reduced water usage by 30% on average while increasing yields by 22%</p>
            </motion.div>
          </div>
        </motion.div>
      
        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
          {benefits.map((benefit, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="border border-neutral-800 bg-neutral-900/50 rounded-lg overflow-hidden hover:border-primary/30 hover:shadow-glow-sm transition-all duration-300"
            >
              <div className="h-48 relative overflow-hidden">
                <img 
                  src={benefit.image} 
                  alt={benefit.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                <div className="absolute top-4 left-4 bg-gradient-to-br border border-white/10 p-3 rounded-lg backdrop-blur-sm">
                  <span className="text-white">{benefit.icon}</span>
                </div>
              </div>
              <div className="p-6 bg-gradient-to-b bg-opacity-30 h-44 flex flex-col">
                <h3 className="text-xl font-medium text-white mb-3">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
                <div className="mt-auto pt-4">
                  <button className="text-primary flex items-center text-sm hover:underline">
                    Learn more <ArrowRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-gray-900 to-black p-10 md:p-16 rounded-lg text-center mb-20 border border-white/5 shadow-glow-sm relative overflow-hidden"
        >
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <img 
              src="/images/why/pattern-bg.jpg" 
              alt="Background pattern" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="relative z-10">
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
        </motion.div>

        {/* Impact Calculator */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-5 border border-neutral-800 rounded-lg overflow-hidden shadow-glow-sm"
        >
          <div className="bg-neutral-900/50 p-10 md:p-16 md:col-span-3">
            <div className="text-amber-500 mb-4">POTENTIAL IMPACT</div>
            <h2 className="text-4xl font-light mb-6">
              Measure Your Impact
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Our impact calculator allows you to estimate the economic and environmental benefits you could achieve by adopting AgriTech.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Reduction in water consumption",
                "Optimization of fertilizer use",
                "Increase in crop yields",
                "Reduction in carbon emissions"
              ].map((item, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.1 * i }}
                  className="flex items-center"
                >
                  <div className="h-2 w-2 bg-primary rounded-full mr-3"></div>
                  <span className="text-gray-300">{item}</span>
                </motion.li>
              ))}
            </ul>
            <Button 
              className="bg-white text-black hover:bg-gray-200 py-6 px-8 text-lg"
            >
              Calculate my impact
              <Calculator className="ml-2" size={16} />
            </Button>
          </div>
          <div className="hidden md:block md:col-span-2 relative">
            <img 
              src="/images/why/impact-calculator.jpg" 
              alt="Impact Calculator" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WhyAgriTech;
