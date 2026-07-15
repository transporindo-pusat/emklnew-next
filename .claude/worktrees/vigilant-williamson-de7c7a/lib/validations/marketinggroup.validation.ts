import { z } from 'zod';
import { dynamicRequiredMessage } from '../utils';
import { REQUIRED_FIELD } from '@/constants/validation';

export const marketinggroupSchema = z.object({
  id: z.number().nullable().optional(),
  marketing_id: z.coerce
    .number({
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
