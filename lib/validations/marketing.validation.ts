import { z } from 'zod';
import { dynamicRequiredMessage } from '../utils';

export const marketingOrderanSchema = z.object({
  id: z.union([z.string(), z.number()]).nullable().optional(),
  nama: z.string().nullable(),
  keterangan: z.string().nullable(),
  singkatan: z.string().nullable(),
  statusaktif: z.string().nullable(),
  statusaktifOrderan_nama: z.string().nullable().optional()
});

// Semua *_id di tabel detail bertipe TEXT di PG (jenisbiayamarketing_id,
// managermarketing_id, jenisprosesfee_id). z.number() menolak nilai dari LookUp
// yang berupa string sehingga handleSubmit gagal diam-diam — tombol SAVE
// terasa tak bereaksi dan tak ada request sama sekali ke backend.
const detailId = z.union([z.string(), z.number()]).nullable().optional();

export const marketingBiayaSchema = z.object({
  id: detailId,
  jenisbiayamarketing_id: z.string().nullable(),
  jenisbiayamarketing_nama: z.string().nullable().optional(),
  nominal: z.string().nullable(),
  statusaktif: z.string().nullable(),
  statusaktifBiaya_nama: z.string().nullable().optional()
});

export const marketingManagerSchema = z.object({
  id: detailId,
  managermarketing_id: z.string().nullable(),
  managermarketing_nama: z.string().nullable().optional(),
  statusaktif: z.string().nullable(),
  statusaktifManager_nama: z.string().nullable().optional()
});

export const marketingProsesFeeSchema = z.object({
  id: detailId,
  jenisprosesfee_id: z.string().nullable(),
  jenisprosesfee_nama: z.string().nullable().optional(),
  statuspotongbiayakantor: z.string().nullable(),
  statuspotongbiayakantor_nama: z.string().nullable().optional(),
  statusaktif: z.string().nullable(),
  statusaktif_nama: z.string().nullable().optional()
});

export const marketingSchema = z.object({
  nama: z.string().nonempty({ message: dynamicRequiredMessage('NAMA') }),
  kode: z
    .string({
      required_error: dynamicRequiredMessage('KODE MARKETING'),
      invalid_type_error: dynamicRequiredMessage('KODE MARKETING')
    })
    .nonempty({ message: dynamicRequiredMessage('KODE MARKETING') }),
  keterangan: z
    .string()
    .nonempty({ message: dynamicRequiredMessage('KETERANGAN') }),
  statusaktif: z.string()
    .min(1, { message: dynamicRequiredMessage('STATUS AKTIF') }),
  statusaktif_nama: z.string().nullable().optional(),
  email: z
    .string({
      required_error: dynamicRequiredMessage('EMAIL')
    })
    .nonempty({ message: dynamicRequiredMessage('EMAIL') })
    .email({ message: 'Email must be a valid email address' }),
  // karyawan_id = varchar(200) UUID, bukan number. TIDAK wajib diisi.
  karyawan_id: z.string().nullable().optional(),
  karyawan_nama: z.string().nullable().optional(),
  tglmasuk: z
    .string({
      required_error: dynamicRequiredMessage('TGL MASUK'),
      invalid_type_error: dynamicRequiredMessage('TGL MASUK')
    })
    .nonempty({ message: dynamicRequiredMessage('TGL MASUK') }),
  // statustarget: z.string().nullable(),
  statustarget: z.string()
    .min(1, { message: dynamicRequiredMessage('STATUS TARGET') }),
  statustarget_nama: z.string().nullable().optional(),
  // statusbagifee: z.string().nullable(),
  statusbagifee: z.string()
    .min(1, { message: dynamicRequiredMessage('STATUS BAGI FEE') }),
  statusbagifee_nama: z.string().nullable().optional(),
  // statusfeemanager: z.string().nullable(),
  statusfeemanager: z.string()
    .min(1, { message: dynamicRequiredMessage('STATUS FEE MANAGER') }),
  statusfeemanager_nama: z.string().nullable().optional(),
  // TIDAK wajib diisi. Tipenya string (DTO backend juga z.string().nullable());
  // z.number() lama akan mengirim number dan ditolak backend.
  marketinggroup_id: z.string().nullable().optional(),
  marketinggroup_nama: z.string().nullable().optional(),
  // statusprafee: z.string().nullable(),
  statusprafee: z.string()
    .min(1, { message: dynamicRequiredMessage('STATUS PRA FEE') }),
  statusprafee_nama: z.string().nullable().optional(),
  marketingorderan: z.array(marketingOrderanSchema),
  marketingbiaya: z.array(marketingBiayaSchema),
  marketingmanager: z.array(marketingManagerSchema),
  marketingprosesfee: z.array(marketingProsesFeeSchema)
});

export type MarketingInput = z.infer<typeof marketingSchema>;

export const detailsSchema = z.object({
  id: z.number().optional(),
  nominalawal: z
    .string()
    .nonempty({ message: dynamicRequiredMessage('NOMINAL AWAL') }),
  nominalakhir: z
    .string()
    .nonempty({ message: dynamicRequiredMessage('NOMINAL AKHIR') }),
  persentase: z
    .string()
    .nonempty({ message: dynamicRequiredMessage('PERSENTASE') }),
  statusaktif: z.string()
    .min(1, { message: dynamicRequiredMessage('STATUS AKTIF') }),
  statusaktif_nama: z.string().nullable().optional()
});

export const marketingdetailSchema = z.object({
  // sama seperti di atas: kedua kolom bertipe TEXT di PG
  marketing_id: z.string().nullable(),
  marketing_nama: z.string().nullable().optional(),
  marketingprosesfee_id: z.string().nullable(),
  jenisprosesfee_nama: z.string().nullable().optional(),
  statuspotongbiayakantor_nama: z.string().nullable().optional(),
  statusaktif_nama: z.string().nullable().optional(),
  marketingdetail: z.array(detailsSchema)
});

export type MarketingDetailInput = z.infer<typeof marketingdetailSchema>;
