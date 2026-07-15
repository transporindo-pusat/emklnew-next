import * as mod from '@/lib/validations/schedule.validation';
import { runModuleSchemaContract } from '@/lib/test-utils/schemaContract';

runModuleSchemaContract('schedule', mod);
