import { z } from 'zod';
import { dynamicRequiredMessage } from '../utils';
export const pengeluaranDetailSchema = z.object({
  // id pengeluarandetail = varchar(200) di DB (UUID). Jangan coerce ke number,
  // karena baris existing saat edit punya id UUID -> Number(uuid) = NaN -> Zod
  // tolak -> form gagal validasi diam-diam.
  id: z.union([z.string(), z.number()]).optional(),
  coadebet: z.string().nullable(),
  coadebet_text: z.string().nullable(),
  keterangan: z.string().nullable(),
  nominal: z
    .string()
    .trim()
    .nonempty({ message: dynamicRequiredMessage('NOMINAL') })
    .refine((val) => Number(val) !== 0, {
      message: 'Nominal wajib di isi'
    }),
  dpp: z.string().nullable(),

  transaksibiaya_nobukti: z.string().nullable(),
  transaksilain_nobukti: z.string().nullable(),
  noinvoiceemkl: z.string().nullable(),
  tglinvoiceemkl: z.string().nullable(),
  nofakturpajakemkl: z.string().nullable(),
  perioderefund: z.string().nullable()
});
export type PengeluaranDetailInput = z.infer<typeof pengeluaranDetailSchema>;

export const pengeluaranHeaderSchema = z.object({
  nobukti: z.string().nullable(),
  tglbukti: z.string().nullable(),
  relasi_id: z.string().nullable(),
  relasi_text: z.string().nullable().optional(),
  keterangan: z.string().nullable(),
  bank_id: z.string().nullable(),
  bank_text: z.string().nullable().optional(),
  postingdari: z.string().nullable().optional(),
  coakredit: z.string().nullable(),
  coakredit_text: z.string().nullable().optional(),
  dibayarke: z.string().nullable(),
  alatbayar_id: z.string().nullable(),
  alatbayar_text: z.string().nullable().optional(),
  nowarkat: z.string().nullable(),
  tgljatuhtempo: z.string().nullable(),
  daftarbank_id: z.string().nullable(),
  daftarbank_text: z.string().nullable().optional(),
  statusformat: z.string().nullable(),
  details: z.array(pengeluaranDetailSchema).min(1)
});
export type PengeluaranHeaderInput = z.infer<typeof pengeluaranHeaderSchema>;
