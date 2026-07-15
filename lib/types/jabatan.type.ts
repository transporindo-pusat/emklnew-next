import { IMeta } from './error.type';

export interface IJabatan {
  id: string;
  nama: string;
  keterangan: string;
  text: string;
  statusaktif: string;
  divisi: string;
  divisi_id: number;
  created_at: string;
  updated_at: string;
}
export interface IAllJabatan {
  data: IJabatan[];
  type: string;
  pagination: IMeta;
}
