import * as mod from '@/lib/validations/locks.validation';
import { runModuleSchemaContract } from '@/lib/test-utils/schemaContract';

runModuleSchemaContract('locks', mod);
