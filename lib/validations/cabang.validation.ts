import { REQUIRED_FIELD } from '@/constants/validation';
import { z } from 'zod';
import { dynamicRequiredMessage } from '../utils';

export const cabangSchema = z.object({
  // id = varchar UUID, bukan angka (jangan z.number()).
  id: z.string().nullable().optional(),
  kodecabang: z
    .string()
    .nonempty({ message: dynamicRequiredMessage('KODE CABANG') }),
  nama: z.string().nonempty({ message: dynamicRequiredMessage('NAMA') }),
  keterangan: z
    .string()
    .nonempty({ message: dynamicRequiredMessage('KETERANGAN') }),
  statusaktif: z
    .string()
    .min(1, { message: dynamicRequiredMessage('STATUSAKTIF') }),
  statusaktif_text: z.string().nullable().optional(),
  modifiedby: z.string().optional()
});
export type CabangInput = z.infer<typeof cabangSchema>;
