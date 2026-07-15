import { menuSchema } from '@/lib/validations/menu.validation';
import { runSchemaContract } from '@/lib/test-utils/schemaContract';

describe('menu validation', () => {
  // menuSchema is a factory: (mode) => ZodObject
  runSchemaContract('menuSchema(add)', menuSchema('add'));

  test('delete mode makes all fields optional (partial)', () => {
    expect(menuSchema('delete').safeParse({}).success).toBe(true);
  });
});
