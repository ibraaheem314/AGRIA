import React, { useState } from 'react';
import { 
  Activity, Users, Cloud, 
  Droplets, Leaf, MapPin, RefreshCw,
  Calendar, Shovel, Sun, Tractor, 
  Sprout, PackageCheck, ChevronRight, 
  AlertTriangle, ArrowUp, ArrowDown
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

// Interface personnalisée pour les composants d'icônes
interface CustomIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

// Composant Seeds personnalisé
const Seeds = ({ size = 24, className, ...props }: CustomIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" />
    <path d="M9 9a3 3 0 0 0 6 0" />
    <path d="M9 15a3 3 0 0 0 6 0" />
    <path d="M12 3v3" />
    <path d="M12 18v3" />
  </svg>
);

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentSeason] = useState('Automne');
  
  const refreshData = () => {
    setIsLoading(true);
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1500);
  };

  const seasonalCrops = [
    { name: 'Potimarron', status: 'Récolte', health: 95, icon: <Leaf size={16} /> },
    { name: 'Courges', status: 'Récolte', health: 92, icon: <Leaf size={16} /> },
    { name: 'Carottes', status: 'Croissance', health: 88, icon: <Seeds size={16} /> },
    { name: 'Poireaux', status: 'Croissance', health: 90, icon: <Seeds size={16} /> },
    { name: 'Choux', status: 'Croissance', health: 85, icon: <Seeds size={16} /> },
  ];

  const upcomingTasks = [
    { title: 'Récolte potimarrons', icon: <Shovel size={14} />, date: "Aujourd'hui", priority: 'high' },
    { title: 'Protection contre le gel', icon: <Sun size={14} />, date: "Demain", priority: 'high' },
    { title: 'Préparation du compost', icon: <Leaf size={14} />, date: "Jeudi", priority: 'medium' },
    { title: 'Marché local', icon: <Users size={14} />, date: "Samedi", priority: 'medium' },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header avec bannière de saison */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-8 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-full h-1 bg-green-600"></div>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-medium text-gray-800">Tableau de bord</h1>
            <p className="text-gray-500 mt-1">
              <span className="text-green-600 font-medium">Saison: {currentSeason}</span> · Vue d'ensemble de vos activités maraîchères
            </p>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              size="sm"
              className="border-gray-300 hover:border-green-600 text-gray-700"
            >
              Personnaliser
            </Button>
            <Button 
              variant="primary" 
              size="sm" 
              onClick={refreshData}
              loading={isLoading}
              className="bg-green-600 hover:bg-green-700"
              icon={<RefreshCw size={16} />}
            >
              Rafraîchir
            </Button>
          </div>
        </div>
      </div>
      
      {/* Indicateurs de la saison */}
      <section className="mb-8">
        <h2 className="text-lg font-medium mb-4 flex items-center text-gray-800">
          <Leaf size={18} className="mr-2 text-green-600" />
          <span>Indicateurs de la saison</span>
        </h2>
          
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Santé des cultures */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <span className="text-gray-600 text-sm">Santé des cultures</span>
              <div className="p-2 bg-green-50 rounded-lg">
                <Sprout size={18} className="text-green-600" />
              </div>
            </div>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-800">88%</span>
            </div>
            <div className="flex items-center mt-1 text-red-500 text-xs">
              <ArrowDown size={14} />
              <span>4% vs semaine dernière</span>
            </div>
            <p className="text-gray-500 text-xs mt-2">5 cultures d'automne en cours</p>
          </div>
          
          {/* Précipitations */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <span className="text-gray-600 text-sm">Précipitations</span>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Cloud size={18} className="text-blue-600" />
              </div>
            </div>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-800">32mm</span>
            </div>
            <div className="flex items-center mt-1 text-green-500 text-xs">
              <ArrowUp size={14} />
              <span>8% vs moyenne</span>
            </div>
            <p className="text-gray-500 text-xs mt-2">Conditions favorables pour l'automne</p>
          </div>
          
          {/* Température */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <span className="text-gray-600 text-sm">Température moyenne</span>
              <div className="p-2 bg-amber-50 rounded-lg">
                <Sun size={18} className="text-amber-600" />
              </div>
            </div>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-800">12°C</span>
            </div>
            <div className="flex items-center mt-1 text-red-500 text-xs">
              <ArrowDown size={14} />
              <span>3% vs semaine dernière</span>
            </div>
            <p className="text-gray-500 text-xs mt-2">Prévision: baisse à 8°C cette semaine</p>
          </div>
          
          {/* Humidité */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <span className="text-gray-600 text-sm">Humidité du sol</span>
              <div className="p-2 bg-green-50 rounded-lg">
                <Droplets size={18} className="text-green-600" />
              </div>
            </div>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-800">52%</span>
            </div>
            <div className="flex items-center mt-1 text-green-500 text-xs">
              <ArrowUp size={14} />
              <span>10%</span>
            </div>
            <p className="text-gray-500 text-xs mt-2">Plage optimale: 45-60% pour l'automne</p>
          </div>
        </div>
      </section>

      {/* Cultures en cours */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium flex items-center text-gray-800">
            <Sprout size={18} className="mr-2 text-green-600" />
            <span>Cultures en cours</span>
          </h2>
          <Button 
            variant="outline" 
            size="xs" 
            className="border-gray-300 text-gray-700 hover:border-green-600"
          >
            Voir toutes les cultures
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-800">État des cultures saisonnières</h3>
              <div className="bg-green-50 border border-green-200 px-3 py-1 rounded-full text-xs font-medium text-green-600">
                {currentSeason} 2023
              </div>
            </div>

            <div className="space-y-3">
              {seasonalCrops.map((crop, i) => (
                <div 
                  key={i} 
                  className="flex items-center p-3 border border-gray-200 rounded-md bg-gray-50 hover:border-green-300 hover:bg-green-50 transition-all duration-200"
                >
                  <div className={`
                    w-2 h-2 rounded-full flex-shrink-0
                    ${crop.health > 90 ? 'bg-green-500' : crop.health > 80 ? 'bg-amber-500' : 'bg-red-500'}
                  `}></div>
                  <div className="ml-3 mr-auto">
                    <div className="text-sm font-medium text-gray-800">{crop.name}</div>
                    <div className="text-xs text-gray-500">{crop.status}</div>
                  </div>
                  <div className="flex-shrink-0 text-green-600 mr-4">
                    {crop.icon}
                  </div>
                  <div className="text-sm font-medium text-gray-800">
                    {crop.health}%
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Tâches à venir */}
          <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-800">Tâches à venir</h3>
              <Button 
                variant="outline" 
                size="xs"
                className="border-gray-300 text-gray-700 hover:border-green-600"
              >
                Voir toutes
              </Button>
            </div>
            
            <div className="space-y-2">
              {upcomingTasks.map((task, i) => (
                <div 
                  key={i} 
                  className="flex items-center p-2 border border-gray-200 rounded-md bg-gray-50 hover:border-green-300 hover:bg-green-50 transition-all duration-200"
                >
                  <div className={`
                    w-2 h-2 rounded-full flex-shrink-0
                    ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-green-500'}
                  `}></div>
                  <div className="ml-3 mr-auto">
                    <div className="text-sm font-medium text-gray-800">{task.title}</div>
                    <div className="text-xs text-gray-500">{task.date}</div>
                  </div>
                  <div className="flex-shrink-0 text-green-600">
                    {task.icon}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Calendrier cultural */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium flex items-center text-gray-800">
            <Calendar size={18} className="mr-2 text-green-600" />
            <span>Calendrier cultural</span>
          </h2>
          <Button 
            variant="outline" 
            size="xs" 
            className="border-gray-300 text-gray-700 hover:border-green-600"
          >
            Voir calendrier complet
          </Button>
        </div>
        
        <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-800">Période actuelle: Fin Octobre - Début Novembre</h3>
            <div className="bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-700">
              Phase: Plantation d'hiver / Récolte d'automne
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
              <h4 className="text-sm font-medium mb-2 text-green-600">À semer maintenant</h4>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center"><Seeds size={12} className="mr-2 text-gray-500" /> Fèves</li>
                <li className="flex items-center"><Seeds size={12} className="mr-2 text-gray-500" /> Ail</li>
                <li className="flex items-center"><Seeds size={12} className="mr-2 text-gray-500" /> Oignons blancs</li>
              </ul>
            </div>
            
            <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
              <h4 className="text-sm font-medium mb-2 text-amber-600">À récolter maintenant</h4>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center"><Leaf size={12} className="mr-2 text-gray-500" /> Courges d'hiver</li>
                <li className="flex items-center"><Leaf size={12} className="mr-2 text-gray-500" /> Potimarrons</li>
                <li className="flex items-center"><Leaf size={12} className="mr-2 text-gray-500" /> Derniers haricots</li>
                <li className="flex items-center"><Leaf size={12} className="mr-2 text-gray-500" /> Choux</li>
              </ul>
            </div>
            
            <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
              <h4 className="text-sm font-medium mb-2 text-blue-600">Travaux du moment</h4>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center"><Shovel size={12} className="mr-2 text-gray-500" /> Préparer les protections hivernales</li>
                <li className="flex items-center"><Shovel size={12} className="mr-2 text-gray-500" /> Nettoyer les parcelles récoltées</li>
                <li className="flex items-center"><Shovel size={12} className="mr-2 text-gray-500" /> Apport de compost</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Matériel et équipements */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium flex items-center text-gray-800">
            <Tractor size={18} className="mr-2 text-green-600" />
            <span>Équipements et matériel</span>
          </h2>
          <Button 
            variant="outline"
            size="xs" 
            className="border-gray-300 text-gray-700 hover:border-green-600"
          >
            Gérer le matériel
          </Button>
        </div>
        
        <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="border border-gray-200 rounded-md p-3 bg-gray-50 hover:border-green-300 hover:bg-green-50 transition-all">
              <div className="flex justify-between items-start">
                <h4 className="text-sm font-medium text-gray-800">Tracteur</h4>
                <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-600 border border-green-200">Actif</span>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Dernière utilisation: 24 octobre
              </div>
              <div className="mt-1 text-xs text-gray-700">Prochain entretien dans 45 jours</div>
            </div>
            
            <div className="border border-gray-200 rounded-md p-3 bg-gray-50 hover:border-green-300 hover:bg-green-50 transition-all">
              <div className="flex justify-between items-start">
                <h4 className="text-sm font-medium text-gray-800">Motoculteur</h4>
                <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-600 border border-green-200">Actif</span>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Dernière utilisation: 10 octobre
              </div>
              <div className="mt-1 text-xs text-gray-700">Prochain entretien dans 30 jours</div>
            </div>
            
            <div className="border border-gray-200 rounded-md p-3 bg-gray-50 hover:border-green-300 hover:bg-green-50 transition-all">
              <div className="flex justify-between items-start">
                <h4 className="text-sm font-medium text-gray-800">Système d'irrigation</h4>
                <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-600 border border-green-200">Actif</span>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Dernière utilisation: Aujourd'hui
              </div>
              <div className="mt-1 text-xs text-gray-700">Contrôle planifié dans 7 jours</div>
            </div>
            
            <div className="border border-gray-200 rounded-md p-3 bg-gray-50 hover:border-green-300 hover:bg-green-50 transition-all">
              <div className="flex justify-between items-start">
                <h4 className="text-sm font-medium text-gray-800">Semoir</h4>
                <span className="px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-600 border border-amber-200">En maintenance</span>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Dernière utilisation: 5 octobre
              </div>
              <div className="mt-1 text-xs text-gray-700">Disponible le 3 novembre</div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Info */}
      <section>
        <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="flex items-center">
            <MapPin className="w-5 h-5 text-green-600 mr-3" />
            <div>
              <div className="text-sm text-gray-500">Emplacement actif</div>
              <div className="font-medium text-gray-800">Ferme maraîchère - Région Île-de-France</div>
            </div>
            <div className="ml-auto flex items-center px-3 py-1 bg-gray-100 rounded-full text-xs">
              <Cloud size={12} className="mr-1 text-blue-600" />
              <span className="text-gray-700">Prévision: Pluie légère demain</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
