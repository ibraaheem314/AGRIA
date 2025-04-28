import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, Users, Cloud, BarChart2, CircleDollarSign, Droplets, Leaf, 
  MapPin, Sprout, Sun, MoreHorizontal, Plus, Maximize2, RefreshCw, ChevronRight
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import DataCard from '../components/ui/DataCard';
import PageHeader from '../components/ui/PageHeader';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const refreshData = () => {
    setIsLoading(true);
    // Simuler un chargement
    setTimeout(() => setIsLoading(false), 1500);
  };

  // Onglets du dashboard
  const dashboardTabs = [
    { label: 'Vue d\'ensemble', isActive: true, icon: <Activity size={16} /> },
    { label: 'Météo', isActive: false, icon: <Cloud size={16} /> },
    { label: 'Cultures', isActive: false, icon: <Sprout size={16} /> },
    { label: 'Ressources', isActive: false, icon: <Droplets size={16} /> },
    { label: 'Finances', isActive: false, icon: <CircleDollarSign size={16} /> },
  ];

  // Actions du header
  const headerActions = (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={refreshData}
        loading={isLoading}
        icon={<RefreshCw size={16} />}
      >
        Actualiser
      </Button>
      <Button 
        variant="primary" 
        size="sm"
        icon={<Plus size={16} />}
      >
        Nouvelle tâche
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Tableau de bord"
        description="Vue d'ensemble de vos activités agricoles"
        icon={<Activity size={24} />}
        actions={headerActions}
        tabs={dashboardTabs}
        showThemeToggle={true}
        background="gradient"
      />
      
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Section Informations principales */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-text">Indicateurs clés</h2>
            <Button 
              variant="ghost" 
              size="sm"
              icon={<ChevronRight size={16} />}
              iconPosition="right"
            >
              Voir tous les indicateurs
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <DataCard
              title="Score de santé des cultures"
              value="92%"
              icon={<Leaf />}
              color="success"
              loading={isLoading}
              trend={{ value: 4, isPositive: true, label: "vs. semaine dernière" }}
              description="Basé sur l'analyse de 28 parcelles"
            />
            
            <DataCard
              title="Précipitations"
              value="24mm"
              icon={<Cloud />}
              color="info"
              loading={isLoading}
              trend={{ value: -12, isPositive: false, label: "vs. moyenne" }}
              description="Cumul des 7 derniers jours"
            />
            
            <DataCard
              title="Température moyenne"
              value="18°C"
              icon={<Sun />}
              color="warning"
              loading={isLoading}
              description="Prévision: hausse de 3°C demain"
            />
            
            <DataCard
              title="Humidité du sol"
              value="42%"
              icon={<Droplets />}
              color="primary"
              loading={isLoading}
              trend={{ value: 8, isPositive: true }}
              description="Niveau optimal: 45-60%"
            />
          </div>
        </div>

        {/* Section Activités récentes & Tâches */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Graphique de performance */}
          <Card className="lg:col-span-2 p-5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-medium">Performance des cultures</h3>
              <div className="flex gap-2">
                <Button variant="ghost" size="xs" icon={<Maximize2 size={14} />}>
                  Agrandir
                </Button>
                <Button variant="ghost" size="xs" icon={<MoreHorizontal size={14} />}>
                  Options
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="w-8 h-8 border-t-2 border-primary rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="h-64 relative">
                <div className="absolute inset-x-0 bottom-0 h-64 flex items-end">
                  {/* Graphique simplifié */}
                  {[35, 45, 30, 65, 50, 60, 70, 55, 80, 75, 65, 90].map((height, i) => (
                    <div 
                      key={i} 
                      className="flex-1 mx-1 rounded-t-sm bg-primary-600 bg-opacity-80"
                      style={{height: `${height}%`}}
                    ></div>
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary">+23%</div>
                    <div className="text-sm text-text-secondary">Progression annuelle</div>
                  </div>
                </div>
              </div>
            )}
          </Card>
          
          {/* Liste des tâches */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-medium">Tâches à venir</h3>
              <Button 
                variant="ghost" 
                size="xs" 
                icon={<Plus size={14} />}
              >
                Ajouter
              </Button>
            </div>
            
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-12 skeleton-loading rounded"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {[
                  { title: 'Irrigation parcelle A', icon: <Droplets size={14} />, date: "Aujourd'hui", priority: 'high' },
                  { title: 'Inspection des plants', icon: <Sprout size={14} />, date: "Demain", priority: 'medium' },
                  { title: 'Analyse du sol', icon: <Leaf size={14} />, date: "Jeudi", priority: 'medium' },
                  { title: 'Réunion fournisseur', icon: <Users size={14} />, date: "Vendredi", priority: 'low' },
                ].map((task, i) => (
                  <div 
                    key={i} 
                    className="flex items-center p-2 border border-border rounded-lg hover:border-primary/30 hover:bg-surface-2 transition-colors"
                  >
                    <div className={`
                      w-2 h-2 rounded-full flex-shrink-0
                      ${task.priority === 'high' ? 'bg-danger' : task.priority === 'medium' ? 'bg-warning' : 'bg-success'}
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
            )}
            </Card>
          </div>

        {/* Section Météo et Localisation */}
        <div className="mt-8">
          <Card className="p-5 bg-gradient-to-r from-surface via-surface-2 to-surface">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-primary mr-2" />
                <div>
                  <div className="text-sm text-text-secondary">Localisation active</div>
                  <div className="font-medium">Ferme Principale - Région Île-de-France</div>
                </div>
              </div>
              
              <Button 
                variant="outline"
                size="sm"
                icon={<MapPin size={16} />}
              >
                Changer de ferme
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
