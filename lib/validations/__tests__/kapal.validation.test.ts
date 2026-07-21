import * as mod from '@/lib/validations/kapal.validation';
import { runModuleSchemaContract } from '@/lib/test-utils/schemaContract';

runModuleSchemaContract('kapal', mod);
