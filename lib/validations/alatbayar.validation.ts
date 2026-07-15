import { z } from 'zod';
import { REQUIRED_FIELD } from '@/constants/validation';
import { dynamicRequiredMessage } from '../utils';

export const AlatbayarSchema = z.object({
  // id & status* menyimpan id parameter (varchar UUID), bukan angka.
  id: z.string().nullable().optional(),
  uuid: z.string().nullable().optional(),

  nama: z.string().nonempty({ message: dynamicRequiredMessage('NAMA') }),
  keterangan: z
    .string()
    .trim()
    .nonempty({ message: dynamicRequiredMessage('KETERANGAN') }),

  statuslangsungcair: z.string().min(1, { message: REQUIRED_FIELD }),
  statuslangsungcair_uuid: z.string().nullable().optional(),
  statuslangsungcair_text: z.string().nullable().optional(),

  statusdefault: z.string().min(1, { message: REQUIRED_FIELD }),
  statusdefault_uuid: z.string().nullable().optional(),
  statusdefault_text: z.string().nullable().optional(),

  statusbank: z.string().min(1, { message: REQUIRED_FIELD }),
  statusbank_uuid: z.string().nullable().optional(),
  statusbank_text: z.string().nullable().optional(),

  statusaktif: z.string().min(1, { message: REQUIRED_FIELD }),
  statusaktif_uuid: z.string().nullable().optional(),
  text: z.string().nullable().optional()
});

export type AlatbayarInput = z.infer<typeof AlatbayarSchema>;
