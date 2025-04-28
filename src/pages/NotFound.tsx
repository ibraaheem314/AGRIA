import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <section className="min-h-screen bg-[#0B0F0E] text-white flex flex-col justify-center items-center px-6">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-6xl font-extrabold text-primary mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">Page introuvable</h2>
        <p className="text-gray-400 mb-8">
          Oups ! La page que vous cherchez n'existe pas ou a été déplacée.
        </p>

        <Link to="/">
          <Button variant="primary" size="lg">
            Retour à l'accueil
          </Button>
        </Link>
      </motion.div>
    </section>
  );
};

export default NotFound;
