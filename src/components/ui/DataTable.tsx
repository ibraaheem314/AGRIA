import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Column<T> {
  header: string | (() => React.ReactNode);
  accessor: string;
  cell?: ({ row, value }: { row: { original: T }, value: any }) => React.ReactNode;
  width?: number;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  onSort?: (column: string) => void;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  SortAscIcon?: LucideIcon;
  SortDescIcon?: LucideIcon;
  emptyMessage?: string;
  loadingMessage?: string;
}

export function DataTable<T>({
  columns,
  data,
  loading = false,
  onSort,
  sortColumn,
  sortDirection,
  SortAscIcon,
  SortDescIcon,
  emptyMessage = "Aucune donnée",
  loadingMessage = "Chargement..."
}: DataTableProps<T>) {
  // Fonction pour obtenir la valeur d'une cellule
  const getCellValue = (row: T, accessor: string) => {
    // Gestion des accesseurs imbriqués comme 'user.name'
    return accessor.split('.').reduce((obj, key) => obj?.[key as keyof typeof obj], row as any);
  };

  // Rendu du header
  const renderHeader = (column: Column<T>, index: number) => {
    const isSorted = column.accessor === sortColumn;
    const isSortable = column.sortable && onSort;
    
    // Style de la cellule d'en-tête
    const headerStyle: React.CSSProperties = {
      width: column.width ? `${column.width}px` : 'auto',
      cursor: isSortable ? 'pointer' : 'default',
    };

    // Contenu de la cellule d'en-tête
    const headerContent = typeof column.header === 'function' 
      ? column.header() 
      : column.header;
    
    return (
      <th 
        key={`header-${index}`}
        className={`px-4 py-3 text-left text-xs font-medium text-text-secondary tracking-wider border-b border-border`}
        style={headerStyle}
        onClick={() => isSortable ? onSort(column.accessor) : undefined}
      >
        <div className="flex items-center">
          {headerContent}
          
          {isSortable && (
            <span className="ml-1.5 flex">
              {isSorted && sortDirection === 'asc' && SortAscIcon && (
                <SortAscIcon size={16} className="text-primary" />
              )}
              {isSorted && sortDirection === 'desc' && SortDescIcon && (
                <SortDescIcon size={16} className="text-primary" />
              )}
              {!isSorted && (
                <span className="text-gray-300 opacity-40">
                  {SortAscIcon && <SortAscIcon size={16} />}
                </span>
              )}
            </span>
          )}
        </div>
      </th>
    );
  };

  // Rendu du corps du tableau
  const renderBody = () => {
    if (loading) {
      return (
        <tr>
          <td 
            colSpan={columns.length} 
            className="px-4 py-8 text-center text-sm text-text-secondary"
          >
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="w-6 h-6 border-2 border-t-primary border-r-surface-3 border-b-surface-3 border-l-surface-3 rounded-full animate-spin"></div>
              <p>{loadingMessage}</p>
            </div>
          </td>
        </tr>
      );
    }

    if (!data.length) {
      return (
        <tr>
          <td 
            colSpan={columns.length} 
            className="px-4 py-8 text-center text-sm text-text-secondary"
          >
            {emptyMessage}
          </td>
        </tr>
      );
    }

    return data.map((row, rowIndex) => (
      <tr 
        key={`row-${rowIndex}`}
        className="hover:bg-surface-2 transition-colors"
      >
        {columns.map((column, colIndex) => {
          const value = column.accessor === 'actions' 
            ? undefined 
            : getCellValue(row, column.accessor);
          
          return (
            <td 
              key={`cell-${rowIndex}-${colIndex}`}
              className="px-4 py-3 text-sm border-t border-border"
              style={{ width: column.width ? `${column.width}px` : 'auto' }}
            >
              {column.cell 
                ? column.cell({ row: { original: row }, value }) 
                : value}
            </td>
          );
        })}
      </tr>
    ));
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr>
            {columns.map(renderHeader)}
          </tr>
        </thead>
        <tbody className="bg-white">
          {renderBody()}
        </tbody>
      </table>
    </div>
  );
} 