'use client';

// HALAMAN SEMENTARA untuk verifikasi manual LookUp bertipe 'local'.
// Hapus setelah selesai dipakai.
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import LookUp from '@/components/custom-ui/LookUp';
import { setData, setType } from '@/lib/store/lookupSlice/lookupSlice';

const LOCAL_ROWS = [
  { id: '1', text: 'AKTIF' },
  { id: '2', text: 'TIDAK AKTIF' },
  { id: '3', text: 'PENDING' },
  { id: '4', text: 'BATAL' },
  { id: '5', text: 'SELESAI' }
];

export default function LookupSandboxPage() {
  const dispatch = useDispatch();
  const [picked, setPicked] = useState<string | number | null>(null);

  useEffect(() => {
    dispatch(setData({ key: 'STATUS SANDBOX', data: LOCAL_ROWS }));
    dispatch(setType({ key: 'STATUS SANDBOX', type: 'local' }));
  }, [dispatch]);

  return (
    <div className="w-[600px] p-10">
      <h1 className="mb-4 text-lg font-bold">LookUp local sandbox</h1>
      <LookUp
        columns={[{ key: 'text', name: 'NAMA' }]}
        label="STATUS SANDBOX"
        labelLookup="STATUS SANDBOX LOOKUP"
        singleColumn
        postData="text"
        dataToPost="id"
        lookupValue={(v) => setPicked(v)}
      />
      <p className="mt-4 text-sm" id="picked-value">
        picked: {String(picked)}
      </p>
    </div>
  );
}
