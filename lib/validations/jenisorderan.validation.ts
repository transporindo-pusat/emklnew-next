import { REQUIRED_FIELD } from '@/constants/validation';
import { z } from 'zod';
import { dynamicRequiredMessage } from '../utils';

export const jenisorderanSchema = z.object({
  // id menyimpan id varchar UUID, bukan angka. z.number() membuat Number(uuid)
  // = NaN sehingga form & self-exclude uniqueness meleset.
  id: z.string().nullable().optional(),
  nama: z.string().nonempty({ message: dynamicRequiredMessage('NAMA') }), // Nama wajib diisi
  keterangan: z
    .string()
    .nonempty({ message: dynamicRequiredMessage('KETERANGAN') }), // Keterangan opsional
  statusaktif: z.string().min(1, `${REQUIRED_FIELD}`), // Status aktif wajib diisi
  statusaktif_text: z.string().nullable().optional(), // Email wajib diisi

  statusformat: z
    .string()
    .min(1, { message: dynamicRequiredMessage('FORMAT') }),
  statusformat_nama: z.string().nullable().optional()
});
export type JenisOrderanInput = z.infer<typeof jenisorderanSchema>;
