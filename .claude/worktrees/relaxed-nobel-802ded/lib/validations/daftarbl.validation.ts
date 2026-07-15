import { REQUIRED_FIELD } from '@/constants/validation';
import { z } from 'zod';
import { dynamicRequiredMessage } from '../utils';

export const daftarblSchema = z.object({
  // id & statusaktif menyimpan id parameter (varchar UUID), bukan angka.
  // Jangan z.number() — lookup mengirim id berupa string sehingga z.number()
  // menolaknya dan form gagal submit secara diam-diam (tidak bisa save).
  id: z.string().nullable().optional(),
  nama: z.string().nonempty({ message: dynamicRequiredMessage('NAMA') }),

  keterangan: z
    .string()
    .nonempty({ message: dynamicRequiredMessage('KETERANGAN') }),

  statusaktif: z
    .string()
    .min(1, { message: dynamicRequiredMessage('STATUSAKTIF') }),

  statusaktif_text: z.string().nullable().optional()
});

export type DaftarblInput = z.infer<typeof daftarblSchema>;
