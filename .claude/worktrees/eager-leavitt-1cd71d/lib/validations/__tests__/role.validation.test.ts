import * as mod from '@/lib/validations/role.validation';
import { runModuleSchemaContract } from '@/lib/test-utils/schemaContract';

runModuleSchemaContract('role', mod);
