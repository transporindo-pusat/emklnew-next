import { IMeta } from './error.type';

export interface IBiaya {
  id: string;
  nama: string;
  keterangan: string;

  coa: string;
  coa_text: string | null;

  coahut: string;
  coahut_text: string | null;

  jenisorder_id: string | null;
  jenisorderan_text: string;

  statusaktif: string;
  text: string;
}

export interface IAllBiaya {
  data: IBiaya[];
  type: string;
  pagination: IMeta;
}
