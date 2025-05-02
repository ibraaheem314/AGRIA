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
import AIAssistant from "./AIAssistant";

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

    // Apply on initial load
    handleHashChange();

    // Listen for URL changes
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <div className="bg-dark text-white">
      {/* Background elements */}
      <div className="fixed inset-0 bg-grid-pattern opacity-5 pointer-events-none z-0"></div>

      {/* Content */}
      <div className="relative z-10">
        <section id="hero">
      <Hero />
        </section>

        <section id="features" className="py-20">
        <Features />
      </section>

        <section id="how-it-works" className="py-20">
        <HowItWorks />
      </section>

        <section id="why" className="py-20">
        <WhyAgriTech />
      </section>

        <section id="partners" className="py-20">
          <Partner />
        </section>
        
        <section id="pricing" className="py-20">
        <Pricing />
      </section>

      <Footer />
      </div>

      {/* Back to top button */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ y: -3, boxShadow: '0 0 15px rgba(130, 90, 195, 0.5)' }}
        className="fixed bottom-10 right-10 bg-primary text-white p-3 rounded-full shadow-glow-sm z-40 hidden lg:flex lg:items-center lg:justify-center transition-all duration-300"
      >
        <ChevronUp size={20} />
      </motion.button>

      <AIAssistant />
    </div>
  );
};

export default Home;
