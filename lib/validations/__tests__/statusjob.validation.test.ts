import * as mod from '@/lib/validations/statusjob.validation';
import { runModuleSchemaContract } from '@/lib/test-utils/schemaContract';

runModuleSchemaContract('statusjob', mod);
