import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import WhyAgriTech from '../pages/WhyAgriTech';
import Footer from '../components/Footer';
import Pricing from '../components/Pricing';
import Partner from '../components/Partner';
import Impact from '../components/Impact';
import AIAssistant from '../components/ai/AIAssistant';

const Home = () => {
  // Function to handle smooth scrolling to sections
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80, // Adjustment for navbar
        behavior: 'smooth'
      });
    }
  };

  // Function to handle URL anchors
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash) {
        setTimeout(() => {
          scrollToSection(hash);
        }, 100);
      }
    };

    // Set light theme to match our new design
    document.documentElement.setAttribute('data-theme', 'light');

    // Apply on initial load
    handleHashChange();

    // Listen for URL changes
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <div className="bg-white text-gray-900">
      {/* Content */}
      <motion.div 
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.section 
          id="hero"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Hero />
        </motion.section>

        <section id="features">
          <Features />
        </section>

        <section id="impact">
          <Impact />
        </section>

        <section id="how-it-works" className="relative bg-gray-50">
          <HowItWorks />
        </section>

        <section id="why">
          <WhyAgriTech />
        </section>

        <section id="partners" className="relative bg-gray-50">
          <Partner />
        </section>
        
        <section id="pricing">
          <Pricing />
        </section>

        <Footer />
      </motion.div>

      {/* Back to top button */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ y: -3, boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }}
        className="fixed bottom-10 right-10 bg-white text-green-600 p-3 rounded-full border border-gray-200 shadow-md z-40 hidden lg:flex lg:items-center lg:justify-center transition-all duration-300 hover:bg-green-600 hover:text-white"
      >
        <ChevronUp size={20} />
      </motion.button>

      <AIAssistant />
    </div>
  );
};

export default Home;
