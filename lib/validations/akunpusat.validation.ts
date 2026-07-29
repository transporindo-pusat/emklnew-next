import { REQUIRED_FIELD } from '@/constants/validation';
import { z } from 'zod';
import { dynamicRequiredMessage } from '../utils';

export const AkunpusatSchema = z.object({
  // id/cabang_id/type_id kolomnya TEXT berisi uuid di PG. z.number()/
  // z.coerce.number() mengubahnya jadi NaN sehingga validasi gagal dan submit
  // batal tanpa request apa pun ke backend. Hanya `level` yang benar-benar
  // numerik (bigint).
  id: z.string().nullable().optional(),
  coa: z.string().min(1, { message: dynamicRequiredMessage('COA') }),
  parent: z.string().nonempty({ message: dynamicRequiredMessage('PARENT') }),
  keterangancoa: z.string().nullable().optional(),
  level: z.coerce
    .number({
      required_error: dynamicRequiredMessage('LEVEL'),
      invalid_type_error: dynamicRequiredMessage('LEVEL')
    })
    .min(1, { message: dynamicRequiredMessage('LEVEL') }),
  // statusaktif menyimpan id parameter (varchar UUID), bukan angka.
  statusaktif: z
    .string()
    .min(1, { message: dynamicRequiredMessage('STATUS AKTIF') }),
  cabang_id: z
    .string({
      required_error: dynamicRequiredMessage('CABANG ID'),
      invalid_type_error: dynamicRequiredMessage('CABANG ID')
    })
    .min(1, { message: dynamicRequiredMessage('CABANG ID') }),
  type_id: z
    .string({
      required_error: dynamicRequiredMessage('TYPE AKUNTANSI'),
      invalid_type_error: dynamicRequiredMessage('TYPE AKUNTANSI')
    })
    .min(1, { message: dynamicRequiredMessage('TYPE AKUNTANSI') }),
  type_nama: z.string().nullable().optional(),
  cabang_nama: z.string().nullable().optional(),
  statusaktif_nama: z.string().nullable().optional()
});

export type AkunpusatInput = z.infer<typeof AkunpusatSchema>;
