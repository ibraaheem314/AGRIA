import React, { useState, useEffect } from 'react';
import { Search, Bookmark, Filter, Book, Calendar, Leaf, ArrowRight, Info, ChevronRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useLocation } from 'react-router-dom';

// Données fictives pour les ressources
const guideArticles = [
  {
    id: 1,
    title: 'Guide complet du maraîchage saisonnier',
    category: 'Guide',
    summary: 'Tout ce que vous devez savoir pour débuter en maraîchage et optimiser vos cultures selon les saisons.',
    readTime: '15 min',
    date: '12 Oct 2023',
    icon: <Book size={18} className="text-green-600" />
  },
  {
    id: 2,
    title: 'Techniques d\'irrigation efficientes',
    category: 'Irrigation',
    summary: 'Les méthodes modernes pour économiser l\'eau tout en garantissant une hydratation optimale de vos cultures.',
    readTime: '8 min',
    date: '5 Nov 2023',
    icon: <Leaf size={18} className="text-green-600" />
  },
  {
    id: 3,
    title: 'Gestion des sols pour cultures biologiques',
    category: 'Sol',
    summary: 'Comment maintenir un sol sain et fertile sans recourir aux produits chimiques.',
    readTime: '12 min',
    date: '20 Oct 2023',
    icon: <Leaf size={18} className="text-green-600" />
  },
  {
    id: 4,
    title: 'Lutte contre les ravageurs naturellement',
    category: 'Protection',
    summary: 'Des méthodes biologiques pour protéger vos cultures contre les nuisibles.',
    readTime: '10 min',
    date: '18 Sept 2023',
    icon: <Info size={18} className="text-green-600" />
  }
];

const calendarItems = [
  {
    id: 1,
    month: 'Janvier',
    season: 'Hiver',
    toSeed: ['Ail (sous abri)', 'Fèves', 'Oignons'],
    toPlant: [],
    toHarvest: ['Choux', 'Poireaux', 'Salsifis'],
    icon: <Calendar size={18} className="text-blue-600" />
  },
  {
    id: 2,
    month: 'Février',
    season: 'Hiver',
    toSeed: ['Carottes (sous abri)', 'Épinards', 'Laitues'],
    toPlant: ['Ail', 'Échalotes'],
    toHarvest: ['Choux', 'Poireaux', 'Endives'],
    icon: <Calendar size={18} className="text-blue-600" />
  },
  {
    id: 3,
    month: 'Mars',
    season: 'Printemps',
    toSeed: ['Betteraves', 'Carottes', 'Navets', 'Pois', 'Radis'],
    toPlant: ['Pommes de terre', 'Oignons'],
    toHarvest: ['Choux', 'Épinards', 'Poireaux'],
    icon: <Calendar size={18} className="text-green-600" />
  },
  {
    id: 10,
    month: 'Octobre',
    season: 'Automne',
    toSeed: ['Épinards', 'Laitues d\'hiver', 'Mâche', 'Navets'],
    toPlant: ['Ail', 'Fraises'],
    toHarvest: ['Betteraves', 'Carottes', 'Choux', 'Courges', 'Poireaux'],
    icon: <Calendar size={18} className="text-amber-600" />
  },
  {
    id: 11,
    month: 'Novembre',
    season: 'Automne',
    toSeed: ['Fèves (sous abri)'],
    toPlant: ['Ail', 'Arbres fruitiers'],
    toHarvest: ['Betteraves', 'Carottes', 'Choux', 'Poireaux'],
    icon: <Calendar size={18} className="text-amber-600" />
  },
  {
    id: 12,
    month: 'Décembre',
    season: 'Hiver',
    toSeed: [],
    toPlant: [],
    toHarvest: ['Choux', 'Poireaux', 'Salsifis'],
    icon: <Calendar size={18} className="text-blue-600" />
  }
];

