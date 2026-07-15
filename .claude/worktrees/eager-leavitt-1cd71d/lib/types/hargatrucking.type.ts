import { IMeta } from './error.type';

export interface IHargatrucking {
  id: string;

  tujuankapal_id: number;
  tujuankapal_text: string;

  emkl_id: number;
  emkl_text: string;

  keterangan: string;

  container_id: number;
  container_text: string;

  jenisorder_id: string;
  jenisorderan_text: string;

  nominal: string;

  statusaktif: string;
  text: string;

  created_at: string;
  updated_at: string;
}
export interface IAllHargatrucking {
  data: IHargatrucking[];
  type: string;
  pagination: IMeta;
}
