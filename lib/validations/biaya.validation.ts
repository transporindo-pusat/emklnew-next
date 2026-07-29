import { z } from 'zod';
import { REQUIRED_FIELD } from '@/constants/validation';
import { dynamicRequiredMessage } from '../utils';

export const BiayaSchema = z.object({
  id: z.string().nullable().optional(),
  nama: z.string().nonempty({ message: dynamicRequiredMessage('NAMA') }),
  keterangan: z
    .string()
    .trim()
    .nonempty({ message: dynamicRequiredMessage('KETERANGAN') }),

  coa: z.string().nonempty({ message: dynamicRequiredMessage('COA') }),
  coa_text: z.string().nullable().optional(),

  coahut: z
    .string()
    .nonempty({ message: dynamicRequiredMessage('COA HUTANG') }),
  coahut_text: z.string().nullable().optional(),

  jenisorder_id: z.string().nullable().optional(),
  jenisorderan_text: z.string().nullable().optional(),

  statusaktif: z.string().min(1, { message: REQUIRED_FIELD }),
  text: z.string().nullable().optional()
});

export type BiayaInput = z.infer<typeof BiayaSchema>;
