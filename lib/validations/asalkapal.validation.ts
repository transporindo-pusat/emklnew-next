import { REQUIRED_FIELD } from '@/constants/validation';
import { z } from 'zod';
import { dynamicRequiredMessage } from '../utils';

export const asalkapalSchema = z.object({
  nominal: z.string().nonempty({ message: dynamicRequiredMessage('NOMINAL') }),

  keterangan: z
    .string()
    .nonempty({ message: dynamicRequiredMessage('KETERANGAN') }),

  statusaktif: z.string()
    .min(1, { message: dynamicRequiredMessage('STATUSAKTIF') }),

  statusaktif_nama: z
    .string()
    .nullable()
    .optional(),

  // cabang_id & container_id adalah id VARCHAR/UUID (mis.
  // "02-E4CF9E01-D7B3-A97B-AD54-FEBE9C4FAF39"), bukan angka — kolomnya bertipe
  // `text` di Postgres dan LookUp mengisinya lewat forms.setValue(field, id)
  // tanpa konversi. Selama dideklarasikan z.number(), zod menolak nilai dari
  // LookUp sehingga handleSubmit TIDAK PERNAH memanggil onSubmit: tombol SAVE
  // terlihat "tidak melakukan apa-apa" (tidak ada request, tidak ada pesan
  // error karena LookUp tidak merender FormMessage). Samakan dengan statusaktif.
  cabang_id: z
    .string()
    .min(1, { message: dynamicRequiredMessage('CABANG') }),

  cabang: z
    .string()
    .nullable()
    .optional(),

  container_id: z
    .string()
    .min(1, { message: dynamicRequiredMessage('CONTAINER') }),

  container: z
    .string()
    .nullable()
    .optional()
});

export type AsalKapalInput = z.infer<typeof asalkapalSchema>;
