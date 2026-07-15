import { IMeta } from './error.type';

export interface IJenisseal {
  id: string;
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
export interface IAllJenisseal {
  data: IJenisseal[];
  type: string;
  pagination: IMeta;
}
