import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Star, MapPin, Calendar, MessageCircle, Phone, Mail, Clock, Award, ChevronRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

interface Consultant {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  location: string;
  price: string;
  availability: string;
  image: string;
  description: string;
  certifications: string[];
  languages: string[];
  responseTime: string;
}

const mockConsultants: Consultant[] = [
  {
    id: '1',
    name: 'Dr. Marie Dubois',
    specialty: 'Agriculture biologique',
    rating: 4.9,
    reviews: 127,
    location: 'Lyon, France',
    price: '85€/h',
    availability: 'Disponible cette semaine',
    image: '/api/placeholder/150/150',
    description: 'Spécialisée en transition vers l\'agriculture biologique avec 15 ans d\'expérience.',
    certifications: ['Ingénieur Agronome', 'Certification Bio'],
    languages: ['Français', 'Anglais'],
    responseTime: '< 2h'
  },
  {
    id: '2',
    name: 'Pierre Martin',
    specialty: 'Cultures céréalières',
    rating: 4.8,
    reviews: 89,
    location: 'Toulouse, France',
    price: '75€/h',
    availability: 'Disponible demain',
    image: '/api/placeholder/150/150',
    description: 'Expert en optimisation des rendements pour blé, maïs et orge.',
    certifications: ['Master Agriculture', 'Consultant Agro'],
    languages: ['Français'],
    responseTime: '< 4h'
  },
  {
    id: '3',
    name: 'Sophie Leroy',
    specialty: 'Protection des cultures',
    rating: 4.7,
    reviews: 156,
    location: 'Bordeaux, France',
    price: '90€/h',
    availability: 'Disponible dans 2 jours',
    image: '/api/placeholder/150/150',
    description: 'Spécialiste en gestion intégrée des ravageurs et maladies.',
    certifications: ['PhD Phytopathologie', 'Expert IPM'],
    languages: ['Français', 'Anglais', 'Espagnol'],
    responseTime: '< 1h'
  }
];

const specialties = [
  'Tous les domaines',
  'Agriculture biologique',
  'Cultures céréalières',
  'Protection des cultures',
  'Irrigation',
  'Sols et fertilisation',
  'Élevage',
  'Viticulture',
  'Maraîchage'
];

const ConsultantsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('Tous les domaines');
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const filteredConsultants = mockConsultants.filter(consultant => {
    const matchesSearch = consultant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultant.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'Tous les domaines' || 
                            consultant.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const handleBookConsultation = (consultant: Consultant) => {
    setSelectedConsultant(consultant);
    setShowBookingModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto px-6 py-12"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            Consultants <span className="text-orange-600 font-normal">Agricoles</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Trouvez l'expert parfait pour vos besoins agricoles. 
            Conseils personnalisés, solutions adaptées.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom ou spécialité..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
              >
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Consultants Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConsultants.map((consultant, index) => (
            <motion.div
              key={consultant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full p-6 hover:shadow-lg transition-all duration-300">
                <div className="text-center mb-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-semibold text-gray-600">
                      {consultant.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {consultant.name}
                  </h3>
                  <p className="text-orange-600 font-medium text-sm mb-2">
                    {consultant.specialty}
                  </p>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Star size={16} className="text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{consultant.rating}</span>
                    <span className="text-sm text-gray-500">({consultant.reviews} avis)</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={14} />
                    <span>{consultant.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={14} />
                    <span>{consultant.availability}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MessageCircle size={14} />
                    <span>Répond en {consultant.responseTime}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-gray-900">{consultant.price}</span>
                    <span className="text-sm text-gray-500">par heure</span>
                  </div>
                  
                  <Button
                    variant="primary"
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    onClick={() => handleBookConsultation(consultant)}
                  >
                    Réserver une consultation
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredConsultants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Aucun consultant trouvé pour votre recherche.
            </p>
          </div>
        )}
      </motion.div>

      {/* Booking Modal */}
      {showBookingModal && selectedConsultant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-md w-full p-6"
          >
            <h3 className="text-xl font-semibold mb-4">
              Réserver avec {selectedConsultant.name}
            </h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date souhaitée
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heure préférée
                </label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500">
                  <option>09:00</option>
                  <option>10:00</option>
                  <option>11:00</option>
                  <option>14:00</option>
                  <option>15:00</option>
                  <option>16:00</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sujet de consultation
                </label>
                <textarea
                  rows={3}
                  placeholder="Décrivez brièvement votre problématique..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => setShowBookingModal(false)}
              >
                Annuler
              </Button>
              <Button
                variant="primary"
                className="flex-1 bg-orange-600 hover:bg-orange-700"
                onClick={() => {
                  setShowBookingModal(false);
                  // Ici on ajouterait la logique de réservation
                }}
              >
                Confirmer
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ConsultantsPage; 