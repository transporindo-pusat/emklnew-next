import * as mod from '@/lib/validations/auth.validation';
import { runModuleSchemaContract } from '@/lib/test-utils/schemaContract';

runModuleSchemaContract('auth', mod);
