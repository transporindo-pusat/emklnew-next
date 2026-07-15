import { IMeta } from './error.type';

export interface IOffdays {
  id: string;
  tgl: string;
  keterangan: string;
  statusaktif: string;
  modifiedby: number;
  created_at: string;
  updated_at: string;
}
export interface IAllOffdays {
  data: IOffdays[];
  pagination: IMeta;
}
