import { REQUIRED_FIELD } from '@/constants/validation';
import { z } from 'zod';
import { dynamicRequiredMessage } from '../utils';

export const ComoditySchema = z.object({
  // id & statusaktif menyimpan id parameter (varchar UUID), bukan angka.
  // Jangan z.number() — lookup mengirim id berupa string sehingga z.number()
  // menolaknya dan form gagal submit secara diam-diam (tidak bisa save).
  id: z.string().nullable().optional(),
  keterangan: z
    .string()
    .nonempty({ message: dynamicRequiredMessage('KETERANGAN') }), // Keterangan wajib diisi
  rate: z.coerce
    .string({
      required_error: dynamicRequiredMessage('RATE'),
      invalid_type_error: dynamicRequiredMessage('RATE')
    })
    .refine((val) => val !== 'undefined' && val.trim() !== '', {
      message: dynamicRequiredMessage('RATE')
    }),
  statusaktif: z.string().min(1, { message: REQUIRED_FIELD }), // id parameter status aktif (varchar)
  statusaktif_text: z.string().nullable().optional()
});

export type ComodityInput = z.infer<typeof ComoditySchema>;
