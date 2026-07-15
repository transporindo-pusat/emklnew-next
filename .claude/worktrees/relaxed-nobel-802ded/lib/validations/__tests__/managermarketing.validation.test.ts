import * as mod from '@/lib/validations/managermarketing.validation';
import { runModuleSchemaContract } from '@/lib/test-utils/schemaContract';

runModuleSchemaContract('managermarketing', mod);
