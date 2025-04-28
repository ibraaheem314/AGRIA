import React, { useState, useEffect } from 'react';
import { 
  ArrowDown, ArrowUp, ChevronLeft, ChevronRight, 
  Download, Filter, Search, SortAsc, SortDesc
} from 'lucide-react';

export interface Column<T> {
  id: string;
  header: string;
  accessor: (row: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  subtitle?: string;
  loading?: boolean;
  pagination?: boolean;
  itemsPerPage?: number;
  exportable?: boolean;
  searchable?: boolean;
  filterPlaceholder?: string;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  className?: string;
  rowClassName?: (row: T) => string;
  noDataComponent?: React.ReactNode;
  onExport?: () => void;
}

// Générique pour fonctionner avec n'importe quel type de données
function DataTable<T extends Record<string, any>>(props: DataTableProps<T>) {
  const {
    data = [],
    columns = [],
    title,
    subtitle,
    loading = false,
    pagination = true,
    itemsPerPage = 10,
    exportable = false,
    searchable = true,
    filterPlaceholder = "Rechercher...",
    onRowClick,
    emptyMessage = "Aucune donnée disponible",
    className = "",
    rowClassName,
    noDataComponent,
    onExport
  } = props;

  // États
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc' | null;
  }>({ key: '', direction: null });

  // Filtrage de données
  const filteredData = React.useMemo(() => {
    if (!searchQuery) return data;
    
    return data.filter(item => {
      // Chercher dans toutes les colonnes
      return columns.some(column => {
        const value = column.accessor(item);
        if (typeof value === 'string' || typeof value === 'number') {
          return String(value).toLowerCase().includes(searchQuery.toLowerCase());
        }
        return false;
      });
    });
  }, [data, searchQuery, columns]);

  // Tri des données
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      // Trouver la colonne
      const column = columns.find(col => col.id === sortConfig.key);
      if (!column) return 0;
      
      // Obtenir les valeurs
      const aValue = column.accessor(a);
      const bValue = column.accessor(b);
      
      // Convertir en chaînes comparables
      const aString = typeof aValue === 'string' || typeof aValue === 'number' ? String(aValue) : '';
      const bString = typeof bValue === 'string' || typeof bValue === 'number' ? String(bValue) : '';
      
      // Comparer
      if (aString < bString) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aString > bString) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig, columns]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = React.useMemo(() => {
    if (!pagination) return sortedData;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, itemsPerPage, pagination]);

  // Gestion des changements de page
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Gestion du tri
  const handleSort = (columnId: string) => {
    let direction: 'asc' | 'desc' | null = 'asc';
    
    if (sortConfig.key === columnId) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc';
      } else if (sortConfig.direction === 'desc') {
        direction = null;
      }
    }
    
    setSortConfig({ key: columnId, direction });
  };

  // Réinitialisation de la page actuelle quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Export des données (exemple basique)
  const handleExport = () => {
    if (onExport) {
      onExport();
    } else {
      try {
        const jsonString = JSON.stringify(sortedData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title || 'data'}-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error exporting data:', error);
      }
    }
  };

  // Afficher l'état de chargement
  if (loading) {
    return (
      <div className={`bg-surface rounded-lg border border-border shadow-sm ${className}`}>
        {title && (
          <div className="px-4 py-3 border-b border-border">
            <h3 className="font-medium text-text">{title}</h3>
            {subtitle && <p className="text-sm text-text-secondary mt-1">{subtitle}</p>}
          </div>
        )}
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Afficher un message s'il n'y a pas de données
  if (data.length === 0 || filteredData.length === 0) {
    return (
      <div className={`bg-surface rounded-lg border border-border shadow-sm ${className}`}>
        {title && (
          <div className="px-4 py-3 border-b border-border">
            <h3 className="font-medium text-text">{title}</h3>
            {subtitle && <p className="text-sm text-text-secondary mt-1">{subtitle}</p>}
          </div>
        )}
        <div className="p-8 text-center">
          {noDataComponent || (
            <div className="text-text-secondary">
              {emptyMessage}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-surface rounded-lg border border-border shadow-sm ${className}`}>
      {/* En-tête du tableau */}
      {(title || searchable || exportable) && (
        <div className="px-4 py-3 border-b border-border flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          {title && (
            <div>
              <h3 className="font-medium text-text">{title}</h3>
              {subtitle && <p className="text-sm text-text-secondary mt-1">{subtitle}</p>}
            </div>
          )}
          
          <div className="flex items-center gap-3 ml-auto">
            {searchable && (
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                <input
                  type="text"
                  placeholder={filterPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-sm border border-border rounded-md bg-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-text w-full sm:w-auto"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            )}
            
            {exportable && (
              <button
                onClick={handleExport}
                className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-md bg-surface-2 hover:bg-surface-3 text-text-secondary hover:text-text"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Exporter</span>
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Tableau */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border bg-surface-2">
              {columns.map((column) => (
                <th
                  key={column.id}
                  className={`px-4 py-3 text-sm font-medium text-text-secondary ${
                    column.sortable ? 'cursor-pointer hover:text-text' : ''
                  } ${column.width ? `w-${column.width}` : ''} ${
                    column.align === 'center' ? 'text-center' : 
                    column.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                  onClick={column.sortable ? () => handleSort(column.id) : undefined}
                >
                  <div className="flex items-center gap-1">
                    <span>{column.header}</span>
                    {column.sortable && (
                      <span className="flex flex-col">
                        {sortConfig.key === column.id ? (
                          sortConfig.direction === 'asc' ? (
                            <SortAsc size={14} className="text-primary" />
                          ) : sortConfig.direction === 'desc' ? (
                            <SortDesc size={14} className="text-primary" />
                          ) : null
                        ) : (
                          <Filter size={14} className="text-border" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`border-b border-border hover:bg-surface-2 transition-colors ${
                  onRowClick ? 'cursor-pointer' : ''
                } ${rowClassName ? rowClassName(row) : ''}`}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((column) => (
                  <td
                    key={`${rowIndex}-${column.id}`}
                    className={`px-4 py-3 text-sm ${
                      column.align === 'center' ? 'text-center' : 
                      column.align === 'right' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {column.accessor(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="px-4 py-3 border-t border-border flex justify-between items-center">
          <div className="text-sm text-text-secondary">
            Affichage de {Math.min(paginatedData.length, itemsPerPage)} sur {sortedData.length} résultats
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`p-1 rounded ${
                currentPage === 1 ? 'text-border cursor-not-allowed' : 'text-text-secondary hover:text-text hover:bg-surface-2'
              }`}
            >
              <ChevronLeft size={18} />
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Calculer quelle plage de pages afficher
              let startPage = Math.max(1, currentPage - 2);
              const endPage = Math.min(startPage + 4, totalPages);
              
              if (endPage - startPage < 4) {
                startPage = Math.max(1, endPage - 4);
              }
              
              const pageNumber = startPage + i;
              if (pageNumber > totalPages) return null;
              
              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`w-8 h-8 flex items-center justify-center rounded text-sm ${
                    currentPage === pageNumber
                      ? 'bg-primary text-white font-medium'
                      : 'text-text-secondary hover:bg-surface-2'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`p-1 rounded ${
                currentPage === totalPages ? 'text-border cursor-not-allowed' : 'text-text-secondary hover:text-text hover:bg-surface-2'
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable; 