import { REQUIRED_FIELD } from '@/constants/validation';
import { z } from 'zod';
import { dynamicRequiredMessage } from '../utils';

export const jenismuatanSchema = z.object({
  // id & statusaktif menyimpan id parameter (varchar UUID), bukan angka.
  // Jangan z.number() — lookup mengirim id berupa string sehingga z.number()
  // menolaknya dan form gagal submit secara diam-diam (tidak bisa save).
  id: z.string().nullable().optional(),
  nama: z.string().nonempty({ message: dynamicRequiredMessage('NAMA') }), // Nama wajib diisi
  keterangan: z
    .string()
    .nonempty({ message: dynamicRequiredMessage('KETERANGAN') }), // Keterangan wajib diisi
  statusaktif: z.string().min(1, { message: REQUIRED_FIELD }), // id parameter status aktif (varchar)
  statusaktif_text: z.string().nullable().optional()
});
export type JenisMuatanInput = z.infer<typeof jenismuatanSchema>;
