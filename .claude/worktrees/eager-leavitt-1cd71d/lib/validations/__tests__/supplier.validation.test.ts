import * as mod from '@/lib/validations/supplier.validation';
import { runModuleSchemaContract } from '@/lib/test-utils/schemaContract';

runModuleSchemaContract('supplier', mod, {
  // `npwp` is constrained by a strict format regex.
  supplierSchema: { validPatch: { npwp: '12.345.678.9-012.345' } }
});
