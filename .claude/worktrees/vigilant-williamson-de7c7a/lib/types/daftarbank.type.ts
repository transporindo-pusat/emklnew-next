import { IMeta } from './error.type';
export interface IDaftarBank {
  id: string;
  nama: string;
  keterangan: string;
  statusaktif: string;
  statusaktif_text: string;
  created_at: string;
  updated_at: string;
}

export interface IAllDaftarBank {
  data: IDaftarBank[];
  type: string;
  pagination: IMeta;
}
