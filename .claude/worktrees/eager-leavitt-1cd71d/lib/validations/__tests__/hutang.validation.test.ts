import * as mod from '@/lib/validations/hutang.validation';
import { runModuleSchemaContract } from '@/lib/test-utils/schemaContract';

runModuleSchemaContract('hutang', mod);
