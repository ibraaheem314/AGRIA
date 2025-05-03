import React from 'react';
import { Mail, Phone, MapPin, Edit, User, Lock, Bell, Calendar, LayoutGrid } from 'lucide-react';
import Button from '../components/ui/Button';

const Profile = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-8 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-full h-1 bg-green-600"></div>
        <div>
          <h1 className="text-2xl font-medium text-gray-800">Mon compte</h1>
          <p className="text-gray-500 mt-1">Gérez vos informations personnelles et paramètres</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          {/* Profil */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center text-green-600 mb-4 border border-green-200">
                <User size={36} />
              </div>
              <h2 className="text-xl font-medium text-gray-800">Jean Dupont</h2>
              <p className="text-gray-500">Expert Agricole</p>
              
              <div className="w-full mt-6 space-y-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail size={16} className="mr-3 text-green-600" />
                  jean.dupont@example.com
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone size={16} className="mr-3 text-green-600" />
                  +33 6 12 34 56 78
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin size={16} className="mr-3 text-green-600" />
                  123 Rue de l'Agriculture, Paris
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="mt-6 w-full border-gray-300 hover:border-green-600 text-gray-700 hover:bg-green-50 hover:text-green-700"
              >
                <Edit size={16} className="mr-2" />
                Modifier le profil
              </Button>
            </div>
          </div>
          
          {/* Paramètres */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 mt-6 shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Paramètres du compte</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-3 text-left rounded-lg transition-all duration-200 hover:bg-green-50 border border-transparent hover:border-green-200 hover:text-green-700">
                <div className="flex items-center">
                  <User size={18} className="mr-3 text-green-600" />
                  <span className="text-gray-600">Informations personnelles</span>
                </div>
                <span className="text-green-600">›</span>
              </button>
              <button className="w-full flex items-center justify-between p-3 text-left rounded-lg transition-all duration-200 hover:bg-green-50 border border-transparent hover:border-green-200 hover:text-green-700">
                <div className="flex items-center">
                  <Lock size={18} className="mr-3 text-green-600" />
                  <span className="text-gray-600">Sécurité et mot de passe</span>
                </div>
                <span className="text-green-600">›</span>
              </button>
              <button className="w-full flex items-center justify-between p-3 text-left rounded-lg transition-all duration-200 hover:bg-green-50 border border-transparent hover:border-green-200 hover:text-green-700">
                <div className="flex items-center">
                  <Bell size={18} className="mr-3 text-green-600" />
                  <span className="text-gray-600">Notifications</span>
                </div>
                <span className="text-green-600">›</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          {/* Informations d'exploitation */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-6 flex items-center">
              <LayoutGrid size={18} className="mr-2 text-green-600" />
              Informations d'exploitation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="farmName" className="block text-sm font-medium text-gray-600 mb-2">
                  Nom de l'exploitation
                </label>
                <input
                  type="text"
                  id="farmName"
                  value="Ferme de la Vallée Verte"
                  readOnly
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-800 focus:border-green-600 focus:ring-green-600 focus:ring-1 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="farmType" className="block text-sm font-medium text-gray-600 mb-2">
                  Type d'exploitation
                </label>
                <input
                  type="text"
                  id="farmType"
                  value="Polyculture"
                  readOnly
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-800 focus:border-green-600 focus:ring-green-600 focus:ring-1 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="totalArea" className="block text-sm font-medium text-gray-600 mb-2">
                  Surface totale
                </label>
                <input
                  type="text"
                  id="totalArea"
                  value="30,8 hectares"
                  readOnly
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-800 focus:border-green-600 focus:ring-green-600 focus:ring-1 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-600 mb-2">
                  Localisation
                </label>
                <input
                  type="text"
                  id="location"
                  value="Région Île-de-France, France"
                  readOnly
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-800 focus:border-green-600 focus:ring-green-600 focus:ring-1 focus:outline-none"
                />
              </div>
            </div>
            <Button 
              variant="outline" 
              className="mt-6 border-gray-300 hover:border-green-600 text-gray-700 hover:bg-green-50 hover:text-green-700"
            >
              <Edit size={16} className="mr-2" />
              Modifier les informations
            </Button>
          </div>
          
          {/* Abonnement */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-6 flex items-center">
              <Calendar size={18} className="mr-2 text-green-600" />
              Abonnement et forfait
            </h3>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-800">Forfait Professionnel</h4>
                  <p className="text-sm text-gray-600">Votre abonnement se renouvelle le 15 août 2025</p>
                </div>
                <span className="bg-green-100 text-green-700 text-xs font-medium px-2.5 py-1 rounded">Actif</span>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p>Toutes les fonctionnalités incluses avec exploitations et cultures illimitées</p>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-medium text-gray-800 mb-3">Fonctionnalités du forfait actuel</h4>
              <ul className="space-y-3">
                <li className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  Exploitations et cultures illimitées
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  Prévisions météorologiques avancées
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  Analyse du sol et recommandations
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  Support client prioritaire
                </li>
              </ul>
            </div>
            
            <div className="mt-8 flex flex-wrap gap-3">
              <Button 
                variant="primary" 
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Mettre à niveau
              </Button>
              <Button 
                variant="outline" 
                className="border-gray-300 hover:border-green-600 text-gray-700 hover:bg-green-50 hover:text-green-700"
              >
                Gérer l'abonnement
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;