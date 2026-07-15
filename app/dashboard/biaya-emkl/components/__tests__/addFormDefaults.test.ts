import { BiayaemklSchema } from '@/lib/validations/biayaemkl.validation';
import {
  buildAddFormValues,
  pickLookupDefault
} from '../addFormDefaults';

const AKTIF = { id: '02-AKTIF', text: 'AKTIF' };
const YA = { id: '02-YA', text: 'YA' };

const requiredSchemaKeys = () =>
  Object.entries(BiayaemklSchema.shape)
    .filter(([, field]) => !(field as any).isOptional())
    .map(([key]) => key);

describe('buildAddFormValues', () => {
  // forms.reset(values) mengganti seluruh state form. Field wajib yang tidak
  // disebut jadi undefined → schema menolak → handleSubmit tidak pernah memanggil
  // onSubmit → tidak ada request ke backend, dan user tidak melihat error apa pun.
  test('menyertakan setiap field wajib di BiayaemklSchema', () => {
    const values = buildAddFormValues(AKTIF, YA);

    expect(Object.keys(values)).toEqual(
      expect.arrayContaining(requiredSchemaKeys())
    );
  });

  test('lookup status default terisi, bukan string kosong', () => {
    const values = buildAddFormValues(AKTIF, YA);

    expect(values.statusaktif).toBe('02-AKTIF');
    expect(values.statusbiayabl).toBe('02-YA');
    expect(values.statusseal).toBe('02-YA');
    expect(values.statustagih).toBe('02-YA');
  });

  test('form lolos validasi setelah user mengisi field yang terlihat', () => {
    const values = {
      ...buildAddFormValues(AKTIF, YA),
      nama: 'BIAYA TEST',
      keterangan: 'KETERANGAN TEST',
      biaya_id: '02-BIAYA',
      coahut: '2101.001',
      jenisorder_id: '02-JENISORDER'
    };

    expect(BiayaemklSchema.safeParse(values).success).toBe(true);
  });

  // Backend menolak jenisorder_id kosong dengan 400, jadi schema frontend harus
  // menahannya lebih dulu dan menampilkan pesan, bukan mengirimnya lalu diam.
  test('menolak form ketika jenis orderan belum dipilih', () => {
    const values = {
      ...buildAddFormValues(AKTIF, YA),
      nama: 'BIAYA TEST',
      keterangan: 'KETERANGAN TEST',
      biaya_id: '02-BIAYA',
      coahut: '2101.001'
    };

    const result = BiayaemklSchema.safeParse(values);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((i) => i.path[0])).toContain(
        'jenisorder_id'
      );
    }
  });
});

describe('pickLookupDefault', () => {
  test('memilih baris dengan default = YA, bukan baris pertama', () => {
    const rows = [
      { id: '1', text: 'NON AKTIF', default: '' },
      { id: '2', text: 'AKTIF', default: 'YA' }
    ];

    expect(pickLookupDefault(rows, 'AKTIF')).toEqual({
      id: '2',
      text: 'AKTIF'
    });
  });

  test('jatuh ke teks fallback kalau tidak ada yang ditandai default', () => {
    const rows = [{ id: '9', text: 'AKTIF', default: '' }];

    expect(pickLookupDefault(rows, 'AKTIF')).toEqual({ id: '9', text: 'AKTIF' });
  });

  test('mengembalikan default kosong kalau tidak ada yang cocok', () => {
    expect(pickLookupDefault([], 'AKTIF')).toEqual({ id: '', text: '' });
  });
});
