import { IMeta } from './error.type';

export interface IBiayaemkl {
  id: string;
  nama: string;
  keterangan: string;

  biaya_id: number | null;
  biaya_text: string;

  coahut: string;
  coahut_text: string | null;

  jenisorder_id: string | null;
  jenisorderan_text: string;

  statusaktif: string;
  text: string;

  statusbiayabl: string;
  statusbiayabl_text: string;

  statusseal: string;
  statusseal_text: string;

  statustagih: string;
  statustagih_text: string;
}

export interface IAllBiayaemkl {
  data: IBiayaemkl[];
  type: string;
  pagination: IMeta;
}
