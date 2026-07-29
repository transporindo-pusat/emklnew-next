import { IMeta } from './error.type';

export interface GroupInvoice {
  id: string;
  kode: string;
  keterangan: string;
  statusaktif: string;
  statusaktif_nama: string;
  modifiedby: string;
  created_at: string;
  updated_at: string;
}

export interface IAllGroupInvoice {
  data: GroupInvoice[];
  pagination: IMeta;
}

export interface IErrorResponse {
  message: string;
  errors: Record<string, string[]>;
  statusCode: number;
}

export const filterGroupInvoice = {
  kode: '',
  keterangan: '',
  statusaktif_nama: '',
  modifiedby: '',
  created_at: '',
  updated_at: ''
};
