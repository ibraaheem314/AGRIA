import React, { useRef } from 'react';
import { Satellite, CloudRain, LineChart, Map, Layers, BarChart3, Droplets, Sun } from 'lucide-react';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import Button from './ui/Button';

// Sample data for visualization
const cropYieldData = [
  { month: 'Jan', traditional: 42, optimized: 45 },
  { month: 'Feb', traditional: 40, optimized: 48 },
  { month: 'Mar', traditional: 45, optimized: 56 },
  { month: 'Apr', traditional: 50, optimized: 65 },
  { month: 'May', traditional: 55, optimized: 72 },
  { month: 'Jun', traditional: 60, optimized: 78 },
  { month: 'Jul', traditional: 58, optimized: 82 },
  { month: 'Aug', traditional: 55, optimized: 80 },
  { month: 'Sep', traditional: 50, optimized: 75 },
  { month: 'Oct', traditional: 48, optimized: 70 },
  { month: 'Nov', traditional: 45, optimized: 65 },
  { month: 'Dec', traditional: 43, optimized: 60 },
];

const maxValue = Math.max(...cropYieldData.map(d => Math.max(d.traditional, d.optimized)));

const DataVisualization = () => {
  const chartRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: chartRef,
    offset: ["start end", "end center"]
  });
  
  return (
    <motion.div 
      ref={chartRef}
      className="mt-24 p-8 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="mb-8 text-center">
        <h3 className="text-2xl font-medium text-gray-800 mb-2">Crop Yield Comparison</h3>
        <p className="text-gray-600">Traditional farming vs. AgriTech-optimized farming (bushels/acre)</p>
      </div>
      
      <div className="relative h-80">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-sm text-gray-500">
          <div>80</div>
          <div>60</div>
          <div>40</div>
          <div>20</div>
          <div>0</div>
        </div>
        
        {/* Chart area */}
        <div className="absolute left-12 right-0 top-0 bottom-6 border-l border-b border-gray-200">
          {/* Horizontal grid lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <div 
              key={i}
              className="absolute left-0 right-0 border-t border-gray-100"
              style={{ top: `${i * 25}%` }}
            ></div>
          ))}
          
          {/* Data visualization */}
          <div className="absolute inset-0 flex items-end">
            {cropYieldData.map((data, index) => {
              const barWidth = `calc(${100 / cropYieldData.length}% - 8px)`;
              
              return (
                <div 
                  key={index}
                  className="flex flex-col items-center mx-1 relative group"
                  style={{ width: barWidth }}
                >
                  {/* Traditional farming bar */}
                  <motion.div 
                    className="w-full bg-gray-300 rounded-t-sm relative z-10"
                    initial={{ height: 0 }}
                    whileInView={{ 
                      height: `${(data.traditional / maxValue) * 100}%`
                    }}
                    transition={{ 
                      duration: 1,
                      delay: index * 0.05,
                      ease: "easeOut"
                    }}
                    viewport={{ once: true }}
                  >
                    {/* Tooltip */}
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Traditional: {data.traditional}
                    </div>
                  </motion.div>
                  
                  {/* AgriTech optimized bar */}
                  <motion.div 
                    className="w-full bg-primary-500 rounded-t-sm absolute bottom-0"
                    initial={{ height: 0 }}
                    whileInView={{ 
                      height: `${(data.optimized / maxValue) * 100}%`
                    }}
                    transition={{ 
                      duration: 1,
                      delay: 0.5 + index * 0.05,
                      ease: "easeOut"
                    }}
                    viewport={{ once: true }}
                  >
                    {/* Tooltip */}
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-primary-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Optimized: {data.optimized}
                    </div>
                  </motion.div>
                  
                  {/* Month label */}
                  <div className="absolute bottom-[-24px] text-xs text-gray-500">
                    {data.month}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-10 flex items-center justify-center space-x-8">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-primary-500 rounded mr-2"></div>
          <span className="text-sm text-gray-700">AgriTech Optimized</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
          <span className="text-sm text-gray-700">Traditional Farming</span>
        </div>
      </div>
    </motion.div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'primary' | 'secondary';
  variants: Variants;
}

const Features = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  // Parallax values for different elements
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const titleY = useTransform(scrollYProgress, [0, 0.5], ['-10%', '0%']);
  const cardsY = useTransform(scrollYProgress, [0.1, 0.6], ['-5%', '0%']);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="py-24 bg-white relative overflow-hidden" ref={containerRef}>
      {/* Top curved divider */}
      <div className="absolute top-0 left-0 right-0 h-16 overflow-hidden">
        {/* Cette section est déjà couverte par le divider du Hero */}
      </div>
      
      {/* Parallax background patterns */}
      <motion.div 
        className="absolute inset-0 bg-pattern-waves opacity-10 pointer-events-none"
        style={{ y: backgroundY }}
      ></motion.div>
      
      {/* Floating graphic elements for parallax */}
      <motion.div 
        className="absolute -right-20 top-1/3 opacity-30 pointer-events-none"
        style={{ y: useTransform(scrollYProgress, [0, 1], ['50%', '-50%']) }}
      >
        <div className="w-80 h-80 rounded-full bg-primary-100 blur-3xl"></div>
      </motion.div>
      
      <motion.div 
        className="absolute -left-20 bottom-1/3 opacity-20 pointer-events-none"
        style={{ y: useTransform(scrollYProgress, [0, 1], ['20%', '-20%']) }}
      >
        <div className="w-64 h-64 rounded-full bg-primary-200 blur-3xl"></div>
      </motion.div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="mb-20 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          style={{ y: titleY }}
        >
          <div className="inline-block bg-primary-50 text-primary-700 px-4 py-1 rounded-full text-sm font-medium mb-4">CORE FEATURES</div>
          <h2 className="text-4xl md:text-5xl font-light mb-6 text-gray-800">
            Advanced Solutions for Precision Agriculture
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform combines satellite imagery, weather data, and advanced analytics to help you make better decisions for your crops.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          style={{ y: cardsY }}
        >
          <FeatureCard 
            icon={<Satellite className="h-8 w-8" />}
            title="High-Resolution Satellite Imagery"
            description="Access the latest satellite images with daily updates and 10m per pixel resolution."
            color="primary"
            variants={itemVariants}
          />
          <FeatureCard 
            icon={<CloudRain className="h-8 w-8" />}
            title="Precise Weather Forecasts"
            description="Hyperlocal forecasts up to 14 days to plan your agricultural activities with confidence."
            color="secondary"
            variants={itemVariants}
          />
          <FeatureCard 
            icon={<LineChart className="h-8 w-8" />}
            title="NDVI Vegetation Indices"
            description="Monitor crop health with normalized vegetation index analyses updated weekly."
            color="primary"
            variants={itemVariants}
          />
          <FeatureCard 
            icon={<Map className="h-8 w-8" />}
            title="Field Management"
            description="Easily create and manage your fields with our intuitive and accurate mapping system."
            color="secondary"
            variants={itemVariants}
          />
          <FeatureCard 
            icon={<Layers className="h-8 w-8" />}
            title="Soil Analysis"
            description="Get detailed data on the composition and moisture of your soils to optimize your crops."
            color="primary"
            variants={itemVariants}
          />
          <FeatureCard 
            icon={<BarChart3 className="h-8 w-8" />}
            title="Custom Dashboards"
            description="Visualize all your critical data on a dashboard tailored to your specific needs."
            color="secondary"
            variants={itemVariants}
          />
        </motion.div>
        
        {/* Data Visualization Component */}
        <DataVisualization />

        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Button 
            className="bg-primary hover:bg-primary-600 text-white py-6 px-8 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Explore all features
          </Button>
        </motion.div>
      </div>
      
      {/* Bottom curved divider */}
      <div className="absolute bottom-0 left-0 right-0 h-24">
        <svg className="absolute -bottom-1 w-full h-24 text-primary-50 fill-current" viewBox="0 0 1440 96" preserveAspectRatio="none">
          <path d="M0,0 L1440,0 L1440,96 C1120,64 720,48 360,64 C180,72 90,64 0,96 L0,0 Z"></path>
        </svg>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, color, variants }) => {
  const bgClass = color === 'primary' ? 'bg-primary-50' : 'bg-secondary-50';
  const iconClass = color === 'primary' ? 'text-primary-600' : 'text-secondary-600';
  
  return (
    <motion.div 
      className="card-white p-8 relative overflow-hidden group"
      variants={variants}
      whileHover={{ 
        y: -5, 
        boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
        transition: { duration: 0.2 } 
      }}
    >
      {/* Enhanced hover effect */}
      <div className="absolute -right-12 -top-12 w-24 h-24 bg-gradient-to-br from-transparent to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-bl-full"></div>
      <div className="absolute inset-0 bg-white/0 group-hover:bg-primary-50/10 transition-colors duration-300 rounded-lg"></div>
      
      <motion.div 
        className={`${bgClass} w-16 h-16 flex items-center justify-center rounded-xl mb-5`}
        whileHover={{ rotate: [0, -5, 5, 0], transition: { duration: 0.5 } }}
      >
        <div className={iconClass}>
          {icon}
        </div>
      </motion.div>
      <h3 className="text-xl font-medium text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
      
      {/* Interactive indicator */}
      <div className="w-8 h-0.5 bg-gray-200 mt-6 group-hover:w-12 group-hover:bg-primary-500 transition-all duration-300"></div>
    </motion.div>
  );
};

export default Features;
