import { IMeta } from './error.type';
export interface IJenisBiayaMarketing {
  id: string;
  nama: string;
  keterangan: string;
  statusaktif: string;
  statusaktif_text: string;
  created_at: string;
  updated_at: string;
}

export interface IAllJenisBiayaMarketing {
  data: IJenisBiayaMarketing[];
  pagination: IMeta;
}
