import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { ArrowRight, Leaf, CloudSun, Activity, Droplets, Sun, Cloud, CloudRain } from 'lucide-react';
import Button from './ui/Button';

interface CounterProps {
  from?: number;
  to: number;
  duration?: number;
  delay?: number;
  format?: (value: number) => string;
}

// Counter component with animation
const Counter: React.FC<CounterProps> = ({ from = 0, to, duration = 2, delay = 0, format = (value: number) => value.toString() }) => {
  const count = useMotionValue(from);
  const rounded = useTransform(count, (value: number) => format(Math.round(value)));
  
  useEffect(() => {
    const animation = animate(count, to, { duration, delay });
    return animation.stop;
  }, [count, to, duration, delay]);
  
  return <motion.span>{rounded}</motion.span>;
};

const Hero = () => {
  return (
    <motion.div 
      className="pt-40 pb-28 relative overflow-hidden bg-gradient-to-b from-primary-900 to-primary-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-pattern-dots opacity-20 pointer-events-none"></div>
      
      {/* Water Cycle Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Cloud with rain */}
        <motion.div 
          className="absolute top-[5%] right-[25%]"
          initial={{ y: -20 }}
          animate={{ y: [-20, 0, -20] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="relative">
            <Cloud size={64} className="text-white/40" />
            
            {/* Rain drops */}
            <motion.div 
              className="absolute top-12 left-6"
              animate={{ 
                opacity: [0, 1, 0],
                y: [0, 40, 80]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeIn",
                delay: 0
              }}
            >
              <div className="w-1 h-4 bg-blue-200/50 rounded-full"></div>
            </motion.div>
            
            <motion.div 
              className="absolute top-12 left-12"
              animate={{ 
                opacity: [0, 1, 0],
                y: [0, 45, 90]
              }}
              transition={{ 
                duration: 2.5,
                repeat: Infinity,
                ease: "easeIn",
                delay: 0.5
              }}
            >
              <div className="w-1 h-4 bg-blue-200/50 rounded-full"></div>
            </motion.div>
            
            <motion.div 
              className="absolute top-12 left-18"
              animate={{ 
                opacity: [0, 1, 0],
                y: [0, 35, 70]
              }}
              transition={{ 
                duration: 1.8,
                repeat: Infinity,
                ease: "easeIn",
                delay: 0.8
              }}
            >
              <div className="w-1 h-4 bg-blue-200/50 rounded-full"></div>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Plant with water absorption animation */}
        <div className="absolute bottom-0 left-[15%] opacity-90 hidden lg:block">
          {/* Plant */}
          <motion.div 
            className="relative"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <img src="/images/plant1.png" alt="Plant illustration" className="w-48 h-48 object-contain" />
            
            {/* Water absorption particles */}
            <motion.div
              className="absolute bottom-10 left-12 w-20 h-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {[...Array(8)].map((_, index) => (
                <motion.div
                  key={index}
                  className="absolute w-2 h-2 rounded-full bg-blue-200/30"
                  initial={{ 
                    x: Math.random() * 20 - 10,
                    y: 40,
                    opacity: 0
                  }}
                  animate={{ 
                    y: [40, 0],
                    opacity: [0, 0.8, 0],
                    scale: [1, 0.5]
                  }}
                  transition={{
                    duration: 3 + Math.random(),
                    repeat: Infinity,
                    delay: index * 0.5,
                    ease: "easeOut"
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Floating circles */}
      <div className="absolute left-0 right-0 top-0 bottom-0 overflow-hidden">
        <motion.div 
          className="absolute top-[15%] left-[10%] w-24 h-24 rounded-full bg-primary-700/30 blur-xl"
          animate={{ 
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute top-[35%] right-[15%] w-32 h-32 rounded-full bg-primary-600/20 blur-xl"
          animate={{ 
            y: [0, -40, 0],
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div 
          className="absolute bottom-[20%] left-[20%] w-48 h-48 rounded-full bg-primary-800/30 blur-xl"
          animate={{ 
            y: [0, 50, 0],
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>
      
      {/* Animated grain texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('/images/grain.png')] pointer-events-none"></div>
      
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary-800 rounded-bl-[100px] opacity-50 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-primary-700 rounded-tr-[100px] opacity-30 blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div 
          className="max-w-5xl mx-auto text-center"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="inline-block bg-primary-50/20 text-primary-50 px-4 py-1 rounded-full text-sm font-medium mb-8 border border-primary-600/30">
            AGRICULTURAL INTELLIGENCE
          </div>
          
          <h1 className="text-5xl md:text-7xl font-light mb-8 leading-tight text-white">
            Satellite and Weather Data for Precision Farming
          </h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Our platform combines satellite imagery, weather data, and AI analytics to provide actionable insights for smarter agricultural decisions.
          </motion.p>
          
          <div className="flex flex-wrap gap-6 justify-center">
            <Button
                className="bg-white hover:bg-gray-100 text-primary-700 py-6 px-8 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
                Get started
                <ArrowRight className="ml-2" size={16} />
            </Button>
            <Button
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 py-6 px-8 text-lg"
            >
                Request a demo
            </Button>
          </div>
        </motion.div>
        
        {/* Floating graphic elements - Enhanced */}
        <div className="absolute -top-4 -left-10 opacity-80 hidden lg:block">
          <motion.div 
            initial={{ y: 0, rotate: 0 }}
            animate={{ y: [-12, 8, -12], rotate: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          >
            <img src="/images/plant1.png" alt="Plant illustration" className="w-40 h-40 object-contain" />
          </motion.div>
        </div>
        
        <div className="absolute top-40 -right-12 opacity-80 hidden lg:block">
          <motion.div 
            initial={{ y: 0 }}
            animate={{ y: [8, -12, 8], rotate: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }}
          >
            <img src="/images/plant2.png" alt="Plant illustration" className="w-48 h-48 object-contain" />
          </motion.div>
        </div>
        
        <div className="absolute top-1/3 left-10 opacity-70 hidden lg:block">
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.05, 1], rotate: [0, 3, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          >
            <CloudSun size={48} className="text-gray-200" />
          </motion.div>
        </div>
        
        <div className="absolute bottom-1/3 right-10 opacity-70 hidden lg:block">
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 1], rotate: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
          >
            <Droplets size={40} className="text-primary-300" />
          </motion.div>
        </div>
        
        <div className="absolute bottom-1/4 left-1/5 opacity-60 hidden lg:block">
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.08, 1], rotate: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          >
            <Sun size={36} className="text-yellow-200" />
          </motion.div>
        </div>
      </div>
      
      {/* Satellite image band */}
      <div className="relative mt-20 overflow-hidden h-32 mx-auto max-w-6xl opacity-90">
        <motion.div 
          className="flex absolute left-0 top-0 h-full"
          animate={{ x: [0, -1920, 0] }}
          transition={{ 
            duration: 120, 
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <img src="/images/satellite1.jpg" alt="Satellite view" className="h-full object-cover rounded-xl" />
          <img src="/images/satellite2.jpg" alt="Satellite view" className="h-full object-cover rounded-xl ml-4" />
          <img src="/images/satellite3.jpg" alt="Satellite view" className="h-full object-cover rounded-xl ml-4" />
          <img src="/images/satellite1.jpg" alt="Satellite view" className="h-full object-cover rounded-xl ml-4" />
        </motion.div>
      </div>
      
      {/* Key Metrics Section */}
      <motion.div 
        className="container mx-auto px-4 mt-12 relative z-10"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <motion.div 
            className="bg-white/10 backdrop-blur-sm p-6 flex items-start space-x-4 rounded-xl border border-white/10"
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="bg-primary-700 p-3 rounded-xl">
              <Activity size={24} className="text-white" />
            </div>
            <div>
              <div className="text-5xl font-light mb-2 text-white">
                <Counter to={82} delay={0.8} format={(value) => `${value}%`} />
              </div>
              <div className="text-gray-200">Increased Accuracy</div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white/10 backdrop-blur-sm p-6 flex items-start space-x-4 rounded-xl border border-white/10"
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="bg-primary-700 p-3 rounded-xl">
              <Activity size={24} className="text-white" />
            </div>
            <div>
              <div className="text-5xl font-light mb-2 text-white">
                <Counter to={30} delay={1} format={(value) => `${value}%`} />
              </div>
              <div className="text-gray-200">Resource Optimization</div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white/10 backdrop-blur-sm p-6 flex items-start space-x-4 rounded-xl border border-white/10"
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="bg-primary-700 p-3 rounded-xl">
              <Activity size={24} className="text-white" />
            </div>
            <div>
              <div className="text-5xl font-light mb-2 text-white">
                <Counter to={15} delay={1.2} format={(value) => `${value}K+`} />
              </div>
              <div className="text-gray-200">Active Users</div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white/10 backdrop-blur-sm p-6 flex items-start space-x-4 rounded-xl border border-white/10"
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="bg-primary-700 p-3 rounded-xl">
              <Activity size={24} className="text-white" />
            </div>
            <div>
              <div className="text-5xl font-light mb-2 text-white">
                <Counter to={40} delay={1.4} format={(value) => `${value}M`} />
              </div>
              <div className="text-gray-200">Hectares Monitored</div>
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Curved divider - version améliorée */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-white">
        <svg className="absolute -top-16 w-full h-16 text-white fill-current" viewBox="0 0 1440 48">
          <path d="M0,100 L1250,100 L1440,0 C1440,0 1252,24 720,24 C187,24 0,0 0,0 L125,100 Z"></path>
        </svg>
      </div>
    </motion.div>
  );
};

export default Hero;
