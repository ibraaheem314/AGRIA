import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Cloud, Database, BarChart } from 'lucide-react';
import Button from '../components/ui/Button';

const Platform = () => {
  return (
    <div className="bg-white text-gray-900">
      {/* Hero Section */}
      <section className="py-28 relative">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern" />
        </div>
        <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-green-900 to-green-700 opacity-10 -z-20" />
        <div className="absolute left-0 top-0 w-[600px] h-[600px] rounded-full border border-green-500/10 opacity-30 -z-10" style={{ transform: 'translate(-300px, -300px)' }} />
        
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="text-green-600 mb-4 font-medium tracking-wider">PLATEFORME</div>
            <h1 className="text-5xl md:text-7xl font-light mb-8 leading-tight text-gray-800">
              Une infrastructure de données pour l'agriculture moderne
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mb-12 leading-relaxed">
              Une infrastructure adaptée à l'ère de l'agriculture de précision—où les données sont non structurées, les calculs sont partout et la confiance se gagne.
            </p>
            <p className="text-lg text-gray-500 max-w-3xl mb-12">
              Les plus grands obstacles à l'adoption de l'IA en agriculture sont les données et le calcul—rares, fragmentés et inaccessibles. AgriTech développe les éléments fondamentaux pour l'avenir des données dans votre ferme.
            </p>
          </div>
        </div>
      </section>

      {/* Key Metrics Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="border-l-2 border-green-600 pl-6">
              <div className="text-5xl font-light mb-4 text-gray-800">24TB</div>
              <div className="text-gray-600">Données d'entraînement</div>
            </div>
            <div className="border-l-2 border-green-600 pl-6">
              <div className="text-5xl font-light mb-4 text-gray-800">+40</div>
              <div className="text-gray-600">Pays actifs</div>
            </div>
            <div className="border-l-2 border-green-600 pl-6">
              <div className="text-5xl font-light mb-4 text-gray-800">500+</div>
              <div className="text-gray-600">Sources de données</div>
            </div>
            <div className="border-l-2 border-green-600 pl-6">
              <div className="text-5xl font-light mb-4 text-gray-800">120M</div>
              <div className="text-gray-600">Hectares analysés</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mb-28">
            <div className="text-green-600 mb-4 font-medium tracking-wider">DONNÉES PRÊTES POUR L'IA</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div>
                <h2 className="text-4xl font-light mb-6 text-gray-800">
                  AgriTech simplifie le parcours des données vers les insights avec une plateforme complète et évolutive.
                </h2>
                <div className="mt-12 inline-block">
                  <Button variant="primary" size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                    Réserver une démo
                    <ArrowRight className="ml-2" size={16} />
                  </Button>
                </div>
              </div>
              <div className="py-12 px-8 bg-white border border-gray-200 rounded-lg shadow-sm">
                <p className="text-lg mb-4 text-gray-800">Réserver une démo</p>
                <p className="text-gray-600 mb-8">
                  Si vous souhaitez explorer notre plateforme et nos solutions, vous pouvez réserver une consultation personnalisée.
                </p>
                <Button variant="primary" className="bg-green-600 hover:bg-green-700 text-white">
                  Réserver maintenant
                  <ArrowRight className="ml-2" size={16} />
                </Button>
              </div>
            </div>
          </div>

          {/* Feature 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-32 items-center">
            <div>
              <div className="text-green-600 mb-4 font-medium tracking-wider flex items-center">
                <Database size={18} className="mr-2" />
                COLLECTER & AGRÉGER
              </div>
              <h3 className="text-3xl font-light mb-4 text-gray-800">
                Collectez et agrégez des données multi-sources,{" "}
                <span className="text-gray-500">et structurez-les pour l'analyse.</span>
              </h3>
              <p className="text-gray-600 mt-6">
                Notre plateforme intègre harmonieusement les images satellites, les données météo, les capteurs IoT et les archives historiques pour créer une vision globale de vos opérations agricoles.
              </p>
            </div>
            <div className="aspect-square bg-white border border-gray-200 rounded-lg relative overflow-hidden shadow-sm">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-6 grid-rows-6 gap-2 opacity-70">
                  {Array(36).fill(0).map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-4 h-4 ${Math.random() > 0.7 ? 'bg-green-100' : 'bg-transparent'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-32 items-center">
            <div className="order-2 md:order-1 aspect-square bg-white border border-gray-200 rounded-lg relative overflow-hidden shadow-sm">
              <div className="absolute inset-0">
                <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
                  {Array(4).fill(0).map((_, i) => (
                    <div 
                      key={i} 
                      className="col-start-1 row-start-1 bg-green-100"
                      style={{
                        gridColumnStart: Math.floor(Math.random() * 6) + 1,
                        gridRowStart: Math.floor(Math.random() * 6) + 1,
                        gridColumnEnd: 'span 2',
                        gridRowEnd: 'span 2'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="text-green-600 mb-4 font-medium tracking-wider flex items-center">
                <Cloud size={18} className="mr-2" />
                VALIDER & CALIBRER
              </div>
              <h3 className="text-3xl font-light mb-4 text-gray-800">
                Alignez les données avec les sources de terrain{" "}
                <span className="text-gray-500">pour garantir précision et fiabilité.</span>
              </h3>
              <p className="text-gray-600 mt-6">
                Nos mécanismes de validation s'assurent que toutes les données sont recoupées avec des références établies, vous offrant des informations précises et fiables pour vos décisions agricoles critiques.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-32 items-center">
            <div>
              <div className="text-green-600 mb-4 font-medium tracking-wider flex items-center">
                <BarChart size={18} className="mr-2" />
                ANALYSES PROPULSÉES PAR L'IA
              </div>
              <h3 className="text-3xl font-light mb-4 text-gray-800">
                Traitez des ensembles de données complexes avec des modèles d'IA personnalisés{" "}
                <span className="text-gray-500">adaptés à votre exploitation.</span>
              </h3>
              <p className="text-gray-600 mt-6">
                Nos modèles d'IA spécialisés peuvent prédire les rendements des cultures, détecter précocement les infestations de ravageurs, optimiser les calendriers d'irrigation et fournir des recommandations spécifiques à vos conditions agricoles.
              </p>
            </div>
            <div className="aspect-square bg-white border border-gray-200 rounded-lg relative overflow-hidden shadow-sm">
              <div className="absolute inset-0 flex items-center justify-center opacity-70">
                <div className="grid grid-cols-10 grid-rows-10 gap-0 w-4/5 h-4/5">
                  {Array(100).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center justify-center text-[8px] text-gray-500">
                      {Math.random() > 0.5 ? 'd' : Math.random() > 0.3 ? '8' : Math.random() > 0.5 ? 'B' : '0'}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 aspect-square bg-white border border-gray-200 rounded-lg relative overflow-hidden shadow-sm">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-1/2 h-1/2 border border-green-200">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 border border-green-200">
                    <div className="text-2xl font-light text-green-600">AGRITECH</div>
                  </div>
                  <div className="absolute top-0 left-0 w-full h-full">
                    {Array(8).fill(0).map((_, i) => (
                      <div 
                        key={i} 
                        className="absolute bg-transparent w-8 h-px bg-green-200"
                        style={{
                          top: '50%',
                          left: '50%',
                          transform: `rotate(${i * 45}deg)`,
                          transformOrigin: 'left center'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="text-green-600 mb-4 font-medium tracking-wider flex items-center">
                <Leaf size={18} className="mr-2" />
                INTÉGRATION API-FIRST
              </div>
              <h3 className="text-3xl font-light mb-4 text-gray-800">
                Intégrez les insights d'AgriTech{" "}
                <span className="text-gray-500">directement dans vos flux de travail et plateformes existantes pour une automatisation fluide.</span>
              </h3>
              <p className="text-gray-600 mt-6">
                Notre conception centrée sur les API vous permet d'intégrer notre intelligence agricole dans votre logiciel de gestion agricole existant, vos applications mobiles ou vos systèmes IoT avec un minimum d'effort de développement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-light mb-8 text-gray-800">Prêt à transformer vos données agricoles ?</h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Contactez notre équipe pour découvrir comment AgriTech peut vous aider à optimiser vos opérations agricoles.
          </p>
          <Button variant="primary" className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg shadow-sm">
            Planifier une consultation
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Platform; 