import * as mod from '@/lib/validations/orderanheader.validation';
import { runModuleSchemaContract } from '@/lib/test-utils/schemaContract';

runModuleSchemaContract('orderanheader', mod);
