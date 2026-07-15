import * as mod from '@/lib/validations/pelayaran.validation';
import { runModuleSchemaContract } from '@/lib/test-utils/schemaContract';

runModuleSchemaContract('pelayaran', mod);
