import { IMeta } from './error.type';

export interface IDivisi {
  id: string;
  nama: string;
  keterangan: string;
  text: string;
  statusaktif: string;
  created_at: string;
  updated_at: string;
}
export interface IAllDivisi {
  data: IDivisi[];
  type: string;
  pagination: IMeta;
}
