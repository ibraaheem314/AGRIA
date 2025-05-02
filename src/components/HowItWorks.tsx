import React, { useRef } from 'react';
import { MapPin, BarChart, CloudLightning, AlertCircle } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Button from './ui/Button';

interface Step {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: 'primary' | 'secondary';
}

const steps: Step[] = [
  {
    number: 1,
    title: "Map Your Fields",
    description: "Easily map your fields on our interactive map. Import GeoJSON files or manually trace your plots with precision.",
    icon: <MapPin className="h-8 w-8" />,
    color: "primary"
  },
  {
    number: 2,
    title: "Configure Your Alerts",
    description: "Set up notification preferences for extreme weather conditions, changes in vegetation indices, or detected anomalies.",
    icon: <AlertCircle className="h-8 w-8" />,
    color: "secondary"
  },
  {
    number: 3,
    title: "Monitor Your Crops",
    description: "Access updated satellite data, NDVI indices and weather forecasts for each plot. Visualize the evolution of your crops over time.",
    icon: <BarChart className="h-8 w-8" />,
    color: "primary"
  },
  {
    number: 4,
    title: "Receive Targeted Alerts",
    description: "Be informed in real time of weather risks, water stress or other anomalies specifically affecting your plots.",
    icon: <CloudLightning className="h-8 w-8" />,
    color: "secondary"
  }
];

const HowItWorks = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  // Parallax values for different elements
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const titleY = useTransform(scrollYProgress, [0, 0.3], ['-5%', '0%']);
  
  return (
    <section className="py-24 bg-primary-50 relative overflow-hidden" ref={containerRef}>
      {/* Top curved divider */}
      <div className="absolute top-0 left-0 right-0 h-24">
        <svg className="absolute -top-1 w-full h-24 text-white fill-current" viewBox="0 0 1440 96" preserveAspectRatio="none">
          <path d="M0,96 L1440,96 L1440,0 C1120,32 720,16 360,32 C180,40 90,32 0,0 L0,96 Z"></path>
        </svg>
      </div>
      
      {/* Background patterns with parallax */}
      <motion.div 
        className="absolute inset-0 bg-pattern-diagonal opacity-10 pointer-events-none"
        style={{ scale: backgroundScale }}
      ></motion.div>
      
      {/* Enhanced background elements */}
      <motion.div 
        className="absolute top-0 left-0 w-1/3 h-1/4 bg-primary-100 opacity-40 blur-3xl rounded-br-full"
        style={{ 
          y: useTransform(scrollYProgress, [0, 1], ['0%', '10%']),
          x: useTransform(scrollYProgress, [0, 1], ['0%', '5%'])
        }}
      ></motion.div>
      
      <motion.div 
        className="absolute bottom-0 right-0 w-1/4 h-1/4 bg-primary-200 opacity-60 blur-3xl rounded-tl-full"
        style={{ 
          y: useTransform(scrollYProgress, [0, 1], ['0%', '-10%']),
          x: useTransform(scrollYProgress, [0, 1], ['0%', '-5%'])
        }}
      ></motion.div>
      
      <motion.div
        className="absolute top-1/3 right-1/4 w-16 h-16 opacity-30 pointer-events-none"
        style={{ y: useTransform(scrollYProgress, [0, 1], ['20%', '-20%']) }}
      >
        <motion.div 
          className="w-full h-full rounded-full bg-primary-400"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
      
      <motion.div
        className="absolute bottom-1/3 left-1/4 w-12 h-12 opacity-30 pointer-events-none"
        style={{ y: useTransform(scrollYProgress, [0, 1], ['-20%', '20%']) }}
      >
        <motion.div 
          className="w-full h-full rounded-full bg-secondary-400"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 4,
            delay: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
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
          <div className="inline-block bg-white text-primary-700 px-4 py-1 rounded-full text-sm font-medium mb-4 shadow-sm">HOW IT WORKS</div>
          <h2 className="text-4xl md:text-5xl font-light mb-6 text-gray-800">
            A Simple Approach to Precision Agriculture
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A simple and effective approach to monitor your crops and optimize your agricultural production.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              {/* Step number and connecting line */}
              <div className="flex items-center mb-6">
                <motion.div 
                  className={`flex-shrink-0 w-12 h-12 rounded-full bg-${step.color} text-white flex items-center justify-center font-medium text-lg mr-3 shadow-md`}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {step.number}
                </motion.div>
                {index < steps.length - 1 && (
                  <div className="h-0.5 flex-grow bg-gray-200 relative">
                    <motion.div 
                      className={`absolute inset-0 bg-${step.color}-400`}
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                      viewport={{ once: true }}
                    ></motion.div>
                  </div>
                )}
              </div>
              
              {/* Step card with 3D hover effect */}
              <motion.div 
                className="bg-white p-8 h-full rounded-xl shadow-sm border border-gray-100 perspective relative"
                whileHover={{ 
                  rotateX: 5,
                  rotateY: 5,
                  z: 10,
                  boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
                  scale: 1.02
                }}
                transition={{ duration: 0.2 }}
              >
                {/* Highlight effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-primary-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
                
                <motion.div 
                  className={`bg-${step.color}-50 w-16 h-16 flex items-center justify-center rounded-xl mb-5 relative`}
                  whileHover={{ rotate: [0, -5, 5, 0], transition: { duration: 0.5 } }}
                >
                  {/* Animated background pulse effect */}
                  <motion.div 
                    className={`absolute inset-0 bg-${step.color}-100 rounded-xl`}
                    animate={{
                      scale: [1, 1.15, 1],
                      opacity: [0.8, 0.3, 0.8]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  <div className={`text-${step.color}-600 relative z-10`}>
                    {step.icon}
                  </div>
                </motion.div>
                
                <h3 className="text-xl font-medium text-gray-800 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                
                {/* Animated indicator */}
                <motion.div 
                  className={`w-8 h-0.5 bg-${step.color}-200 mt-5`}
                  whileHover={{
                    width: "30%", 
                    backgroundColor: `var(--color-${step.color}-500)`
                  }}
                  transition={{ duration: 0.3 }}
                ></motion.div>
              </motion.div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <Button 
            className="bg-primary hover:bg-primary-600 text-white py-6 px-8 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Get started now
          </Button>
        </motion.div>
      </div>
      
      {/* Bottom curved divider */}
      <div className="absolute bottom-0 left-0 right-0 h-24">
        <svg className="absolute -bottom-1 w-full h-24 text-white fill-current" viewBox="0 0 1440 96" preserveAspectRatio="none">
          <path d="M0,0 L1440,0 L1440,96 C1280,64 1120,48 720,48 C320,48 160,32 0,0 L0,0 Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default HowItWorks;
