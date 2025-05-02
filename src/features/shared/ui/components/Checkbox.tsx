import React from 'react';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  className?: string;
  indeterminate?: boolean;
}

export function Checkbox({
  checked,
  onChange,
  label,
  id,
  name,
  disabled = false,
  className = '',
  indeterminate = false,
}: CheckboxProps) {
  const checkboxRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative flex items-center">
        <input
          ref={checkboxRef}
          type="checkbox"
          id={id}
          name={name}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`w-4 h-4 border rounded flex items-center justify-center
            ${checked ? 'bg-primary border-primary' : 'border-gray-300'} 
            ${indeterminate ? 'bg-primary border-primary' : ''} 
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {checked && !indeterminate && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3 h-3 text-white"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
          {indeterminate && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3 h-3 text-white"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          )}
        </div>
      </div>
      {label && (
        <label
          htmlFor={id}
          className={`ml-2 text-sm ${
            disabled ? 'text-gray-400 cursor-not-allowed' : 'text-text-primary cursor-pointer'
          }`}
        >
          {label}
        </label>
      )}
    </div>
  );
} 