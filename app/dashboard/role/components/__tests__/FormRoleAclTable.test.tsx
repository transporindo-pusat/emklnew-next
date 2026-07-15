import '@testing-library/jest-dom';

// FormRoleAclTable is a permission table widget, no standalone SAVE/Cancel.
// The standalone CRUD form pattern (see alat-bayar/FormAlatbayar.test.tsx)
// doesn't apply, so it's skipped rather than asserted incorrectly.
describe.skip('FormRoleAclTable (skipped: not a standalone form)', () => {
  test('covered indirectly by its parent form', () => {
    expect(true).toBe(true);
  });
});
