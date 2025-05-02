import React, { useState } from 'react';
import { 
  Activity, Users, Cloud, 
  Droplets, Leaf, MapPin, RefreshCw,
  Code, Terminal, Server, Calendar,
  Shovel, Sun, Tractor, Sprout, PackageCheck
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import DataCard from '../components/ui/DataCard';

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

  // Widgets disponibles à afficher sur le dashboard
  const availableWidgets = [
    { id: 'weather', name: 'Météo locale', icon: <Cloud size={16} /> },
    { id: 'soil', name: 'Analyse de sol', icon: <Droplets size={16} /> },
    { id: 'tasks', name: 'Tâches à venir', icon: <Shovel size={16} /> },
    { id: 'calendar', name: 'Calendrier', icon: <Calendar size={16} /> },
    { id: 'market', name: 'Prix du marché', icon: <Activity size={16} /> },
    { id: 'equipment', name: 'Statut matériel', icon: <Tractor size={16} /> },
  ];

  const CodeSnippet = () => (
    <div className="bg-code-bg rounded-md overflow-hidden text-sm font-mono">
      <div className="flex items-center justify-between px-4 py-2 bg-neutral-900 border-b border-neutral-800">
        <div className="text-white font-semibold">monitor.js</div>
        <div className="flex space-x-2">
          <button className="text-text-tertiary hover:text-white transition-colors">
            <Terminal size={14} />
          </button>
          <button className="text-text-tertiary hover:text-white transition-colors">
            <Code size={14} />
          </button>
        </div>
      </div>
      <div className="p-4">
        <pre className="text-code">
          <code>
            <span className="text-blue-400">const</span> <span className="text-yellow-300">monitor</span> = <span className="text-purple-400">require</span>(<span className="text-green-300">'agritech-monitor'</span>);{'\n\n'}
            <span className="text-blue-400">const</span> <span className="text-yellow-300">farm</span> = <span className="text-blue-400">new</span> monitor.Farm{'{'}
            {'\n  '}name: <span className="text-green-300">'Main Farm'</span>,
            {'\n  '}location: <span className="text-orange-300">[48.8566, 2.3522]</span>,
            {'\n  '}sensors: <span className="text-orange-300">['moisture', 'temperature']</span>
            {'\n'}{'})'};{'\n\n'}
            farm.<span className="text-yellow-300">on</span>(<span className="text-green-300">'data'</span>, <span className="text-purple-400">data</span> {'=>'} {'{'}
            {'\n  '}console.<span className="text-yellow-300">log</span>(<span className="text-green-300">`Temperature: </span>${'{'}data.temperature{'}'}°C<span className="text-green-300">`</span>);
            {'\n  '}console.<span className="text-yellow-300">log</span>(<span className="text-green-300">`Soil moisture: </span>${'{'}data.moisture{'}'}%<span className="text-green-300">`</span>);
            {'\n'}{'})'};{'\n\n'}
            farm.<span className="text-yellow-300">connect</span>();
          </code>
        </pre>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header avec bannière de saison */}
      <div className="bg-neutral-900/70 backdrop-blur-sm border border-soil-light/20 rounded-xl p-4 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-1 bg-season-autumn opacity-70"></div>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-medium text-white">Tableau de bord</h1>
            <p className="text-text-secondary mt-1">
              <span className="text-season-autumn font-medium">Saison: {currentSeason}</span> · Vue d'ensemble de vos activités maraîchères
            </p>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              size="sm"
              className="border-soil-light/30 hover:border-primary"
            >
              Personnaliser
            </Button>
            <Button 
              variant="primary" 
              size="sm" 
              onClick={refreshData}
              loading={isLoading}
              icon={<RefreshCw size={16} />}
            >
              Rafraîchir
            </Button>
          </div>
        </div>
      </div>
      
      {/* Key Metrics */}
      <section className="mb-8">
        <h2 className="text-lg font-medium mb-4 flex items-center">
          <Leaf size={18} className="mr-2 text-season-autumn" />
          <span>Indicateurs de la saison</span>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DataCard
            title="Santé des cultures"
            value="88%"
            icon={<Sprout size={18} />}
            color="success"
            loading={isLoading}
            trend={{ value: -4, isPositive: false, label: "vs semaine dernière" }}
            description="5 cultures d'automne en cours"
          />
          
          <DataCard
            title="Précipitations"
            value="32mm"
            icon={<Cloud size={18} />}
            color="info"
            loading={isLoading}
            trend={{ value: 8, isPositive: true, label: "vs moyenne" }}
            description="Conditions favorables pour l'automne"
          />
          
          <DataCard
            title="Température moyenne"
            value="12°C"
            icon={<Sun size={18} />}
            color="warning"
            loading={isLoading}
            trend={{ value: -3, isPositive: false, label: "vs semaine dernière" }}
            description="Prévision: baisse à 8°C cette semaine"
          />
          
          <DataCard
            title="Humidité du sol"
            value="52%"
            icon={<Droplets size={18} />}
            color="primary"
            loading={isLoading}
            trend={{ value: 10, isPositive: true }}
            description="Plage optimale: 45-60% pour l'automne"
          />
        </div>
      </section>

      {/* Current Crops */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium flex items-center">
            <Sprout size={18} className="mr-2 text-season-autumn" />
            <span>Cultures en cours</span>
          </h2>
          <Button 
            variant="outline" 
            size="xs" 
            className="border-soil-light/20 hover:border-soil-light/50"
          >
            Voir toutes les cultures
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2 p-4 border border-soil-light/20 bg-neutral-900/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">État des cultures saisonnières</h3>
              <div className="bg-season-autumn/10 border border-season-autumn/20 px-3 py-1 rounded-full text-xs font-medium text-season-autumn">
                {currentSeason} 2023
              </div>
            </div>
            
            <div className="space-y-3">
              {seasonalCrops.map((crop, i) => (
                <div 
                  key={i} 
                  className="flex items-center p-3 border border-soil-light/20 rounded-md bg-soil-dark/10 hover:border-season-autumn/40 hover:bg-soil-dark/20 transition-all duration-200"
                >
                  <div className={`
                    w-2 h-2 rounded-full flex-shrink-0
                    ${crop.health > 90 ? 'bg-green-500' : crop.health > 80 ? 'bg-yellow-500' : 'bg-red-500'}
                  `}></div>
                  <div className="ml-3 mr-auto">
                    <div className="text-sm font-medium">{crop.name}</div>
                    <div className="text-xs text-text-tertiary">{crop.status}</div>
                  </div>
                  <div className="flex-shrink-0 text-text-tertiary mr-4">
                    {crop.icon}
                  </div>
                  <div className="text-sm font-medium">
                    {crop.health}%
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          {/* Tasks List */}
          <Card className="p-4 border border-soil-light/20 bg-neutral-900/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Tâches à venir</h3>
              <Button variant="outline" size="xs">Voir toutes</Button>
            </div>
            
            <div className="space-y-2">
              {[
                { title: 'Récolte potimarrons', icon: <Shovel size={14} />, date: "Aujourd'hui", priority: 'high' },
                { title: 'Protection contre le gel', icon: <Sun size={14} />, date: "Demain", priority: 'high' },
                { title: 'Préparation du compost', icon: <Leaf size={14} />, date: "Jeudi", priority: 'medium' },
                { title: 'Marché local', icon: <Users size={14} />, date: "Samedi", priority: 'medium' },
              ].map((task, i) => (
                <div 
                  key={i} 
                  className="flex items-center p-2 border border-soil-light/20 rounded-md bg-soil-dark/10 hover:border-soil-light/40 hover:bg-soil-dark/20 transition-all duration-200"
                >
                  <div className={`
                    w-2 h-2 rounded-full flex-shrink-0
                    ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}
                  `}></div>
                  <div className="ml-3 mr-auto">
                    <div className="text-sm font-medium">{task.title}</div>
                    <div className="text-xs text-text-tertiary">{task.date}</div>
                  </div>
                  <div className="flex-shrink-0 text-text-tertiary">
                    {task.icon}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Seasonal Calendar */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium flex items-center">
            <Calendar size={18} className="mr-2 text-season-autumn" />
            <span>Calendrier cultural</span>
          </h2>
          <Button 
            variant="outline" 
            size="xs" 
            className="border-soil-light/20 hover:border-soil-light/50"
          >
            Voir calendrier complet
          </Button>
        </div>
        
        <Card className="p-4 border border-soil-light/20 bg-neutral-900/80 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Période actuelle: Fin Octobre - Début Novembre</h3>
            <div className="bg-soil-dark/50 px-3 py-1 rounded-full text-xs">
              Phase: Plantation d'hiver / Récolte d'automne
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-soil-light/20 rounded-md p-3 bg-soil-dark/10">
              <h4 className="text-sm font-medium mb-2 text-season-autumn">À semer maintenant</h4>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center"><Seeds size={12} className="mr-2 text-text-tertiary" /> Fèves</li>
                <li className="flex items-center"><Seeds size={12} className="mr-2 text-text-tertiary" /> Ail</li>
                <li className="flex items-center"><Seeds size={12} className="mr-2 text-text-tertiary" /> Oignons blancs</li>
              </ul>
            </div>
            
            <div className="border border-soil-light/20 rounded-md p-3 bg-soil-dark/10">
              <h4 className="text-sm font-medium mb-2 text-accent">À récolter maintenant</h4>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center"><Leaf size={12} className="mr-2 text-text-tertiary" /> Courges d'hiver</li>
                <li className="flex items-center"><Leaf size={12} className="mr-2 text-text-tertiary" /> Potimarrons</li>
                <li className="flex items-center"><Leaf size={12} className="mr-2 text-text-tertiary" /> Derniers haricots</li>
                <li className="flex items-center"><Leaf size={12} className="mr-2 text-text-tertiary" /> Choux</li>
              </ul>
            </div>
            
            <div className="border border-soil-light/20 rounded-md p-3 bg-soil-dark/10">
              <h4 className="text-sm font-medium mb-2 text-primary">Travaux du moment</h4>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center"><Shovel size={12} className="mr-2 text-text-tertiary" /> Préparer les protections hivernales</li>
                <li className="flex items-center"><Shovel size={12} className="mr-2 text-text-tertiary" /> Nettoyer les parcelles récoltées</li>
                <li className="flex items-center"><Shovel size={12} className="mr-2 text-text-tertiary" /> Apport de compost</li>
              </ul>
            </div>
          </div>
        </Card>
      </section>

      {/* Matériel et équipements */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium flex items-center">
            <Tractor size={18} className="mr-2 text-secondary" />
            <span>Équipements et matériel</span>
          </h2>
          <Button 
            variant="outline" 
            size="xs" 
            className="border-soil-light/20 hover:border-soil-light/50"
          >
            Gérer le matériel
          </Button>
        </div>
        
        <Card className="p-4 border border-soil-light/20 bg-neutral-900/80 backdrop-blur-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="border border-soil-light/20 rounded-md p-3 bg-soil-dark/10 hover:border-secondary/30 transition-all">
              <div className="flex justify-between items-start">
                <h4 className="text-sm font-medium text-secondary">Tracteur</h4>
                <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-500 border border-green-500/20">Actif</span>
              </div>
              <div className="mt-2 text-xs text-text-tertiary">
                Dernière utilisation: 24 octobre
              </div>
              <div className="mt-1 text-xs">Prochain entretien dans 45 jours</div>
            </div>
            
            <div className="border border-soil-light/20 rounded-md p-3 bg-soil-dark/10 hover:border-secondary/30 transition-all">
              <div className="flex justify-between items-start">
                <h4 className="text-sm font-medium text-secondary">Motoculteur</h4>
                <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-500 border border-green-500/20">Actif</span>
              </div>
              <div className="mt-2 text-xs text-text-tertiary">
                Dernière utilisation: 10 octobre
              </div>
              <div className="mt-1 text-xs">Prochain entretien dans 30 jours</div>
            </div>
            
            <div className="border border-soil-light/20 rounded-md p-3 bg-soil-dark/10 hover:border-secondary/30 transition-all">
              <div className="flex justify-between items-start">
                <h4 className="text-sm font-medium text-secondary">Système d'irrigation</h4>
                <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-500 border border-green-500/20">Actif</span>
              </div>
              <div className="mt-2 text-xs text-text-tertiary">
                Dernière utilisation: Aujourd'hui
              </div>
              <div className="mt-1 text-xs">Contrôle planifié dans 7 jours</div>
            </div>
            
            <div className="border border-soil-light/20 rounded-md p-3 bg-soil-dark/10 hover:border-secondary/30 transition-all">
              <div className="flex justify-between items-start">
                <h4 className="text-sm font-medium text-secondary">Semoir</h4>
                <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-500 border border-yellow-500/20">En maintenance</span>
              </div>
              <div className="mt-2 text-xs text-text-tertiary">
                Dernière utilisation: 5 octobre
              </div>
              <div className="mt-1 text-xs">Disponible le 3 novembre</div>
            </div>
          </div>
        </Card>
      </section>

      {/* Location Info */}
      <section>
        <Card className="p-4 border border-soil-light/20 bg-neutral-900/80 backdrop-blur-sm">
          <div className="flex items-center">
            <MapPin className="w-5 h-5 text-season-autumn mr-3" />
            <div>
              <div className="text-sm text-text-tertiary">Emplacement actif</div>
              <div className="font-medium">Ferme maraîchère - Région Île-de-France</div>
            </div>
            <div className="ml-auto flex items-center px-3 py-1 bg-soil-dark/50 rounded-full text-xs">
              <Cloud size={12} className="mr-1" />
              <span>Prévision: Pluie légère demain</span>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default Dashboard;
