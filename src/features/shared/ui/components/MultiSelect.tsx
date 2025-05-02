import React, { useState, useRef, useEffect } from 'react';
import { Checkbox } from './Checkbox';

export interface Option {
  id: string;
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: Option[];
  selectedValues: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  maxHeight?: number;
}

export function MultiSelect({
  options,
  selectedValues,
  onChange,
  placeholder = 'Select options',
  disabled = false,
  className = '',
  maxHeight = 250,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(v => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const handleSelectAll = () => {
    if (selectedValues.length === options.length) {
      onChange([]);
    } else {
      onChange(options.map(option => option.value));
    }
  };

  const allSelected = selectedValues.length === options.length && options.length > 0;
  const someSelected = selectedValues.length > 0 && selectedValues.length < options.length;

  return (
    <div 
      className={`relative ${className}`} 
      ref={containerRef}
    >
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-3 py-2 text-left border rounded-md shadow-sm text-sm
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
          ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white cursor-pointer'}
        `}
      >
        {selectedValues.length === 0 ? (
          <span className="text-gray-400">{placeholder}</span>
        ) : (
          <span>
            {selectedValues.length} option{selectedValues.length !== 1 ? 's' : ''} selected
          </span>
        )}
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg 
            className="h-5 w-5 text-gray-400" 
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20" 
            fill="currentColor" 
            aria-hidden="true"
          >
            <path 
              fillRule="evenodd" 
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
              clipRule="evenodd" 
            />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div 
          className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200"
        >
          <div className="p-2 border-b border-gray-200">
            <Checkbox
              id="select-all"
              checked={allSelected}
              indeterminate={someSelected}
              onChange={handleSelectAll}
              label="Select All"
            />
          </div>
          <div 
            className="py-1 overflow-y-auto" 
            style={{ maxHeight: `${maxHeight}px` }}
          >
            {options.map((option) => (
              <div key={option.id} className="px-2 py-1 hover:bg-gray-100">
                <Checkbox
                  id={option.id}
                  checked={selectedValues.includes(option.value)}
                  onChange={() => handleToggleOption(option.value)}
                  label={option.label}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 