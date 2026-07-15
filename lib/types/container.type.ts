import { IMeta } from './error.type';

export interface IContainer {
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
export interface IAllContainer {
  data: IContainer[];
  type: string;
  pagination: IMeta;
}
