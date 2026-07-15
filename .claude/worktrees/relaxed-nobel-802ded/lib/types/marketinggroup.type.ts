import { IMeta } from './error.type';
export interface IMarketingGroup {
  id: string;
  marketing_id: number;
  marketing_nama: string;
  statusaktif: string;
  statusaktif_text: string;
  created_at: string;
  updated_at: string;
}

export interface IAllMarketingGroup {
  data: IMarketingGroup[];
  type: string;
  pagination: IMeta;
}
