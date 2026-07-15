import * as mod from '@/lib/validations/biaya.validation';
import { runModuleSchemaContract } from '@/lib/test-utils/schemaContract';

runModuleSchemaContract('biaya', mod);
