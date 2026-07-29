import { z } from 'zod';
import { dynamicRequiredMessage } from '../utils';
import { REQUIRED_FIELD } from '@/constants/validation';

export const marketinggroupSchema = z.object({
  id: z.string().nullable().optional(),
  // marketinggroup.marketing_id kolomnya TEXT (isinya angka lama sebagai
  // string: '60', '113'). z.coerce.number() lolos validasi TAPI mengubah nilai
  // jadi number, sedangkan DTO backend mewajibkan z.string() → 400 "Expected
  // string, received number" yang tak tampil di layar. Kirim apa adanya.
  marketing_id: z
    .string({
      required_error: dynamicRequiredMessage('MARKETING'),
      invalid_type_error: dynamicRequiredMessage('MARKETING')
    })
    .min(1, { message: dynamicRequiredMessage('MARKETING') }),
  marketing_nama: z.string().optional(),
  // statusaktif menyimpan id parameter (varchar UUID), bukan angka.
  statusaktif: z
    .string()
    .min(1, { message: dynamicRequiredMessage('STATUS AKTIF') }),
  statusaktif_text: z.string().optional()
});
export type MarketingGroupInput = z.infer<typeof marketinggroupSchema>;
