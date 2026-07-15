// components/custom-ui/PeriodeValidate.tsx
'use client';
import React, { useState, useEffect } from 'react';
import InputDatePicker from '@/components/custom-ui/InputDatePicker';

interface PeriodeValidationProps {
  label?: string;
  // ✅ Controlled — value dari parent
  date1: string;
  date2: string;
  // ✅ Parent yang tentukan kemana nilai ini pergi (pending atau Redux langsung)
  onDate1Change: (value: string) => void;
  onDate2Change: (value: string) => void;
  // ✅ Validasi
  onValidationChange?: (isValid: boolean) => void;
  triggerValidation?: boolean;
}

const PeriodeValidation: React.FC<PeriodeValidationProps> = ({
  label = 'periode',
  date1,
  date2,
  onDate1Change,
  onDate2Change,
  onValidationChange,
  triggerValidation = false
}) => {
  const [showError, setShowError] = useState<{
    status: boolean;
    message: string;
  }>({ status: false, message: '' });

  const parseDateFromDDMMYYYY = (dateString: string): Date | undefined => {
    const parts = dateString.split('-');
    if (parts.length !== 3) return undefined;
    const [day, month, year] = parts.map(Number);
    if (isNaN(day) || isNaN(month) || isNaN(year)) return undefined;
    return new Date(year, month - 1, day);
  };

  const validateDates = (
    tanggalDari: string,
    tanggalSampai: string
  ): boolean => {
    const dateDari = parseDateFromDDMMYYYY(tanggalDari);
    const dateSampai = parseDateFromDDMMYYYY(tanggalSampai);

    if (dateDari && dateSampai && dateSampai < dateDari) {
      const error = {
        status: true,
        message: `TANGGAL SAMPAI TIDAK BOLEH KURANG DARI ${tanggalDari}`
      };
      setShowError(error);
      onValidationChange?.(false);
      return false;
    }

    setShowError({ status: false, message: '' });
    onValidationChange?.(true);
    return true;
  };

  const clearError = () => {
    setShowError({ status: false, message: '' });
    onValidationChange?.(true);
  };

  const handleDate1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDate1Change(e.target.value);
    clearError();
  };

  const handleDate2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDate2Change(e.target.value);
    clearError();
  };

  const handleCalendarSelect1 = (value: any) => {
    onDate1Change(value ? String(value) : '');
    clearError();
  };

  const handleCalendarSelect2 = (value: any) => {
    onDate2Change(value ? String(value) : '');
    clearError();
  };

  // ✅ Trigger validasi dari parent (saat user klik Reload)
  useEffect(() => {
    if (triggerValidation && date1 && date2) {
      validateDates(date1, date2);
    }
  }, [triggerValidation]);

  return (
    <div className="flex w-full flex-col items-center justify-between lg:flex-row">
      <label className="w-full text-sm font-bold lg:w-[20%]">
        {label}:<span style={{ color: 'red', marginLeft: '4px' }}>*</span>
      </label>

      <div className="relative w-full lg:w-[30%]">
        <InputDatePicker
          value={date1}
          showCalendar
          onChange={handleDate1Change}
          onSelect={handleCalendarSelect1}
        />
      </div>

      <div className="flex w-[20%] items-center justify-center">
        <p className="text-center text-sm font-bold">S/D</p>
      </div>

      <div className="relative w-full lg:w-[30%]">
        <InputDatePicker
          value={date2}
          showCalendar
          onChange={handleDate2Change}
          onSelect={handleCalendarSelect2}
          danger={showError.status}
        />

        {showError.status && (
          <p className="absolute left-0 top-full mt-1 text-[0.8rem] text-red-500">
            {showError.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default PeriodeValidation;
