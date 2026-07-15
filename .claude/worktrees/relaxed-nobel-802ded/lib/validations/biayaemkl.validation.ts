import { z } from 'zod';
import { REQUIRED_FIELD } from '@/constants/validation';
import { dynamicRequiredMessage } from '../utils';

export const BiayaemklSchema = z.object({
  id: z.number().nullable().optional(),
  nama: z.string().nonempty({ message: dynamicRequiredMessage('NAMA') }),
  keterangan: z
    .string()
    .trim()
    .nonempty({ message: dynamicRequiredMessage('KETERANGAN') }),

  biaya_id: z.number().min(1, { message: REQUIRED_FIELD }),
  biaya_text: z.string().nullable().optional(),

  coahut: z
    .string()
    .nonempty({ message: dynamicRequiredMessage('COA HUTANG') }),
  coahut_text: z.string().nullable().optional(),

  jenisorder_id: z.string().nullable().optional(),
  jenisorderan_text: z.string().nullable().optional(),

  statusaktif: z.string().min(1, { message: REQUIRED_FIELD }),
  text: z.string().nullable().optional(),

  statusbiayabl: z.string().min(1, { message: REQUIRED_FIELD }),
  statusbiayabl_text: z.string().nullable().optional(),

  statusseal: z.string().min(1, { message: REQUIRED_FIELD }),
  statusseal_text: z.string().nullable().optional(),

  statustagih: z.string().min(1, { message: REQUIRED_FIELD }),
  statustagih_text: z.string().nullable().optional()
});

export type BiayaemklInput = z.infer<typeof BiayaemklSchema>;
