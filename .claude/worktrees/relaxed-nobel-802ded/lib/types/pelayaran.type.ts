import { IMeta } from './error.type';
export interface IPelayaran {
  id: string;
  nama: string;
  keterangan: string;
  statusaktif: string;
  statusaktif_text: string;
  created_at: string;
  updated_at: string;
}

export interface IAllPelayaran {
  data: IPelayaran[];
  type: string;
  pagination: IMeta;
}
