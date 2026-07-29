import { buildQueryParams } from '../utils';
import { GetParams } from '../types/all.type';
import { api2 } from '../utils/AxiosInstance';
import { IAllGroupInvoice } from '../types/groupinvoice.type';
import { GroupInvoiceInput } from '../validations/groupinvoice.validation';

interface UpdateGroupInvoiceParams {
  id: string;
  fields: GroupInvoiceInput;
}

interface validationFields {
  aksi: string;
  value: number | string;
}

export const getAllGroupInvoiceFn = async (
  filters: GetParams = {}
): Promise<IAllGroupInvoice> => {
  try {
    const queryParams = buildQueryParams(filters);
    const response = await api2.get('groupinvoice', { params: queryParams });

    return response.data;
  } catch (error) {
    console.error('Error fetching Group Invoice data:', error);
    throw new Error('Failed to fetch Group Invoice data');
  }
};

export const storeGroupInvoiceFn = async (fields: GroupInvoiceInput) => {
  const response = await api2.post(`/groupinvoice`, fields);

  return response.data;
};

export const updateGroupInvoiceFn = async ({
  id,
  fields
}: UpdateGroupInvoiceParams) => {
  const response = await api2.put(`/groupinvoice/${id}`, fields);

  return response.data;
};

export const deleteGroupInvoiceFn = async (id: string) => {
  try {
    const response = await api2.delete(`groupinvoice/${id}`);

    return response;
  } catch (error) {
    console.error('Error deleting group invoice:', error);
    throw error;
  }
};

export const checkValidationGroupInvoiceFn = async (
  fields: validationFields
) => {
  const response = await api2.post(`/groupinvoice/check-validation`, fields);

  return response;
};

export const exportGroupInvoiceFn = async (filters: any): Promise<any> => {
  try {
    const queryParams = buildQueryParams(filters);
    const response = await api2.get('/groupinvoice/export', {
      params: queryParams,
      responseType: 'blob' // Pastikan respon dalam bentuk Blob
    });

    return response.data; // Return the Blob file from response
  } catch (error) {
    console.error('Error exporting data group invoice:', error);
    throw new Error('Failed to export data group invoice');
  }
};
