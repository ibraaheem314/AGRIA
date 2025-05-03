import React from 'react';

const Hero = () => {
  return (
    <section className="bg-white py-24 px-4 md:px-0">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Texte à gauche */}
        <div className="flex-1">
          <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold mb-4">
            Plateforme intelligente
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-green-900 mb-6 leading-tight">
            Réinventez votre <span className="text-green-500">agriculture</span> avec la data
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            Découvrez comment l'IA, l'IoT et l'analyse avancée de données peuvent transformer vos pratiques agricoles pour plus de durabilité, de rendement et de sérénité.
          </p>
          <div className="flex gap-4">
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition">
              Démarrer maintenant
            </button>
            <button className="bg-white border border-green-500 text-green-700 font-bold py-3 px-8 rounded-full shadow hover:bg-green-50 transition">
              En savoir plus
            </button>
          </div>
        </div>
        {/* Images à droite */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Remplace le src par une image de ton projet ou laisse le placeholder */}
          <img
            src="/images/hero-agri.jpg"
            alt="Agriculteur connecté"
            className="rounded-3xl shadow-xl w-full object-cover min-h-[250px] bg-gray-100"
          />
          <div className="flex gap-4">
            <img
              src="/images/hero-stats.jpg"
              alt="Statistiques"
              className="rounded-2xl shadow w-1/2 object-cover min-h-[120px] bg-gray-100"
            />
            <img
              src="/images/hero-iot.jpg"
              alt="IoT"
              className="rounded-2xl shadow w-1/2 object-cover min-h-[120px] bg-gray-100"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
