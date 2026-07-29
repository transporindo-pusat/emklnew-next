import { z } from 'zod';
import { dynamicRequiredMessage } from '../utils';

// Semua id/FK di sini bertipe text di PG (lihat memory uuid-as-number-pitfall) —
// jangan pernah membungkusnya dengan Number() saat mengisi form.
export const karyawanSchema = z.object({
  id: z.string().nullable().optional(),
  nama: z.string().nonempty({ message: dynamicRequiredMessage('NAMA') }),

  jabatan_id: z.string().min(1, { message: dynamicRequiredMessage('JABATAN') }),
  jabatan_nama: z.string().nullable().optional(),

  // karyawan_id & absen_id mengacu ke sistem HR eksternal. karyawan_id TIDAK
  // wajib: kolomnya punya FK self-reference ke karyawan(id) sehingga nilai
  // sentinel lama ('0') selalu melanggar FK — backend menormalkannya jadi NULL.
  karyawan_id: z.string().nullable().optional(),
  absen_id: z.string().min(1, { message: dynamicRequiredMessage('ID ABSEN') }),
  kodeabsen: z.string().nullable().optional(),

  keterangan: z.string().nullable().optional(),

  statusaktif: z
    .string()
    .min(1, { message: dynamicRequiredMessage('STATUSAKTIF') }),
  // HARUS bernama *_text / *_nama yang dibuang service (statusaktif_text,
  // jabatan_nama): ZodValidationPipe mengembalikan body ASLI tanpa strip,
  // jadi field bantu yang tak dibuang akan ikut ke INSERT → "column does not exist"
  statusaktif_text: z.string().nullable().optional()
});

export type KaryawanInput = z.infer<typeof karyawanSchema>;
