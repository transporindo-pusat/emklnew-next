import { IMeta } from './error.type';

export interface IAkuntansi {
  id: string;
  nama: string;
  keterangan: string;
  text: string;
  statusaktif: string;
  created_at: string;
  updated_at: string;
}
export interface IAllAkuntansi {
  data: IAkuntansi[];
  type: string;
  pagination: IMeta;
}
