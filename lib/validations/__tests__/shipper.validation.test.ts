import * as mod from '@/lib/validations/shipper.validation';
import { runModuleSchemaContract } from '@/lib/test-utils/schemaContract';

runModuleSchemaContract('shipper', mod);