const Resources = () => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('all');
  
  useEffect(() => {
    // Définir la section active en fonction de l'URL
    if (location.pathname.includes('/guide')) {
      setActiveSection('guide');
    } else if (location.pathname.includes('/calendrier-semis')) {
      setActiveSection('calendar');
    } else {
      setActiveSection('all');
    }
  }, [location]);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-8 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-full h-1 bg-green-600"></div>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-medium text-gray-800">
              {activeSection === 'guide' ? 'Guide du maraîcher' : 
               activeSection === 'calendar' ? 'Calendrier de semis' : 
               'Centre de ressources'}
            </h1>
            <p className="text-gray-500 mt-1">
              {activeSection === 'guide' ? 'Conseils et techniques pour optimiser votre maraîchage' : 
               activeSection === 'calendar' ? 'Planifiez vos semis et récoltes tout au long de l\'année' : 
               'Explorez nos guides, articles et outils pour votre exploitation'}
            </p>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              size="sm"
              className="border-gray-300 hover:border-green-600 text-gray-700"
              icon={<Bookmark size={16} />}
            >
              Favoris
            </Button>
          </div>
        </div>
      </div>

      {/* Filtres de recherche */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <input 
              type="text"
              placeholder="Rechercher des ressources..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <Search size={18} />
            </div>
          </div>

          <div className="flex gap-2">
            <select className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option value="">Toutes catégories</option>
              <option value="irrigation">Irrigation</option>
              <option value="sol">Gestion du sol</option>
              <option value="protection">Protection des cultures</option>
              <option value="biologique">Agriculture biologique</option>
            </select>
            <Button 
              variant="outline" 
              icon={<Filter size={16} />}
              className="border-gray-300 hover:border-green-600 text-gray-700"
            >
              Filtrer
            </Button>
          </div>
        </div>
      </div>

      {/* Section Guide du maraîcher */}
      {(activeSection === 'all' || activeSection === 'guide') && (
        <>
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium flex items-center text-gray-800">
                <Book size={18} className="mr-2 text-green-600" />
                <span>Guide du maraîcher</span>
              </h2>
              {activeSection === 'all' && (
                <Button 
                  variant="outline" 
                  size="xs" 
                  className="border-gray-300 text-gray-700 hover:border-green-600"
                  icon={<ChevronRight size={14} />}
                >
                  Voir tout
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {guideArticles.map(article => (
                <div key={article.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:border-green-200">
                  <div className="flex items-start">
                    <div className="p-2 bg-green-50 rounded-lg mr-3">
                      {article.icon}
                    </div>
                    <div>
                      <span className="text-xs text-green-600 font-medium">{article.category}</span>
                      <h3 className="font-medium text-gray-800 mb-1">{article.title}</h3>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mt-2 line-clamp-2">{article.summary}</p>
                  <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                    <span>{article.date}</span>
                    <span className="flex items-center">
                      <Button 
                        variant="link" 
                        size="xs" 
                        className="text-green-600 hover:text-green-700 p-0"
                      >
                        Lire <ArrowRight size={12} className="ml-1" />
                      </Button>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Section Calendrier de semis */}
      {(activeSection === 'all' || activeSection === 'calendar') && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium flex items-center text-gray-800">
              <Calendar size={18} className="mr-2 text-green-600" />
              <span>Calendrier de semis</span>
            </h2>
            {activeSection === 'all' && (
              <Button 
                variant="outline" 
                size="xs" 
                className="border-gray-300 text-gray-700 hover:border-green-600"
                icon={<ChevronRight size={14} />}
              >
                Voir tout
              </Button>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            {activeSection === 'all' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {calendarItems.filter(item => item.id >= 10).map(month => (
                  <div key={month.id} className="border border-gray-200 rounded-lg p-3 hover:border-green-200 transition-all duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="p-1.5 bg-gray-100 rounded-full mr-2">
                          {month.icon}
                        </div>
                        <h3 className="font-medium text-gray-800">{month.month}</h3>
                      </div>
                      <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-700">{month.season}</span>
                    </div>
                    <div className="text-sm">
                      {month.toSeed.length > 0 && (
                        <div className="mb-1.5">
                          <span className="text-green-600 font-medium text-xs">À semer:</span>
                          <p className="text-gray-700">{month.toSeed.join(', ')}</p>
                        </div>
                      )}
                      {month.toHarvest.length > 0 && (
                        <div>
                          <span className="text-amber-600 font-medium text-xs">À récolter:</span>
                          <p className="text-gray-700">{month.toHarvest.join(', ')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {calendarItems.map(month => (
                  <div key={month.id} className="border border-gray-200 rounded-lg p-3 hover:border-green-200 transition-all duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="p-1.5 bg-gray-100 rounded-full mr-2">
                          {month.icon}
                        </div>
                        <h3 className="font-medium text-gray-800">{month.month}</h3>
                      </div>
                      <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-700">{month.season}</span>
                    </div>
                    <div className="text-sm">
                      {month.toSeed.length > 0 && (
                        <div className="mb-1.5">
                          <span className="text-green-600 font-medium text-xs">À semer:</span>
                          <p className="text-gray-700">{month.toSeed.join(', ')}</p>
                        </div>
                      )}
                      {month.toPlant.length > 0 && (
                        <div className="mb-1.5">
                          <span className="text-blue-600 font-medium text-xs">À planter:</span>
                          <p className="text-gray-700">{month.toPlant.join(', ')}</p>
                        </div>
                      )}
                      {month.toHarvest.length > 0 && (
                        <div>
                          <span className="text-amber-600 font-medium text-xs">À récolter:</span>
                          <p className="text-gray-700">{month.toHarvest.join(', ')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Bannière conseil au bas de la page */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-full h-1 bg-green-600"></div>
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="flex-1">
            <h3 className="text-xl font-medium text-gray-800">Besoin de conseils personnalisés?</h3>
            <p className="text-gray-600 mt-2">
              Consultez notre assistant IA agricole pour des recommandations adaptées à votre exploitation.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button 
              variant="primary" 
              className="bg-green-600 hover:bg-green-700"
            >
              Consulter l'expert
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;