import * as mod from '@/lib/validations/daftarbl.validation';
import { runModuleSchemaContract } from '@/lib/test-utils/schemaContract';

runModuleSchemaContract('daftarbl', mod);
