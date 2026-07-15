import { IMeta } from './error.type';

export interface ManagerMarketingHeader {
  id: string;
  nama: string;
  keterangan: string;
  minimalprofit: string;
  statusmentor: string | null;
  statusmentor_text: string;
  statusleader: string | null;
  statusleader_text: string;
  statusaktif: string | null;
  text: string;
  info: string | null;
  modifiedby: string | null;
  created_at: string;
  updated_at: string;
}
export interface ManagerMarketingDetail {
  id: number | string;
  managermarketing_id: number | null;
  nominalawal: string;
  nominalakhir: string;
  persentase: string;
  statusaktif: string | null;
  text: string;
  info: string | null;
  modifiedby: string | null;
  created_at: string;
  updated_at: string;
  [key: string]: string | number | boolean | null | undefined;
}
export interface IAllManagerMarketingHeader {
  data: ManagerMarketingHeader[];
  type: string;
  pagination: IMeta;
}
export interface IAllManagerMarketingDetail {
  data: ManagerMarketingDetail[];
  type: string;
  pagination: IMeta;
}
export const filterManagerMarketing = {
  nama: '',
  keterangan: '',
  minimalprofit: '',
  statusmentor: null,
  statusleader: null,
  statusaktif: null,
  modifiedby: '',
  created_at: '',
  updated_at: ''
};
