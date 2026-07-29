import { IMeta } from './error.type';

export interface IKaryawan {
  id: string;
  nama: string;
  keterangan: string;
  kodeabsen: string;
  absen_id: string;
  karyawan_id: string;
  karyawan_nama: string;
  jabatan_id: string;
  jabatan_nama: string;
  text: string;
  statusaktif: string;
  statusaktif_text: string;
  statusaktif_memo: string;
  modifiedby: string;
  created_at: string;
  updated_at: string;
}
export interface IAllKaryawan {
  data: IKaryawan[];
  type: string;
  pagination: IMeta;
}
