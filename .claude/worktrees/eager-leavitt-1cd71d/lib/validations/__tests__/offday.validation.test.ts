import * as mod from '@/lib/validations/offday.validation';
import { runModuleSchemaContract } from '@/lib/test-utils/schemaContract';

runModuleSchemaContract('offday', mod, {
  // `tgl` requires the dd-mm-yyyy format enforced by a refine.
  offdaysSchema: { validPatch: { tgl: '01-01-2024' } }
});
