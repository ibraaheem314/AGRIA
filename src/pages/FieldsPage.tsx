import React, { useState, useEffect } from 'react';
import { MapPinIcon, CalendarIcon, ArrowDownIcon, ArrowUpIcon, FilterIcon, DownloadIcon, 
  RefreshCwIcon, PlusIcon, Trash2Icon, PencilIcon, EyeIcon } from 'lucide-react';
import { DataTable } from '../components/ui/DataTable';

interface Field {
  id: string;
  name: string;
  location: string;
  size: number;
  crop: string;
  plantingDate: string;
  harvestDate: string;
  status: 'active' | 'fallow' | 'preparation';
  healthIndex: number;
  lastIrrigation: string;
  soilType: string;
}

type SortDirection = 'asc' | 'desc' | null;

interface SortState {
  column: keyof Field | null;
  direction: SortDirection;
}

const FieldsPage = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<Field['status'] | 'all'>('all');
  const [sortState, setSortState] = useState<SortState>({ column: null, direction: null });
  const [searchTerm, setSearchTerm] = useState('');

  // Charger les données des parcelles
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setFields(generateMockFields());
      setLoading(false);
    }, 800);
  }, []);

  // Générer des données fictives
  const generateMockFields = (): Field[] => {
    const crops = ['Blé', 'Maïs', 'Tournesol', 'Colza', 'Orge', 'Soja', 'Luzerne'];
    const soilTypes = ['Argileux', 'Limoneux', 'Sableux', 'Limono-argileux', 'Argilo-sableux'];
    const locations = ['Secteur Nord', 'Secteur Est', 'Secteur Ouest', 'Secteur Sud'];
    const statuses: Array<Field['status']> = ['active', 'fallow', 'preparation'];
    
    return Array.from({ length: 20 }, (_, i) => {
      const plantingDate = new Date(2023, Math.floor(Math.random() * 6), Math.floor(Math.random() * 28) + 1);
      const harvestDays = Math.floor(Math.random() * 120) + 60;
      const harvestDate = new Date(plantingDate);
      harvestDate.setDate(plantingDate.getDate() + harvestDays);
      
      const lastIrrigationDays = Math.floor(Math.random() * 14);
      const lastIrrigation = new Date();
      lastIrrigation.setDate(lastIrrigation.getDate() - lastIrrigationDays);
      
      return {
        id: `FIELD-${(i + 1).toString().padStart(3, '0')}`,
        name: `Parcelle ${String.fromCharCode(65 + i % 26)}${Math.floor(i / 26) + 1}`,
        location: locations[Math.floor(Math.random() * locations.length)],
        size: Math.floor(Math.random() * 50) + 5,
        crop: crops[Math.floor(Math.random() * crops.length)],
        plantingDate: plantingDate.toISOString().split('T')[0],
        harvestDate: harvestDate.toISOString().split('T')[0],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        healthIndex: Math.floor(Math.random() * 40) + 60,
        lastIrrigation: lastIrrigation.toISOString().split('T')[0],
        soilType: soilTypes[Math.floor(Math.random() * soilTypes.length)]
      };
    });
  };

  // Formater les dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
  };

  // Traduire les statuts
  const translateStatus = (status: Field['status']) => {
    switch(status) {
      case 'active': return 'Active';
      case 'fallow': return 'En jachère';
      case 'preparation': return 'En préparation';
      default: return status;
    }
  };

  // Obtenir la couleur pour l'indice de santé
  const getHealthColor = (index: number) => {
    if (index >= 80) return 'bg-green-100 text-green-800';
    if (index >= 60) return 'bg-lime-100 text-lime-800';
    if (index >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // Obtenir la couleur pour le statut
  const getStatusColor = (status: Field['status']) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'fallow': return 'bg-gray-100 text-gray-800';
      case 'preparation': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  // Gérer le tri
  const handleSort = (column: keyof Field) => {
    const newDirection: SortDirection = 
      sortState.column === column 
        ? sortState.direction === 'asc' 
          ? 'desc' 
          : sortState.direction === 'desc' 
            ? null 
            : 'asc'
        : 'asc';
    
    setSortState({ column, direction: newDirection });
  };

  // Filtrer et trier les données
  const filteredAndSortedFields = React.useMemo(() => {
    // Filtrer par statut
    let result = fields.filter(field => 
      filterStatus === 'all' || field.status === filterStatus
    );
    
    // Recherche
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(field => 
        field.name.toLowerCase().includes(searchLower) ||
        field.crop.toLowerCase().includes(searchLower) ||
        field.location.toLowerCase().includes(searchLower) ||
        field.id.toLowerCase().includes(searchLower)
      );
    }
    
    // Trier
    if (sortState.column && sortState.direction) {
      result = [...result].sort((a, b) => {
        if (a[sortState.column!] < b[sortState.column!]) {
          return sortState.direction === 'asc' ? -1 : 1;
        }
        if (a[sortState.column!] > b[sortState.column!]) {
          return sortState.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return result;
  }, [fields, filterStatus, sortState, searchTerm]);

  // Gérer la sélection des parcelles
  const toggleFieldSelection = (id: string) => {
    setSelectedFields(prev => 
      prev.includes(id) 
        ? prev.filter(fieldId => fieldId !== id) 
        : [...prev, id]
    );
  };

  // Vérifier si toutes les parcelles sont sélectionnées
  const areAllSelected = selectedFields.length === filteredAndSortedFields.length && filteredAndSortedFields.length > 0;
  
  // Sélectionner/désélectionner toutes les parcelles
  const toggleSelectAll = () => {
    if (areAllSelected) {
      setSelectedFields([]);
    } else {
      setSelectedFields(filteredAndSortedFields.map(field => field.id));
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* En-tête */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-1 bg-green-600"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-medium text-gray-800">Parcelles</h1>
            <p className="text-gray-500 mt-1">Gestion et suivi de vos parcelles agricoles</p>
          </div>
          <div className="flex gap-2">
            <button 
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg flex items-center text-sm transition-colors" 
              onClick={() => {}}>
              <PlusIcon size={16} className="mr-1" />
              Nouvelle parcelle
            </button>
          </div>
        </div>
      </div>

      {/* Contrôles du tableau */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:border-green-600 focus:ring-green-600 focus:ring-1 focus:outline-none w-full md:w-64"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <select
              className="bg-gray-50 border border-gray-300 text-gray-800 rounded-lg py-2 px-3 focus:border-green-600 focus:ring-green-600 focus:ring-1 focus:outline-none"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actives</option>
              <option value="fallow">En jachère</option>
              <option value="preparation">En préparation</option>
            </select>

            <button 
              className="inline-flex items-center p-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-500"
              onClick={() => {}}
            >
              <FilterIcon size={18} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button 
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 text-sm"
              onClick={() => {}}
            >
              <DownloadIcon size={16} className="mr-1 text-gray-500" />
              Exporter
            </button>
            <button 
              className="inline-flex items-center p-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-500"
              onClick={() => {
                setLoading(true);
                setTimeout(() => {
                  setFields(generateMockFields());
                  setLoading(false);
                }, 800);
              }}
            >
              <RefreshCwIcon size={18} />
            </button>
          </div>
        </div>

        {selectedFields.length > 0 && (
          <div className="flex items-center py-2 px-3 bg-gray-50 rounded-lg mb-4">
            <span className="text-sm text-gray-600 mr-2">
              {selectedFields.length} parcelle{selectedFields.length > 1 ? 's' : ''} sélectionnée{selectedFields.length > 1 ? 's' : ''}
            </span>
            <div className="flex gap-2 ml-auto">
              <button 
                className="inline-flex items-center px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 text-sm transition-colors"
                onClick={() => {}}
              >
                <EyeIcon size={14} className="mr-1" />
                Voir
              </button>
              <button 
                className="inline-flex items-center px-3 py-1.5 bg-blue-100 hover:bg-blue-200 rounded-lg text-blue-700 text-sm transition-colors"
                onClick={() => {}}
              >
                <PencilIcon size={14} className="mr-1" />
                Modifier
              </button>
              <button 
                className="inline-flex items-center px-3 py-1.5 bg-red-100 hover:bg-red-200 rounded-lg text-red-700 text-sm transition-colors"
                onClick={() => {}}
              >
                <Trash2Icon size={14} className="mr-1" />
                Supprimer
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tableau des parcelles */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-32 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
            <span className="ml-3 text-gray-600">Chargement des parcelles...</span>
          </div>
        ) : filteredAndSortedFields.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center p-4">
            <div className="rounded-full bg-gray-100 p-3 mb-3">
              <MapPinIcon size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-1">Aucune parcelle trouvée</h3>
            <p className="text-gray-500 max-w-md mb-4">
              {searchTerm || filterStatus !== 'all' 
                ? "Aucune parcelle ne correspond à vos critères de recherche. Essayez de modifier vos filtres."
                : "Vous n'avez pas encore de parcelles enregistrées. Commencez par ajouter votre première parcelle."}
            </p>
            {(!searchTerm && filterStatus === 'all') && (
              <button 
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                onClick={() => {}}
              >
                <PlusIcon size={16} className="mr-1" />
                Ajouter une parcelle
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={areAllSelected}
                        onChange={toggleSelectAll}
                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                    </div>
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center cursor-pointer" onClick={() => handleSort('id')}>
                      ID
                      {sortState.column === 'id' && (
                        sortState.direction === 'asc' 
                          ? <ArrowUpIcon size={14} className="ml-1 text-green-600" />
                          : <ArrowDownIcon size={14} className="ml-1 text-green-600" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center cursor-pointer" onClick={() => handleSort('name')}>
                      Parcelle
                      {sortState.column === 'name' && (
                        sortState.direction === 'asc' 
                          ? <ArrowUpIcon size={14} className="ml-1 text-green-600" />
                          : <ArrowDownIcon size={14} className="ml-1 text-green-600" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center cursor-pointer" onClick={() => handleSort('location')}>
                      <MapPinIcon size={14} className="mr-1" />
                      Emplacement
                      {sortState.column === 'location' && (
                        sortState.direction === 'asc' 
                          ? <ArrowUpIcon size={14} className="ml-1 text-green-600" />
                          : <ArrowDownIcon size={14} className="ml-1 text-green-600" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center cursor-pointer" onClick={() => handleSort('size')}>
                      Taille (ha)
                      {sortState.column === 'size' && (
                        sortState.direction === 'asc' 
                          ? <ArrowUpIcon size={14} className="ml-1 text-green-600" />
                          : <ArrowDownIcon size={14} className="ml-1 text-green-600" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center cursor-pointer" onClick={() => handleSort('crop')}>
                      Culture
                      {sortState.column === 'crop' && (
                        sortState.direction === 'asc' 
                          ? <ArrowUpIcon size={14} className="ml-1 text-green-600" />
                          : <ArrowDownIcon size={14} className="ml-1 text-green-600" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center cursor-pointer" onClick={() => handleSort('status')}>
                      Statut
                      {sortState.column === 'status' && (
                        sortState.direction === 'asc' 
                          ? <ArrowUpIcon size={14} className="ml-1 text-green-600" />
                          : <ArrowDownIcon size={14} className="ml-1 text-green-600" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center cursor-pointer" onClick={() => handleSort('healthIndex')}>
                      Santé
                      {sortState.column === 'healthIndex' && (
                        sortState.direction === 'asc' 
                          ? <ArrowUpIcon size={14} className="ml-1 text-green-600" />
                          : <ArrowDownIcon size={14} className="ml-1 text-green-600" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedFields.map((field) => (
                  <tr key={field.id} className="hover:bg-gray-50">
                    <td className="px-3 py-4 whitespace-nowrap">
                      <input 
                        type="checkbox" 
                        checked={selectedFields.includes(field.id)}
                        onChange={() => toggleFieldSelection(field.id)}
                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <span className="font-mono text-xs text-gray-500">{field.id}</span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <span className="font-medium text-gray-800">{field.name}</span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-gray-600">
                      {field.location}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-gray-600">
                      {field.size.toFixed(1)}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-gray-600">
                      {field.crop}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(field.status)}`}>
                        {translateStatus(field.status)}
                      </span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getHealthColor(field.healthIndex)}`}>
                          {field.healthIndex}%
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-1">
                        <button className="text-gray-500 hover:text-green-700 p-1" title="Voir les détails">
                          <EyeIcon size={16} />
                        </button>
                        <button className="text-gray-500 hover:text-blue-700 p-1" title="Modifier">
                          <PencilIcon size={16} />
                        </button>
                        <button className="text-gray-500 hover:text-red-700 p-1" title="Supprimer">
                          <Trash2Icon size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {filteredAndSortedFields.length > 0 && (
          <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Affichage de <span className="font-medium">1</span> à <span className="font-medium">{filteredAndSortedFields.length}</span> sur <span className="font-medium">{fields.length}</span> parcelles
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Précédent</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">1</a>
                  <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-green-50 text-sm font-medium text-green-700 hover:bg-green-100">2</a>
                  <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">3</a>
                  <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Suivant</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </a>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FieldsPage; 