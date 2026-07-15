import { IMeta } from './error.type';
export interface IJenisOrderan {
  id: string;
  nama: string;
  keterangan: string;

  statusaktif: string; // id parameter (varchar UUID)
  statusaktif_text: string;
  text?: string; // teks status aktif (par.text)
  memo?: string; // memo status aktif (JSON) — dipakai render badge di grid

  statusformat: string; // id parameter (varchar UUID)
  format_nama: string | null;

  modifiedby?: string;
  created_at: string;
  updated_at: string;
}

export interface IAllJenisOrderan {
  data: IJenisOrderan[];
  type: string;
  pagination: IMeta;
}
