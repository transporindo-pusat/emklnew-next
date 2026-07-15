import { IMeta } from './error.type';

export interface JenisProsesFee {
  id: string;
  nama: string;
  keterangan: string;
  statusaktif: string;
  statusaktif_nama: string;
  modifiedby: string;
  created_at: string;
  updated_at: string;
}

export interface IAllJenisProsesFee {
  data: JenisProsesFee[];
  pagination: IMeta;
}

export interface IErrorResponse {
  message: string;
  errors: Record<string, string[]>;
  statusCode: number;
}

export const filterJenisProsesFee = {
  nama: '',
  keterangan: '',
  statusaktif_nama: '',
  modifiedby: '',
  created_at: '',
  updated_at: ''
};
