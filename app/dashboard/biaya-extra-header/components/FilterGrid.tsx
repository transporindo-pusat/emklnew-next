// FilterGrid.tsx
'use client';

import { useDispatch, useSelector } from 'react-redux';
import { IoMdRefresh } from 'react-icons/io';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import {
  setPending,
  commitFilter,
  setSelectedJenisOrderan,
  setSelectedJenisOrderanNama
} from '@/lib/store/filterSlice/filterSlice';
import LookUp from '@/components/custom-ui/LookUp';
import { JENISORDERMUATANNAMA } from '@/constants/biayaextraheader';
import PeriodeValidation from '@/components/custom-ui/PeriodeValidate';
import { RootState } from '@/lib/store/store';

const FilterGrid = () => {
  const dispatch = useDispatch();
  const pending = useSelector((state: RootState) => state.filter.pending);
  const [triggerValidation, setTriggerValidation] = useState(false);
  const { selectedJenisOrderanNama } = useSelector(
    (state: RootState) => state.filter
  );

  const lookUpJenisOrderan = [
    {
      columns: [{ key: 'nama', name: 'JENIS ORDERAN' }],
      labelLookup: 'JENIS ORDERAN LOOKUP',
      selectedRequired: false,
      endpoint: 'JenisOrderan',
      label: 'JENIS ORDER FILTER GRID',
      singleColumn: true,
      pageSize: 20,
      postData: 'nama',
      dataToPost: 'id'
    }
  ];

  const onSubmit = () => {
    setTriggerValidation(true);
  };

  const handleValidationResult = (isValid: boolean) => {
    if (!triggerValidation) return;
    setTriggerValidation(false);
    if (!isValid) return;

    // ✅ Atomic commit — satu action, satu re-render
    dispatch(commitFilter());
  };

  return (
    <div className={`flex h-[100%] w-full justify-center`}>
      <div className="flex h-[100%]  w-full flex-col rounded-sm border border-border bg-background-grid-header">
        <div className="flex h-[30px] w-full flex-row items-center rounded-t-sm border-b border-border px-2" />
        <div className="bg-background-header p-4">
          <PeriodeValidation
            label="periode"
            date1={pending.tglDari}
            date2={pending.tglSampai}
            onDate1Change={(val) => dispatch(setPending({ tglDari: val }))}
            onDate2Change={(val) => dispatch(setPending({ tglSampai: val }))}
            onValidationChange={handleValidationResult}
            triggerValidation={triggerValidation}
          />

          <div className="mt-2 flex w-[50%] flex-col items-center justify-between lg:flex-row">
            <label htmlFor="" className="w-full text-sm font-bold lg:w-[20%]">
              Jenis Orderan:
              <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
            </label>
            <div className="relative w-full lg:w-[60%]">
              {lookUpJenisOrderan.map((props, index) => (
                <LookUp
                  key={index}
                  {...props}
                  onSelectRow={(val) => {
                    dispatch(setSelectedJenisOrderan(val.id));
                    dispatch(setSelectedJenisOrderanNama(val.nama));
                  }}
                  onClear={() => {
                    dispatch(setSelectedJenisOrderan(null));
                    dispatch(setSelectedJenisOrderanNama(''));
                  }}
                  lookupValue={(value: any) => {
                    dispatch(setSelectedJenisOrderan(value));
                  }}
                  lookupNama={
                    JENISORDERMUATANNAMA || String(selectedJenisOrderanNama)
                  }
                />
              ))}
            </div>
          </div>

          <Button
            variant="default"
            className="mt-2 flex flex-row items-center justify-center"
            onClick={onSubmit}
          >
            <IoMdRefresh />
            <p style={{ fontSize: 12 }} className="font-normal">
              Reload
            </p>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterGrid;
