'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fieldLength } from '@/lib/apis/field-length.api';
import { getParameterFn } from '@/lib/apis/parameter.api';
import GridJenisOrderan from './components/GridJenisOrderan';
import PageContainer from '@/components/layout/page-container';
import { setFieldLength } from '@/lib/store/field-length/fieldLengthSlice';
import {
  setData,
  setType,
  setDefault
} from '@/lib/store/lookupSlice/lookupSlice';

interface ApiResponse {
  type: string;
  data: any; // Define a more specific type for data if possible
}

const Page = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fieldLength('jenisorderan');
        dispatch(setFieldLength(result.data));

        const [getStatusAktifLookup] = await Promise.all<ApiResponse>([
          getParameterFn({ isLookUp: 'true' })
        ]);

        if (
          getStatusAktifLookup.type === 'local' &&
          getStatusAktifLookup.data
        ) {
          const grpsToFilter = ['STATUS AKTIF'];

          grpsToFilter.forEach((grp) => {
            const filteredData = getStatusAktifLookup.data.filter(
              (item: any) => item.grp === grp
            );

            dispatch(setData({ key: grp, data: filteredData }));
            dispatch(setType({ key: grp, type: getStatusAktifLookup.type }));

            // Baris non-default menyimpan default sebagai string kosong, jadi
            // `!== null` salah memilih baris pertama. Pilih baris yang
            // benar-benar bertanda default 'YA'.
            const defaultItem = filteredData.find(
              (item: any) => item.default === 'YA'
            );

            dispatch(
              setDefault({
                key: grp,
                isdefault: defaultItem ? String(defaultItem.default) : ''
              })
            );
          });

          // `formatData` adalah hasil .filter() = ARRAY, bukan { data }. Dulu
          // baris di bawah memakai `formatData.data.map` -> undefined.map ->
          // TypeError, sehingga setDefault FORMAT tidak pernah jalan & field
          // FORMAT (required) tidak ter-default -> form tidak bisa save.
          const formatData = getStatusAktifLookup.data.filter(
            (item: any) => item.kelompok != ''
          );
          dispatch(setData({ key: 'FORMAT', data: formatData }));
          dispatch(setType({ key: 'FORMAT', type: getStatusAktifLookup.type }));
          const formatDefaultItem = formatData.find(
            (item: any) => item.default === 'YA'
          );
          dispatch(
            setDefault({
              key: 'FORMAT',
              isdefault: formatDefaultItem
                ? String(formatDefaultItem.default)
                : ''
            })
          );
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
          <GridJenisOrderan />
        </div>
      </div>
    </PageContainer>
  );
};

export default Page;
