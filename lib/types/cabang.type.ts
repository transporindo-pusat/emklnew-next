import { IMeta } from './error.type';
export interface IAllCabang {
  data: ICabang[];
  type: string;
  pagination: IMeta;
}
export interface ICabang {
  id: string;
  kodecabang: string;
  nama: string;
  keterangan: string;

  statusaktif: string; // id parameter status aktif (varchar UUID), bukan angka
  statusaktif_text: string;
  text?: string; // teks status aktif (par.text)
  memo?: string; // memo status aktif (JSON) — dipakai render badge di grid

  modifiedby?: string;
  created_at: string;
  updated_at: string;
}
