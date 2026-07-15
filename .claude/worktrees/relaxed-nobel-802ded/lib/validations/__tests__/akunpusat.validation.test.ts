import * as mod from '@/lib/validations/akunpusat.validation';
import { runModuleSchemaContract } from '@/lib/test-utils/schemaContract';

runModuleSchemaContract('akunpusat', mod);
