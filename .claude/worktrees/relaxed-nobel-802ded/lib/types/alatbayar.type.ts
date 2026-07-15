import { IMeta } from './error.type';

export interface IAlatBayar {
  id: string; // Primary key (varchar(200))
  uuid: string; // Unique identifier
  nama: string; // Nama (nvarchar(max))
  keterangan: string; // Keterangan (nvarchar(max))

  statuslangsungcair?: string; // Status Langsung Cair (id parameter varchar)
  statuslangsungcair_text?: string;
  statuslangsungcair_uuid?: string;

  statusdefault?: string; // Status Default (id parameter varchar)
  statusdefault_text?: string;
  statusdefault_uuid?: string;

  statusbank?: string; // Status Bank (id parameter varchar)
  statusbank_text?: string;
  statusbank_uuid?: string;

  statusaktif?: string; // Status Aktif (id parameter varchar)
  text?: string; // Status Aktif text
  statusaktif_uuid?: string;

  info?: string; // Info (nvarchar(max))
  modifiedby?: string; // Modified by (varchar(200))
  editing_by?: string; // Editing by (varchar(200))
  editing_at?: string; // Editing at (datetime)
  created_at: string; // Created at (datetime)
  updated_at: string; // Updated at (datetime)
}
export interface IAllAlatBayar {
  data: IAlatBayar[];
  type: string;
  pagination: IMeta;
}
