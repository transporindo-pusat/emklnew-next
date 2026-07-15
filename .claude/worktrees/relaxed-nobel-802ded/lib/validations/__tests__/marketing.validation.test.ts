import * as mod from '@/lib/validations/marketing.validation';
import { runModuleSchemaContract } from '@/lib/test-utils/schemaContract';

runModuleSchemaContract('marketing', mod);
