import {
  AlatbayarSchema,
  AlatbayarInput
} from '@/lib/validations/alatbayar.validation';

describe('Alatbayar Schema Validation', () => {
  const validData: AlatbayarInput = {
    nama: 'BCA',
    keterangan: 'Transfer Bank BCA',
    statuslangsungcair: '1',
    statusdefault: '1',
    statusbank: '1',
    statusaktif: '1'
  };

  describe('Valid Data', () => {
    test('should validate complete valid data', () => {
      const result = AlatbayarSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('should validate data with all optional fields filled', () => {
      const result = AlatbayarSchema.safeParse({
        ...validData,
        id: 'uuid-id',
        uuid: 'uuid-row',
        statuslangsungcair_uuid: 'uuid-slc',
        statuslangsungcair_text: 'YA',
        statusdefault_uuid: 'uuid-sd',
        statusdefault_text: 'TIDAK',
        statusbank_uuid: 'uuid-sb',
        statusbank_text: 'BANK',
        statusaktif_uuid: 'uuid-sa',
        text: 'AKTIF'
      });
      expect(result.success).toBe(true);
    });

    test('should allow null for optional fields', () => {
      const result = AlatbayarSchema.safeParse({
        ...validData,
        id: null,
        uuid: null,
        statuslangsungcair_uuid: null,
        statuslangsungcair_text: null,
        statusdefault_uuid: null,
        statusdefault_text: null,
        statusbank_uuid: null,
        statusbank_text: null,
        statusaktif_uuid: null,
        text: null
      });
      expect(result.success).toBe(true);
    });
  });

  describe('Invalid Data - NAMA field', () => {
    test('should fail when nama is empty string', () => {
      const result = AlatbayarSchema.safeParse({ ...validData, nama: '' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some((issue) => issue.path.includes('nama'))
        ).toBe(true);
        const namaError = result.error.issues.find((issue) =>
          issue.path.includes('nama')
        );
        expect(namaError?.message).toMatch(/NAMA/i);
      }
    });

    test('should fail when nama is missing', () => {
      const { nama, ...rest } = validData;
      const result = AlatbayarSchema.safeParse(rest);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some((issue) => issue.path.includes('nama'))
        ).toBe(true);
      }
    });
  });

  describe('Invalid Data - KETERANGAN field', () => {
    test('should fail when keterangan is empty string', () => {
      const result = AlatbayarSchema.safeParse({
        ...validData,
        keterangan: ''
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const ketError = result.error.issues.find((issue) =>
          issue.path.includes('keterangan')
        );
        expect(ketError?.message).toMatch(/KETERANGAN/i);
      }
    });

    test('should fail when keterangan is only whitespace', () => {
      const result = AlatbayarSchema.safeParse({
        ...validData,
        keterangan: '   '
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some((issue) =>
            issue.path.includes('keterangan')
          )
        ).toBe(true);
      }
    });
  });

  describe('Invalid Data - status fields (varchar id)', () => {
    test.each([
      'statuslangsungcair',
      'statusdefault',
      'statusbank',
      'statusaktif'
    ])('should fail when %s is empty string', (field) => {
      const result = AlatbayarSchema.safeParse({ ...validData, [field]: '' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some((issue) => issue.path.includes(field))
        ).toBe(true);
      }
    });

    test.each([
      'statuslangsungcair',
      'statusdefault',
      'statusbank',
      'statusaktif'
    ])('should fail when %s is missing', (field) => {
      const data: Record<string, unknown> = { ...validData };
      delete data[field];
      const result = AlatbayarSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some((issue) => issue.path.includes(field))
        ).toBe(true);
      }
    });

    test('status ids accept non-numeric varchar values', () => {
      const result = AlatbayarSchema.safeParse({
        ...validData,
        statuslangsungcair: 'abc-123',
        statusdefault: 'XYZ',
        statusbank: 'bank-uuid',
        statusaktif: 'aktif-uuid'
      });
      expect(result.success).toBe(true);
    });
  });

  describe('Multiple Validation Errors', () => {
    test('should return all validation errors when all required fields are invalid', () => {
      const result = AlatbayarSchema.safeParse({
        nama: '',
        keterangan: '',
        statuslangsungcair: '',
        statusdefault: '',
        statusbank: '',
        statusaktif: ''
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorPaths = result.error.issues.map((issue) => issue.path[0]);
        expect(errorPaths).toContain('nama');
        expect(errorPaths).toContain('keterangan');
        expect(errorPaths).toContain('statuslangsungcair');
        expect(errorPaths).toContain('statusdefault');
        expect(errorPaths).toContain('statusbank');
        expect(errorPaths).toContain('statusaktif');
      }
    });

    test('should handle completely empty object', () => {
      const result = AlatbayarSchema.safeParse({});
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Type Validation', () => {
    test('should fail when nama is not a string', () => {
      const result = AlatbayarSchema.safeParse({ ...validData, nama: 123 });
      expect(result.success).toBe(false);
    });

    test('should fail when status id is a number instead of string', () => {
      const result = AlatbayarSchema.safeParse({
        ...validData,
        statusaktif: 1
      });
      expect(result.success).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    test('should accept minimum valid values', () => {
      const result = AlatbayarSchema.safeParse({
        nama: 'A',
        keterangan: 'A',
        statuslangsungcair: '1',
        statusdefault: '1',
        statusbank: '1',
        statusaktif: '1'
      });
      expect(result.success).toBe(true);
    });

    test('should accept special characters and unicode in string fields', () => {
      const result = AlatbayarSchema.safeParse({
        ...validData,
        nama: 'BCA-Virtual & Co. 银行',
        keterangan: 'Keterangan @#$%^&*() 説明'
      });
      expect(result.success).toBe(true);
    });
  });

  describe('Error Messages', () => {
    test('should provide descriptive error message for empty nama', () => {
      const result = AlatbayarSchema.safeParse({ ...validData, nama: '' });
      expect(result.success).toBe(false);
      if (!result.success) {
        const namaError = result.error.issues.find((issue) =>
          issue.path.includes('nama')
        );
        expect(namaError?.message).toMatch(/NAMA.*WAJIB DIISI/i);
      }
    });

    test('should provide descriptive error message for empty keterangan', () => {
      const result = AlatbayarSchema.safeParse({
        ...validData,
        keterangan: ''
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const ketError = result.error.issues.find((issue) =>
          issue.path.includes('keterangan')
        );
        expect(ketError?.message).toMatch(/KETERANGAN.*WAJIB DIISI/i);
      }
    });
  });
});
