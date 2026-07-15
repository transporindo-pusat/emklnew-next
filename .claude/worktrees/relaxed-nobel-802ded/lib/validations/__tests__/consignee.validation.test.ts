import * as mod from '@/lib/validations/consignee.validation';
import { runModuleSchemaContract } from '@/lib/test-utils/schemaContract';

runModuleSchemaContract('consignee', mod);
