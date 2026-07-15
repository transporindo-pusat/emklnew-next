import * as mod from '@/lib/validations/bookingorderanheader.validation';
import { runModuleSchemaContract } from '@/lib/test-utils/schemaContract';

runModuleSchemaContract('bookingorderanheader', mod);
