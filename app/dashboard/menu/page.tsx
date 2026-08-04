'use client';

import PageContainer from '@/components/layout/page-container';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import GridMenu from './components/GridMenu';
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
import { IParameter } from '@/lib/types/parameter.type';

const Page = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fieldLength('menus');
        dispatch(setFieldLength(result.data));

        // Prefetch parameter STATUS AKTIF ke lookup store — sama seperti
        // halaman alat bayar — supaya LookUp/FilterOptions status aktif punya
        // data + nilai default sejak awal.
        const [getStatusAktifLookup] = await Promise.all([
          getParameterFn({ isLookUp: 'true' })
        ]);

        if (
          getStatusAktifLookup.type === 'local' &&
          getStatusAktifLookup.data
        ) {
          const grpsToFilter = ['STATUS AKTIF'];

          grpsToFilter.forEach((grp) => {
            const filteredData = getStatusAktifLookup.data.filter(
              (item: IParameter) => item.grp === grp
            );

            if (filteredData.length > 0) {
              dispatch(setData({ key: grp, data: filteredData }));
              dispatch(setType({ key: grp, type: getStatusAktifLookup.type }));

              const defaultItem = filteredData.find(
                (item: IParameter) => item.default === 'YA'
              );

              const defaultValue = defaultItem
                ? String(defaultItem.default)
                : '';

              dispatch(setDefault({ key: grp, isdefault: defaultValue }));
            }
          });
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
      }
    };

    fetchData();
  }, [dispatch]);
  return (
    <PageContainer scrollable>
      <div className="grid h-fit grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-10 h-[500px]">
          <GridMenu />
        </div>
      </div>
    </PageContainer>
  );
};

export default Page;
