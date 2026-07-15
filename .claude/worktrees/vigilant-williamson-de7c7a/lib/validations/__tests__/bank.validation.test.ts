import * as mod from '@/lib/validations/bank.validation';
import { runModuleSchemaContract } from '@/lib/test-utils/schemaContract';

runModuleSchemaContract('bank', mod);
