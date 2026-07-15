import React, { useEffect, useState } from 'react';

type CurrencyInputProps = {
  value?: string;
  onValueChange?: (val: string) => void;
  icon?: React.ReactNode;
  className?: string;
  autoFocus?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  isPercent?: boolean;
  placeholder?: string;
};

const InputCurrency: React.FC<CurrencyInputProps> = ({
  value = '',
  onValueChange,
  icon,
  className = '',
  autoFocus = false,
  isPercent = false,
  readOnly = false,
  disabled = false,
  placeholder = ''
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const formatWithCommas = (rawValue: string): string => {
    const cleaned = rawValue.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    if (parts.length > 1) {
      parts[1] = parts[1].slice(0, 2);
      return parts.join('.');
    }
    return parts[0];
  };

  const formatWithDecimal = (rawValue: string): string => {
    if (!rawValue || rawValue === '') return '';
    const cleaned = rawValue.replace(/[^0-9.]/g, '');
    if (cleaned === '') return '';
    const parts = cleaned.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    if (parts.length > 1) {
      const decimalPart = (parts[1] + '00').slice(0, 2);
      return `${parts[0]}.${decimalPart}`;
    }
    return `${parts[0]}.00`;
  };

  useEffect(() => {
    if (!isFocused) {
      const valueStr = String(value || '');
      if (valueStr === '') {
        setInputValue('');
      } else {
        const hasDecimal = valueStr.includes('.');
        if (!hasDecimal) {
          setInputValue(formatWithDecimal(valueStr));
        } else {
          setInputValue(formatWithCommas(valueStr));
        }
      }
    }
  }, [value, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    if (isPercent) {
      const numericValue = parseFloat(raw.replace(/[^0-9.]/g, ''));
      if (numericValue > 100) return;
    }

    const formatted = formatWithCommas(raw);
    setInputValue(formatted);
    onValueChange?.(formatted);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!inputValue) {
      setInputValue('');
      onValueChange?.('');
    } else {
      const formatted = formatWithDecimal(inputValue);
      setInputValue(formatted);
      onValueChange?.(formatted);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    e.target.select();
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={inputValue}
        readOnly={readOnly}
        disabled={disabled}
        autoFocus={autoFocus}
        placeholder={placeholder}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        className={`h-9 w-full rounded-sm border border-input-border bg-background-input px-1 py-1 text-right text-sm focus:border-input-border-focus focus:bg-background-input-focus focus:outline-none focus:ring-0 ${className} ${
          readOnly || disabled ? 'text-input-text-disabled' : 'text-input-text'
        }`}
      />
      {icon && (
        <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center bg-background-grid-header text-button-text">
          {icon}
        </div>
      )}
    </div>
  );
};

export default InputCurrency;
