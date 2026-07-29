'use client';

import PageContainer from '@/components/layout/page-container';
import GridKaryawan from './components/GridKaryawan';
import { fieldLength } from '@/lib/apis/field-length.api';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setFieldLength } from '@/lib/store/field-length/fieldLengthSlice';
import { getParameterFn } from '@/lib/apis/parameter.api';
import {
  setData,
  setDefault,
  setType
} from '@/lib/store/lookupSlice/lookupSlice';
import { getJabatanFn } from '@/lib/apis/jabatan.api';

const Page = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fieldLength('karyawan');
        dispatch(setFieldLength(result.data));

        const [getJabatanLookup, getStatusAktifLookup] = await Promise.all([
          getJabatanFn({ isLookUp: 'true' }),
          getParameterFn({ isLookUp: 'true' })
        ]);

        // JABATAN
        if (getJabatanLookup.type === 'local') {
          dispatch(setData({ key: 'JABATAN', data: getJabatanLookup.data }));
          const defaultValue =
            getJabatanLookup.data
              .map((item: any) => item.default)
              .find((val: any) => val !== null) || '';

          dispatch(setDefault({ key: 'JABATAN', isdefault: defaultValue }));
        }
        dispatch(setType({ key: 'JABATAN', type: getJabatanLookup.type }));

        if (getStatusAktifLookup.type === 'local') {
          const grpsToFilter = ['STATUS AKTIF'];

          grpsToFilter.forEach((grp) => {
            const filteredData = getStatusAktifLookup.data.filter(
              (item: any) => item.grp === grp
            );
            //

            dispatch(setData({ key: grp, data: filteredData }));
            dispatch(setType({ key: grp, type: getStatusAktifLookup.type }));

            const defaultValue = filteredData
              .map((item: any) => item.default)
              .find((val: any) => val !== null || '');

            dispatch(setDefault({ key: grp, isdefault: String(defaultValue) }));
          });
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [dispatch]);

  return (
    <PageContainer scrollable>
      <div className="grid h-fit grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-10 h-[500px]">
          <GridKaryawan />
        </div>
      </div>
    </PageContainer>
  );
};

export default Page;
