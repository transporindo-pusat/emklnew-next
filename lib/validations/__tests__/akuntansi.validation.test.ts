import * as mod from '@/lib/validations/akuntansi.validation';
import { runModuleSchemaContract } from '@/lib/test-utils/schemaContract';

runModuleSchemaContract('akuntansi', mod);
