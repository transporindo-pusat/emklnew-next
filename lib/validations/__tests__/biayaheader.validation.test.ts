import * as mod from '@/lib/validations/biayaheader.validation';
import { runModuleSchemaContract } from '@/lib/test-utils/schemaContract';

runModuleSchemaContract('biayaheader', mod);
