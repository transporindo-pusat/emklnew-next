import * as mod from '@/lib/validations/daftarbank.validation';
import { runModuleSchemaContract } from '@/lib/test-utils/schemaContract';

runModuleSchemaContract('daftarbank', mod);
