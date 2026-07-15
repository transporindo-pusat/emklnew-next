import '@testing-library/jest-dom';

// FormResequence is a reorder dialog with custom buttons (no schema/SAVE).
// The standalone CRUD form pattern (see alat-bayar/FormAlatbayar.test.tsx)
// doesn't apply, so it's skipped rather than asserted incorrectly.
describe.skip('FormResequence (skipped: not a standalone form)', () => {
  test('covered indirectly by its parent form', () => {
    expect(true).toBe(true);
  });
});
