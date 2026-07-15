import * as mod from '@/lib/validations/packinglist.validation';
import { runModuleSchemaContract } from '@/lib/test-utils/schemaContract';

runModuleSchemaContract('packinglist', mod);
