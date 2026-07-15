import { IMeta } from './error.type';

export interface IKapal {
  id: string;
  nama: string;
  keterangan: string;
  text: string;
  statusaktif: string;
  pelayaran: string;
  pelayaran_id: number;
  created_at: string;
  updated_at: string;
}
export interface IAllKapal {
  data: IKapal[];
  type: string;
  pagination: IMeta;
}
