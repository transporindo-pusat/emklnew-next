import * as mod from '@/lib/validations/pindahbuku.validation';
import { runModuleSchemaContract } from '@/lib/test-utils/schemaContract';

runModuleSchemaContract('pindahbuku', mod);
