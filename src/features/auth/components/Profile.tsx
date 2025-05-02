import React from 'react';
import { Mail, Phone, MapPin, Edit, User, Lock, Bell, Calendar, LayoutGrid } from 'lucide-react';
import Card from '../../shared/ui/components/Card';
import Button from '../../shared/ui/components/Button';

const Profile = () => {
  return (
    <div className="py-6 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-light text-white mb-2">Mon compte</h1>
        <p className="text-text-secondary">Gérez vos informations personnelles et paramètres</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="p-6 bg-surface/40 border border-primary/10 backdrop-blur-sm shadow-glow-sm">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <User size={36} />
              </div>
              <h2 className="text-xl font-light text-white">Jean Dupont</h2>
              <p className="text-text-secondary">Expert Agricole</p>
              
              <div className="w-full mt-6 space-y-4">
                <div className="flex items-center text-sm text-text-secondary">
                  <Mail size={16} className="mr-3 text-primary" />
                  jean.dupont@example.com
                </div>
                <div className="flex items-center text-sm text-text-secondary">
                  <Phone size={16} className="mr-3 text-primary" />
                  +33 6 12 34 56 78
                </div>
                <div className="flex items-center text-sm text-text-secondary">
                  <MapPin size={16} className="mr-3 text-primary" />
                  123 Rue de l'Agriculture, Paris
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="mt-6 w-full hover:bg-primary/5 border-primary/30 hover:border-primary"
                onClick={() => {}}
              >
                <Edit size={16} className="mr-2" />
                Modifier le profil
              </Button>
            </div>
          </Card>
          
          <Card className="p-6 mt-6 bg-surface/40 border border-primary/10 backdrop-blur-sm shadow-glow-sm">
            <h3 className="text-lg font-light text-white mb-4">Paramètres du compte</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-3 text-left rounded-lg transition-colors hover:bg-primary/5 border border-transparent hover:border-primary/20">
                <div className="flex items-center">
                  <User size={18} className="mr-3 text-primary" />
                  <span className="text-text-secondary">Informations personnelles</span>
                </div>
                <span className="text-primary">›</span>
              </button>
              <button className="w-full flex items-center justify-between p-3 text-left rounded-lg transition-colors hover:bg-primary/5 border border-transparent hover:border-primary/20">
                <div className="flex items-center">
                  <Lock size={18} className="mr-3 text-primary" />
                  <span className="text-text-secondary">Sécurité et mot de passe</span>
                </div>
                <span className="text-primary">›</span>
              </button>
              <button className="w-full flex items-center justify-between p-3 text-left rounded-lg transition-colors hover:bg-primary/5 border border-transparent hover:border-primary/20">
                <div className="flex items-center">
                  <Bell size={18} className="mr-3 text-primary" />
                  <span className="text-text-secondary">Notifications</span>
                </div>
                <span className="text-primary">›</span>
              </button>
            </div>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="p-6 mb-6 bg-surface/40 border border-primary/10 backdrop-blur-sm shadow-glow-sm">
            <h3 className="text-lg font-light text-white mb-6 flex items-center">
              <LayoutGrid size={18} className="mr-2 text-primary" />
              Informations d'exploitation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="farmName" className="block text-sm font-medium text-text-secondary mb-2">
                  Nom de l'exploitation
                </label>
                <input
                  type="text"
                  id="farmName"
                  value="Ferme de la Vallée Verte"
                  readOnly
                  className="w-full px-3 py-2 bg-dark border border-primary/20 rounded-md text-white focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="farmType" className="block text-sm font-medium text-text-secondary mb-2">
                  Type d'exploitation
                </label>
                <input
                  type="text"
                  id="farmType"
                  value="Polyculture"
                  readOnly
                  className="w-full px-3 py-2 bg-dark border border-primary/20 rounded-md text-white focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="totalArea" className="block text-sm font-medium text-text-secondary mb-2">
                  Surface totale
                </label>
                <input
                  type="text"
                  id="totalArea"
                  value="30,8 hectares"
                  readOnly
                  className="w-full px-3 py-2 bg-dark border border-primary/20 rounded-md text-white focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-text-secondary mb-2">
                  Localisation
                </label>
                <input
                  type="text"
                  id="location"
                  value="Région Île-de-France, France"
                  readOnly
                  className="w-full px-3 py-2 bg-dark border border-primary/20 rounded-md text-white focus:border-primary focus:outline-none"
                />
              </div>
            </div>
            <Button 
              variant="outline" 
              className="mt-6 hover:bg-primary/5 border-primary/30 hover:border-primary"
              onClick={() => {}}
            >
              <Edit size={16} className="mr-2" />
              Modifier les informations
            </Button>
          </Card>
          
          <Card className="p-6 bg-surface/40 border border-primary/10 backdrop-blur-sm shadow-glow-sm">
            <h3 className="text-lg font-light text-white mb-6 flex items-center">
              <Calendar size={18} className="mr-2 text-primary" />
              Abonnement et forfait
            </h3>
            
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white">Forfait Professionnel</h4>
                  <p className="text-sm text-text-secondary">Votre abonnement se renouvelle le 15 août 2025</p>
                </div>
                <span className="bg-primary/20 text-primary text-xs font-medium px-2.5 py-1 rounded">Actif</span>
              </div>
              <div className="mt-4 text-sm text-text-secondary">
                <p>Toutes les fonctionnalités incluses avec exploitations et cultures illimitées</p>
              </div>
            </div>
            
            <div className="border-t border-primary/10 pt-4">
              <h4 className="font-medium text-white mb-3">Fonctionnalités du forfait actuel</h4>
              <ul className="space-y-3">
                <li className="flex items-center text-sm text-text-secondary">
                  <svg className="w-4 h-4 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  Exploitations et cultures illimitées
                </li>
                <li className="flex items-center text-sm text-text-secondary">
                  <svg className="w-4 h-4 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  Prévisions météorologiques avancées
                </li>
                <li className="flex items-center text-sm text-text-secondary">
                  <svg className="w-4 h-4 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  Analyse du sol et recommandations
                </li>
                <li className="flex items-center text-sm text-text-secondary">
                  <svg className="w-4 h-4 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  Support client prioritaire
                </li>
              </ul>
            </div>
            
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="primary" className="hover:shadow-glow-primary">Mettre à niveau</Button>
              <Button variant="outline" className="hover:bg-primary/5 border-primary/30 hover:border-primary">Gérer l'abonnement</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;