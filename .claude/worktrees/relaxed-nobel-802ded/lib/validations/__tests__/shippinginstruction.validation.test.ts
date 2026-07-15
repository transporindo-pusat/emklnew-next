import * as mod from '@/lib/validations/shippinginstruction.validation';
import { runModuleSchemaContract } from '@/lib/test-utils/schemaContract';

runModuleSchemaContract('shippinginstruction', mod);
