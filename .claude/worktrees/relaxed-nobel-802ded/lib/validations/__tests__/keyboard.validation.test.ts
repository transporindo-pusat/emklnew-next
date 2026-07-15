import { isValidAscii, validateAsciiInSchema } from '@/lib/validations/keyboard.validation';

describe('keyboard validation helpers', () => {
  describe('isValidAscii', () => {
    test('accepts printable ASCII (32-126)', () => {
      expect(isValidAscii('Hello World 123 !@#')).toBe(true);
    });

    test('rejects non-printable / non-ascii characters', () => {
      expect(isValidAscii('Hello\tWorld')).toBe(false); // tab (9)
      expect(isValidAscii('emoji 😀')).toBe(false);
      expect(isValidAscii('café')).toBe(false); // é is > 126
    });

    test('treats empty string as valid', () => {
      expect(isValidAscii('')).toBe(true);
    });
  });

  describe('validateAsciiInSchema', () => {
    test('returns true when all string fields are ascii', () => {
      expect(
        validateAsciiInSchema({ nama: 'ABC', umur: 20, aktif: true })
      ).toBe(true);
    });

    test('returns false when any string field is non-ascii', () => {
      expect(validateAsciiInSchema({ nama: 'café', umur: 20 })).toBe(false);
    });

    test('ignores non-string fields', () => {
      expect(validateAsciiInSchema({ a: 1, b: null, c: true })).toBe(true);
    });
  });
});
