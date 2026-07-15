export interface LookupDefault {
  id: string;
  text: string;
}

export const EMPTY_LOOKUP_DEFAULT: LookupDefault = { id: '', text: '' };

/**
 * Pilih baris default dari hasil lookup parameter (kolom `default` bernilai 'YA').
 */
export const pickLookupDefault = (
  rows: any[],
  fallbackText: string
): LookupDefault => {
  const row =
    rows.find((p) => p?.default === 'YA') ??
    rows.find((p) => String(p?.text).toUpperCase() === fallbackText);

  return row
    ? { id: String(row.id), text: row.text ?? fallbackText }
    : EMPTY_LOOKUP_DEFAULT;
};

/**
 * Nilai form untuk mode 'add'. Objek ini dipakai `forms.reset()`, yang MENGGANTI
 * seluruh state form — field yang tidak disebut di sini menjadi `undefined`, bukan
 * kembali ke defaultValues. Jadi setiap field wajib di BiayaemklSchema harus ada di
 * sini, kalau tidak SAVE gagal diam-diam: lookup-nya tidak merender FormMessage,
 * sehingga error validasi tidak terlihat sama sekali oleh user.
 */
export const buildAddFormValues = (
  aktif: LookupDefault,
  nilai: LookupDefault
) => ({
  nama: '',
  keterangan: '',

  biaya_id: '',
  biaya_text: '',

  coahut: '',
  coahut_text: '',

  jenisorder_id: '',
  jenisorderan_text: '',

  statusaktif: aktif.id,
  text: aktif.text,

  statusbiayabl: nilai.id,
  statusbiayabl_text: nilai.text,

  statusseal: nilai.id,
  statusseal_text: nilai.text,

  statustagih: nilai.id,
  statustagih_text: nilai.text
});
