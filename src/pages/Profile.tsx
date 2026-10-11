import React, { useState, useRef } from 'react';
import { User, MapPin, Mail, Edit2, Save, X, Leaf, MessageCircle, Cloud, Calendar, LogOut, Phone, Camera, Award, Tractor, Settings, Bell, Shield, Key, Upload, Download, Trash2, AlertTriangle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeMetric, setActiveMetric] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    // Informations personnelles
    name: user?.name || 'Utilisateur Test',
    email: user?.email || 'test@agria.com',
    phone: '+33 6 12 34 56 78',
    location: 'Île-de-France, France',
    joinDate: 'Septembre 2024',
    profileImage: null as File | null,
    
    // Informations exploitation
    farmType: 'Agriculture durable',
    farmSize: '25 hectares',
    mainCrops: ['Blé', 'Maïs', 'Tournesol'],
    certifications: ['Agriculture Biologique', 'HVE Niveau 3'],
    equipment: ['Tracteur John Deere', 'Moissonneuse', 'Système irrigation'],
    employees: '3 employés saisonniers',
    
    // Données agricoles avancées
    harvestHistory: [
      { year: 2023, crop: 'Blé', yield: '8.2 t/ha', quality: 'Premium' },
      { year: 2023, crop: 'Maïs', yield: '12.5 t/ha', quality: 'Standard' }
    ],
    suppliers: [
      { name: 'SemPro Agriculture', type: 'Semences', contact: '+33 1 23 45 67 89' },
      { name: 'AgroChimie France', type: 'Phytosanitaires', contact: '+33 2 34 56 78 90' }
    ],
    
    // Préférences
    notifications: {
      weather: true,
      alerts: true,
      reports: false,
      marketing: false
    },
    units: {
      temperature: 'celsius',
      distance: 'metric'
    },
    
    // Sécurité
    twoFactorEnabled: false,
    lastPasswordChange: '15 novembre 2024'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSave = async () => {
    setLoading(true);
    setErrors({});
    
    // Validation
    const newErrors: {[key: string]: string} = {};
    if (!formData.name.trim()) newErrors.name = 'Le nom est requis';
    if (!formData.phone.match(/^[+]?[0-9\s-()]+$/)) newErrors.phone = 'Format de téléphone invalide';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    // Simulation sauvegarde
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsEditing(false);
    setLoading(false);
    setSuccessMessage('Profil mis à jour avec succès !');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleCancel = () => {
    setErrors({});
    setIsEditing(false);
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setUploadingPhoto(true);
    
    // Simulation upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setFormData(prev => ({ ...prev, profileImage: file }));
    setUploadingPhoto(false);
    setSuccessMessage('Photo mise à jour !');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleNotificationToggle = (key: string) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key as keyof typeof prev.notifications]
      }
    }));
  };

  const handlePasswordChange = async () => {
    setLoading(true);
    
    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrors({ password: 'Les mots de passe ne correspondent pas' });
      setLoading(false);
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setErrors({ password: 'Le mot de passe doit contenir au moins 8 caractères' });
      setLoading(false);
      return;
    }

    // Simulation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setShowPasswordChange(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setLoading(false);
    setSuccessMessage('Mot de passe changé avec succès !');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const getActivityMetrics = () => [
    {
      id: 'ai-questions',
      icon: <MessageCircle className="w-5 h-5" />,
      value: '47',
      label: 'Questions à l\'IA',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Interactions avec l\'assistant IA pour optimiser vos cultures'
    },
    {
      id: 'weather-checks',
      icon: <Cloud className="w-5 h-5" />,
      value: '156',
      label: 'Consultations météo',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Consultations des prévisions météorologiques pour vos activités'
    },
    {
      id: 'usage-days',
      icon: <Calendar className="w-5 h-5" />,
      value: '23',
      label: 'Jours d\'utilisation',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Nombre de jours actifs sur la plateforme ce mois-ci'
    },
    {
      id: 'farm-size',
      icon: <Tractor className="w-5 h-5" />,
      value: '25ha',
      label: 'Surface exploitée',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      description: 'Superficie totale de votre exploitation agricole'
    }
  ];

  const tabs = [
    { id: 'info', label: 'Informations', icon: <User size={16} /> },
    { id: 'farm', label: 'Exploitation', icon: <Tractor size={16} /> },
    { id: 'preferences', label: 'Préférences', icon: <Settings size={16} /> },
    { id: 'security', label: 'Sécurité', icon: <Shield size={16} /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-6">
        {/* Success Message */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2"
            >
              <Check size={20} />
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header Simplifié */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="w-12 h-12 bg-gray-900 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          
          <h1 className="text-3xl font-light text-gray-900 mb-2">
            Mon Profil Agricole
          </h1>
          
          <p className="text-gray-600 max-w-lg mx-auto">
            Gérez vos informations personnelles et votre exploitation
          </p>
        </motion.div>

        {/* Main Content - Layout Amélioré */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Profile Card - Plus Compact */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="p-6 text-center">
              {/* Avatar avec upload */}
              <div className="relative w-20 h-20 mx-auto mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-sm">
                  <User size={32} className="text-white" />
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {uploadingPhoto ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-3 h-3 border border-gray-300 border-t-gray-600 rounded-full"
                    />
                  ) : (
                    <Camera size={12} className="text-gray-600" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>

              {/* User Info Simplifié */}
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                {formData.name}
              </h2>
              
              <div className="flex items-center justify-center gap-2 mb-4">
                <Badge variant="success" className="text-xs px-2 py-1 rounded-full">
                  <Leaf size={10} className="mr-1" />
                  Certifié
                </Badge>
              </div>

              {/* Contact Info Compact */}
              <div className="space-y-2 text-left mb-6 text-sm">
                <div className="flex items-center text-gray-600">
                  <Mail size={12} className="mr-2 text-gray-400" />
                  <span className="text-xs truncate">{formData.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone size={12} className="mr-2 text-gray-400" />
                  <span className="text-xs">{formData.phone}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin size={12} className="mr-2 text-gray-400" />
                  <span className="text-xs">{formData.location}</span>
                </div>
              </div>

              {/* Edit Button */}
              <AnimatePresence mode="wait">
                {!isEditing ? (
                  <motion.div
                    key="edit"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Button
                      onClick={() => setIsEditing(true)}
                      size="sm"
                      className="w-full rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-sm"
                    >
                      <Edit2 size={14} className="mr-2" />
                      Modifier
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="save"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-2"
                  >
                    <Button
                      onClick={handleSave}
                      disabled={loading}
                      size="sm"
                      className="w-full rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm disabled:opacity-50"
                    >
                      {loading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-3 h-3 border border-white border-t-transparent rounded-full mr-2"
                        />
                      ) : (
                        <Save size={14} className="mr-2" />
                      )}
                      {loading ? 'Sauvegarde...' : 'Sauvegarder'}
                    </Button>
                    <Button
                      onClick={handleCancel}
                      size="sm"
                      className="w-full rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm"
                    >
                      <X size={14} className="mr-2" />
                      Annuler
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>

          {/* Detailed Information - Plus Spacieux */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <Card className="p-6">
              {/* Tabs Simplifiés */}
              <div className="flex flex-wrap gap-1 mb-6 bg-gray-50 p-1 rounded-lg">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.icon}
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab === 'info' && (
                  <motion.div
                    key="info"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom complet
                        </label>
                        {isEditing ? (
                          <div>
                            <input
                              type="text"
                              value={formData.name}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 ${
                                errors.name ? 'border-red-500' : 'border-gray-200'
                              }`}
                            />
                            {errors.name && (
                              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                            )}
                          </div>
                        ) : (
                          <p className="text-gray-900 font-medium bg-gray-50 px-3 py-2 rounded-lg">
                            {formData.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <p className="text-gray-900 font-medium bg-gray-50 px-3 py-2 rounded-lg">
                          {formData.email}
                          <span className="text-xs text-gray-500 ml-2">(Non modifiable)</span>
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Téléphone
                        </label>
                        {isEditing ? (
                          <div>
                            <input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 ${
                                errors.phone ? 'border-red-500' : 'border-gray-200'
                              }`}
                            />
                            {errors.phone && (
                              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                            )}
                          </div>
                        ) : (
                          <p className="text-gray-900 font-medium bg-gray-50 px-3 py-2 rounded-lg">
                            {formData.phone}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Localisation
                        </label>
                        <p className="text-gray-900 font-medium bg-gray-50 px-3 py-2 rounded-lg">
                          {formData.location}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'farm' && (
                  <motion.div
                    key="farm"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-3">Informations générales</h4>
                        <div className="space-y-3">
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Type d'agriculture</span>
                            <p className="text-gray-900">{formData.farmType}</p>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Surface exploitée</span>
                            <p className="text-gray-900">{formData.farmSize}</p>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Employés</span>
                            <p className="text-gray-900">{formData.employees}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-3">Cultures principales</h4>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {formData.mainCrops.map((crop, index) => (
                            <Badge key={index} variant="default" className="text-xs">
                              {crop}
                            </Badge>
                          ))}
                        </div>

                        <h4 className="text-lg font-medium text-gray-900 mb-3">Certifications</h4>
                        <div className="flex flex-wrap gap-2">
                          {formData.certifications.map((cert, index) => (
                            <Badge key={index} variant="success" className="text-xs">
                              <Award size={10} className="mr-1" />
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'preferences' && (
                  <motion.div
                    key="preferences"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Notifications</h4>
                      <div className="space-y-3">
                        {Object.entries(formData.notifications).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Bell size={16} className="text-gray-500" />
                              <span className="text-sm font-medium capitalize">
                                {key === 'weather' ? 'Alertes météo' : 
                                 key === 'alerts' ? 'Notifications d\'urgence' :
                                 key === 'reports' ? 'Rapports hebdomadaires' : 'Marketing'}
                              </span>
                            </div>
                            <button
                              onClick={() => handleNotificationToggle(key)}
                              className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${
                                value ? 'bg-green-500' : 'bg-gray-300'
                              }`}
                            >
                              <motion.div 
                                animate={{ x: value ? 18 : 2 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className="w-4 h-4 bg-white rounded-full absolute top-1"
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'security' && (
                  <motion.div
                    key="security"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-3 mb-4">
                        <Shield size={20} className="text-blue-600" />
                        <h4 className="text-lg font-medium text-gray-900">Sécurité du compte</h4>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium text-gray-900">Authentification à deux facteurs</span>
                            <p className="text-sm text-gray-600">Protection supplémentaire pour votre compte</p>
                          </div>
                          <button
                            onClick={() => setFormData(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }))}
                            className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${
                              formData.twoFactorEnabled ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                          >
                            <motion.div 
                              animate={{ x: formData.twoFactorEnabled ? 18 : 2 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                              className="w-4 h-4 bg-white rounded-full absolute top-1"
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium text-gray-900">Dernier changement de mot de passe</span>
                            <p className="text-sm text-gray-600">{formData.lastPasswordChange}</p>
                          </div>
                          <Button
                            onClick={() => setShowPasswordChange(true)}
                            size="sm"
                            className="rounded-lg bg-gray-900 hover:bg-gray-800 text-white px-3 py-2"
                          >
                            <Key size={14} className="mr-2" />
                            Changer
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle size={20} className="text-red-600" />
                        <h4 className="text-lg font-medium text-gray-900">Zone de danger</h4>
                      </div>
                      
                      <div>
                        <span className="font-medium text-gray-900">Supprimer le compte</span>
                        <p className="text-sm text-gray-600 mb-3">Cette action est irréversible. Toutes vos données seront supprimées.</p>
                        <Button
                          onClick={() => setShowDeleteConfirm(true)}
                          size="sm"
                          className="rounded-lg bg-red-600 hover:bg-red-700 text-white px-3 py-2"
                        >
                          <Trash2 size={14} className="mr-2" />
                          Supprimer le compte
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        </div>

        {/* Activity Metrics - Simplifié */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              Votre activité AGRIA
            </h3>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {getActivityMetrics().map((metric, index) => (
                <motion.div
                  key={metric.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors cursor-pointer"
                  onHoverStart={() => setActiveMetric(metric.id)}
                  onHoverEnd={() => setActiveMetric(null)}
                >
                  <div className={`w-10 h-10 mx-auto mb-3 ${metric.bgColor} rounded-lg flex items-center justify-center`}>
                    <span className={metric.color}>
                      {metric.icon}
                    </span>
                  </div>
                  
                  <div className="text-2xl font-light text-gray-900 mb-1">
                    {metric.value}
                  </div>
                  
                  <div className="text-xs font-medium text-gray-600">
                    {metric.label}
                  </div>

                  <AnimatePresence>
                    {activeMetric === metric.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-lg p-3 flex items-center justify-center z-10 border border-gray-200"
                      >
                        <p className="text-xs text-gray-700 text-center font-medium leading-relaxed">
                          {metric.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Account Management - Simplifié */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Gestion du compte
            </h3>
            
            <div className="flex flex-wrap gap-3">
              <Button
                size="sm"
                className="rounded-lg bg-gray-600 hover:bg-gray-700 text-white px-4 py-2"
              >
                <Download size={14} className="mr-2" />
                Exporter mes données
              </Button>
              
              <Button
                onClick={logout}
                size="sm"
                className="rounded-lg bg-red-600 hover:bg-red-700 text-white px-4 py-2"
              >
                <LogOut size={14} className="mr-2" />
                Se déconnecter
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Password Change Modal */}
        <AnimatePresence>
          {showPasswordChange && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-6 max-w-md w-full"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-4">Changer le mot de passe</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mot de passe actuel
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmer le nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                  
                  {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password}</p>
                  )}
                </div>
                
                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={handlePasswordChange}
                    disabled={loading}
                    size="sm"
                    className="flex-1 rounded-lg bg-green-600 hover:bg-green-700 text-white py-2"
                  >
                    {loading ? 'Changement...' : 'Changer le mot de passe'}
                  </Button>
                  <Button
                    onClick={() => setShowPasswordChange(false)}
                    size="sm"
                    className="flex-1 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 py-2"
                  >
                    Annuler
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-6 max-w-md w-full"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle size={24} className="text-red-600" />
                  </div>
                  
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Supprimer le compte</h3>
                  <p className="text-gray-600 mb-6">
                    Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.
                  </p>
                  
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setShowDeleteConfirm(false)}
                      size="sm"
                      className="flex-1 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 py-2"
                    >
                      Annuler
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 rounded-lg bg-red-600 hover:bg-red-700 text-white py-2"
                    >
                      Supprimer définitivement
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Profile;