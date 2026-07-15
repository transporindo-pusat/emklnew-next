// constants/pengeluaranEmkl.ts
// PINJAMANEMKL & PENERIMAANSEAL dibandingkan dengan `format` (pengeluaranemkl.format)
// yang kini varchar(200) UUID (id parameter), bukan int lama 164/170. Nilai diambil
// dari parameter subgrp 'NOMOR PINJAMAN KARYAWAN' & 'NOMOR PENERIMAAN SEAL'.
export const PINJAMANEMKL = '02-DBCF9E01-CCB1-7F72-98EF-C6327C4D9BA8' as const;
export const KASBANK = 168 as const;
export const HUTANG = 169 as const;
export const PENERIMAANSEAL = '02-DBCF9E01-CCB1-477E-BF3E-37F3A040BC76' as const;
