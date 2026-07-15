import { z } from 'zod';
import { REQUIRED_FIELD } from '@/constants/validation';
import { dynamicRequiredMessage } from '../utils';
import { detailsSchema } from './marketing.validation';
export const ConsigneeDetailSchema = z.object({
  keterangan: z.string().min(1, { message: REQUIRED_FIELD })
});
export type ConsigneeDetailInput = z.infer<typeof ConsigneeDetailSchema>;
export const ConsigneeHargaJualSchema = z.object({
  // container_id = id container = varchar(200) UUID (mis. '02-...'), BUKAN numerik.
  // z.coerce.number() lama mengubah UUID → NaN → .min(1) gagal → array hargajual
  // tolak → form consignee tak bisa disimpan. Validasi sebagai string non-kosong.
  container_id: z
    .string({
      required_error: dynamicRequiredMessage('CONTAINER'),
      invalid_type_error: dynamicRequiredMessage('CONTAINER')
    })
    .min(1, { message: dynamicRequiredMessage('CONTAINER') }),
  // nominal memang numerik (dari InputCurrency/parseCurrency) → tetap number.
  nominal: z.coerce.number().nullable().optional(),
  container_nama: z.string().nullable().optional()
});
export const ConsigneeSchema = z.object({
  // shipper_id & tujuankapal_id = varchar(200) UUID, sama seperti container_id.
  shipper_id: z
    .string({
      required_error: dynamicRequiredMessage('SHIPPER'),
      invalid_type_error: dynamicRequiredMessage('SHIPPER')
    })
    .min(1, { message: dynamicRequiredMessage('SHIPPER') }),
  shipper_nama: z.string().nullable().optional(),
  namaconsignee: z.string().nullable().optional(),
  tujuankapal_id: z
    .string({
      required_error: dynamicRequiredMessage('TUJUAN KAPAL'),
      invalid_type_error: dynamicRequiredMessage('TUJUAN KAPAL')
    })
    .min(1, { message: dynamicRequiredMessage('TUJUAN KAPAL') }),
  tujuankapal_nama: z.string().nullable().optional(),
  details: z.array(ConsigneeDetailSchema).optional().nullable(),
  hargajual: z.array(ConsigneeHargaJualSchema).optional().nullable()
});

export type ConsigneeInput = z.infer<typeof ConsigneeSchema>;
