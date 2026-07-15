import * as mod from '@/lib/validations/pengeluaran.validation';
import { runModuleSchemaContract } from '@/lib/test-utils/schemaContract';

runModuleSchemaContract('pengeluaran', mod);
