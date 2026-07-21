import { IMeta } from './error.type';

export interface IAsalKapal {
  id: string;
  nominal: number | null;
  keterangan: string;
  text: string;
  statusaktif: string;
  cabang: string;
  cabang_id: string;
  container: string;
  container_id: string;
  created_at: string;
  updated_at: string;
}
export interface IAllAsalKapal {
  data: IAsalKapal[];
  type: string;
  pagination: IMeta;
}
