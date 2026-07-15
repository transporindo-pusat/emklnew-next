import * as mod from '@/lib/validations/cuti.validation';
import { runModuleSchemaContract } from '@/lib/test-utils/schemaContract';

runModuleSchemaContract('cuti', mod);
