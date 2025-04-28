import React from 'react';
import { motion } from 'framer-motion';

import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import WhyAgriTech from '../pages/WhyAgriTech';
import Footer from '../components/Footer';
import Pricing from '../components/Pricing';
import Partner from '../components/Partner';
import AIAssistant from '../components/ai/AIAssistant';

const Home = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Animated background with hexagonal pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[#0B0F0E]">
        <div className="absolute inset-0 opacity-10 bg-grid-pattern"></div>
        
        {/* Gradient blobs */}
        <motion.div 
          className="absolute -top-20 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/10 filter blur-[120px]"
          initial={{ opacity: 0.3 }}
          animate={{ 
            opacity: [0.4, 0.6, 0.4],
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-secondary/15 filter blur-[140px]"
          initial={{ opacity: 0.2 }}
          animate={{ 
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 w-[450px] h-[450px] rounded-full bg-violet-500/10 filter blur-[130px]"
          initial={{ opacity: 0.2 }}
          animate={{ 
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.15, 1],
          }}
          transition={{ 
            duration: 18,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 5
          }}
        />
      </div>
      
      {/* Content with smooth transitions */}
      <div className="relative z-10">
        <section id="hero">
          <Hero />
        </section>
        
        <section id="features" className="relative">
          <Features />
        </section>
        
        <section id="how-it-works" className="relative">
          <HowItWorks />
        </section>
        
        <section id="why">
          <WhyAgriTech />
        </section>
        
        <section id="partners">
          <Partner />
        </section>
        
        <section id="pricing" className="relative">
          <Pricing />
        </section>
        
        <Footer />
      </div>
      
      <AIAssistant />
    </div>
  );
};

export default Home;
