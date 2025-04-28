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

  // Définition des colonnes
  const columns = [
    {
      header: () => (
        <div className="px-1">
          <input 
            type="checkbox" 
            checked={areAllSelected}
            onChange={toggleSelectAll}
            className="rounded border-gray-300"
          />
        </div>
      ),
      accessor: 'selection',
      cell: ({ row }: { row: { original: Field } }) => (
        <div className="px-1">
          <input 
            type="checkbox" 
            checked={selectedFields.includes(row.original.id)}
            onChange={() => toggleFieldSelection(row.original.id)}
            className="rounded border-gray-300"
          />
        </div>
      ),
      width: 40,
    },
    {
      header: 'ID',
      accessor: 'id',
      cell: ({ value }: { value: string }) => <span className="font-mono text-xs">{value}</span>,
      width: 120,
      sortable: true,
    },
    {
      header: 'Parcelle',
      accessor: 'name',
      cell: ({ value }: { value: string }) => <span className="font-medium">{value}</span>,
      sortable: true,
    },
    {
      header: () => (
        <div className="flex items-center">
          <MapPinIcon size={14} className="mr-1" />
          <span>Emplacement</span>
        </div>
      ),
      accessor: 'location',
      sortable: true,
    },
    {
      header: 'Taille (ha)',
      accessor: 'size',
      cell: ({ value }: { value: number }) => <span>{value.toFixed(1)}</span>,
      sortable: true,
    },
    {
      header: 'Culture',
      accessor: 'crop',
      sortable: true,
    },
    {
      header: () => (
        <div className="flex items-center">
          <CalendarIcon size={14} className="mr-1" />
          <span>Planté le</span>
        </div>
      ),
      accessor: 'plantingDate',
      cell: ({ value }: { value: string }) => formatDate(value),
      sortable: true,
    },
    {
      header: () => (
        <div className="flex items-center">
          <CalendarIcon size={14} className="mr-1" />
          <span>Récolte prévue</span>
        </div>
      ),
      accessor: 'harvestDate',
      cell: ({ value }: { value: string }) => formatDate(value),
      sortable: true,
    },
    {
      header: 'Statut',
      accessor: 'status',
      cell: ({ value }: { value: Field['status'] }) => (
        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(value)}`}>
          {translateStatus(value)}
        </span>
      ),
      sortable: true,
    },
    {
      header: 'Indice de santé',
      accessor: 'healthIndex',
      cell: ({ value }: { value: number }) => (
        <span className={`px-2 py-1 rounded-full text-xs ${getHealthColor(value)}`}>
          {value}%
        </span>
      ),
      sortable: true,
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: ({ row }: { row: { original: Field } }) => (
        <div className="flex space-x-1 justify-end">
          <button 
            className="p-1 text-text-secondary hover:text-text-primary hover:bg-surface-3 rounded"
            title="Voir les détails"
          >
            <EyeIcon size={16} />
          </button>
          <button 
            className="p-1 text-text-secondary hover:text-text-primary hover:bg-surface-3 rounded"
            title="Modifier"
          >
            <PencilIcon size={16} />
          </button>
          <button 
            className="p-1 text-text-secondary hover:text-red-600 hover:bg-red-50 rounded"
            title="Supprimer"
          >
            <Trash2Icon size={16} />
          </button>
        </div>
      ),
      width: 120,
    }
  ];

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-text-primary">Gestion des parcelles</h1>
        <button className="btn-primary flex items-center">
          <PlusIcon size={16} className="mr-2" />
          Nouvelle parcelle
        </button>
      </div>

      <div className="flex justify-between items-center mb-4 space-x-4">
        <div className="flex items-center space-x-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <input 
              type="text"
              placeholder="Rechercher une parcelle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field w-full pl-10 pr-4"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>

          <div className="relative">
            <button className="btn-outline flex items-center">
              <FilterIcon size={16} className="mr-2" />
              Filtrer
              <span className="ml-2">{filterStatus !== 'all' ? `(${translateStatus(filterStatus)})` : ''}</span>
            </button>
            <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-md border border-border overflow-hidden z-10 hidden">
              <div className="p-2 space-y-1 w-48">
                <button 
                  className={`w-full text-left px-3 py-1.5 rounded-md ${filterStatus === 'all' ? 'bg-surface-3' : 'hover:bg-surface-2'}`}
                  onClick={() => setFilterStatus('all')}
                >
                  Toutes les parcelles
                </button>
                <button 
                  className={`w-full text-left px-3 py-1.5 rounded-md ${filterStatus === 'active' ? 'bg-surface-3' : 'hover:bg-surface-2'}`}
                  onClick={() => setFilterStatus('active')}
                >
                  Parcelles actives
                </button>
                <button 
                  className={`w-full text-left px-3 py-1.5 rounded-md ${filterStatus === 'fallow' ? 'bg-surface-3' : 'hover:bg-surface-2'}`}
                  onClick={() => setFilterStatus('fallow')}
                >
                  Parcelles en jachère
                </button>
                <button 
                  className={`w-full text-left px-3 py-1.5 rounded-md ${filterStatus === 'preparation' ? 'bg-surface-3' : 'hover:bg-surface-2'}`}
                  onClick={() => setFilterStatus('preparation')}
                >
                  Parcelles en préparation
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            className="btn-outline flex items-center"
            disabled={selectedFields.length === 0}
          >
            <DownloadIcon size={16} className="mr-2" />
            Exporter
          </button>
          <button 
            className="btn-outline flex items-center"
            onClick={() => {
              setLoading(true);
              setTimeout(() => {
                setFields(generateMockFields());
                setLoading(false);
              }, 800);
            }}
          >
            <RefreshCwIcon size={16} className="mr-2" />
            Actualiser
          </button>
        </div>
      </div>
      
      <div className="bg-white border border-border rounded-lg flex-1 overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredAndSortedFields}
          loading={loading}
          onSort={handleSort}
          sortColumn={sortState.column || undefined}
          sortDirection={sortState.direction || undefined}
          SortAscIcon={ArrowUpIcon}
          SortDescIcon={ArrowDownIcon}
          emptyMessage="Aucune parcelle trouvée"
          loadingMessage="Chargement des parcelles..."
        />
      </div>
      
      <div className="mt-4 text-sm text-text-secondary">
        {filteredAndSortedFields.length} parcelle{filteredAndSortedFields.length !== 1 ? 's' : ''} affichée{filteredAndSortedFields.length !== 1 ? 's' : ''}
        {selectedFields.length > 0 && ` • ${selectedFields.length} sélectionnée${selectedFields.length !== 1 ? 's' : ''}`}
      </div>
    </div>
  );
};

export default FieldsPage; 