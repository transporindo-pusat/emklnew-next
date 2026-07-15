import { IMeta } from './error.type';

export interface ITujuanKapal {
  id: string;
  nama: string;
  kode: string;
  keterangan: string;
  namacabang: string;
  cabang_id: number;
  text: string;
  statusaktif: string;
  order: number;
  created_at: string;
  updated_at: string;
}
export interface IAllTujuanKapal {
  data: ITujuanKapal[];
  type: string;
  pagination: IMeta;
}
