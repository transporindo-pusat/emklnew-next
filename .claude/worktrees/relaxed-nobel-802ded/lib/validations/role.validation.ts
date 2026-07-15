import { REQUIRED_FIELD } from '@/constants/validation';
import { z } from 'zod';
import { dynamicRequiredMessage } from '../utils';

export const roleSchema = z.object({
  rolename: z
    .string()
    .nonempty({ message: dynamicRequiredMessage('NAMA ROLE') }),
  // statusaktif = id parameter (varchar, mis. "02-DBCF9E01-..."), bukan angka.
  statusaktif: z.string().min(1, `${REQUIRED_FIELD}`),
  statusaktif_text: z.string().nullable().optional()
});
export type RoleInput = z.infer<typeof roleSchema>;

export const roleAclSchema = z.object({
  roleId: z.string().min(1, 'Role ID harus diisi'), // roleId adalah varchar UUID, bukan angka
  data: z.array(z.number().min(1, 'ACO ID must be a positive number')) // acoIds must be an array of positive numbers
});

// Type derived from the schema for type-checking
export type RoleAclInput = z.infer<typeof roleAclSchema>;
