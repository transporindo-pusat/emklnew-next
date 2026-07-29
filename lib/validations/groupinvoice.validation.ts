import { z } from 'zod';
import { dynamicRequiredMessage } from '../utils';

export const groupinvoiceSchema = z.object({
  id: z.string().nullable().optional(),
  kode: z.string().min(1, { message: dynamicRequiredMessage('KODE') }),
  keterangan: z
    .string()
    .nonempty({ message: dynamicRequiredMessage('KETERANGAN') }),
  statusaktif: z.string()
    .min(1, { message: dynamicRequiredMessage('STATUS AKTIF') }),
  statusaktif_nama: z.string().nullable().optional()
});

export type GroupInvoiceInput = z.infer<typeof groupinvoiceSchema>;
