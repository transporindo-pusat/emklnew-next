import * as mod from '@/lib/validations/user.validation';
import { runModuleSchemaContract } from '@/lib/test-utils/schemaContract';

runModuleSchemaContract('user', mod);
