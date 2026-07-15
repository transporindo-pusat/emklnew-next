import * as mod from '@/lib/validations/blheader.validation';
import { runModuleSchemaContract } from '@/lib/test-utils/schemaContract';

runModuleSchemaContract('blheader', mod);
