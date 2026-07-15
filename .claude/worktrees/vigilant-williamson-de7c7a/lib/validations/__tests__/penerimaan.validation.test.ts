import * as mod from '@/lib/validations/penerimaan.validation';
import { runModuleSchemaContract } from '@/lib/test-utils/schemaContract';

runModuleSchemaContract('penerimaan', mod);
