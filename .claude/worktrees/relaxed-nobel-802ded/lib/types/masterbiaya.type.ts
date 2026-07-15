import { IMeta } from './error.type';

export interface IMasterBiaya {
  // id & *_id adalah varchar(200) di DB, bukan angka.
  id: string;
  tujuankapal_id: string;
  tujuankapal_text: string;

  sandarkapal_id: string;
  sandarkapal_text: string;

  pelayaran_id: string;
  pelayaran_text: string;

  container_id: string;
  container_text: string;

  biayaemkl_id: string;
  biayaemkl_text: string;

  jenisorder_id: string;
  jenisorderan_text: string;

  tglberlaku: string;

  nominal: string;

  statusaktif: string;
  text: string;
}

export interface IAllMasterBiaya {
  data: IMasterBiaya[];
  type: string;
  pagination: IMeta;
}
