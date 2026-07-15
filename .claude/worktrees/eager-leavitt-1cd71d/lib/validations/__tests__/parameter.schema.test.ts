import * as mod from '@/lib/validations/parameter.schema';
import { runModuleSchemaContract } from '@/lib/test-utils/schemaContract';

runModuleSchemaContract('parameter', mod);
