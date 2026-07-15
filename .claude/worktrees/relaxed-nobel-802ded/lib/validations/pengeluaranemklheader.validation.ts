import { z } from 'zod';

export const pengeluaranemklheaderDetailSchema = z.object({
  id: z.number().optional(),
  noseal: z.string().optional(),
  keterangan: z.string().nullable(),
  nominal: z.string().nullable()
});
export type PengeluaranemklheaderDetailInput = z.infer<
  typeof pengeluaranemklheaderDetailSchema
>;

export const pengeluaranemklheaderHeaderSchema = z.object({
  nobukti: z.string().nullable(),
  tglbukti: z.string().nullable(),
  tgljatuhtempo: z.string().nullable(),
  keterangan: z.string().nullable(),
  // karyawan_id & bank_id = varchar(200) UUID, bukan number (lihat catatan
  // FK varchar). z.number() menolak UUID / menerima NaN → id hilang saat simpan.
  karyawan_id: z.string().nullable(),
  karyawan_nama: z.string().nullable().optional(),
  jenisposting: z.number().nullable(),
  jenisposting_nama: z.string().nullable().optional(),
  // jenisseal_id = varchar(200) UUID (di-set raw dari lookup), bukan number.
  jenisseal_id: z.string().nullable().optional(),
  jenisseal_nama: z.string().nullable().optional(),
  pengeluaran_nobukti: z.string().nullable().optional(),
  hutang_nobukti: z.string().nullable().optional(),
  bank_id: z.string().nullable(),
  bank_nama: z.string().nullable().optional(),
  statusformat_nama: z.string().nullable().optional(),
  nowarkat: z.string().nullable(),
  // format = pengeluaranemkl.format = varchar(200) UUID parameter, bukan number.
  format: z.string().nullable().optional(),
  coadebet: z.string().nullable().optional(),
  details: z.array(pengeluaranemklheaderDetailSchema).min(1)
});
export type PengeluaranemklheaderHeaderInput = z.infer<
  typeof pengeluaranemklheaderHeaderSchema
>;
