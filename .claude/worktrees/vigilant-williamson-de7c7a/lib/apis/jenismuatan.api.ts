import { GetParams } from '../types/all.type';
import { IAllJenisMuatan } from '../types/jenismuatan.type';
import { buildQueryParams } from '../utils';
import { api2 } from '../utils/AxiosInstance';
import { JenisMuatanInput } from '../validations/jenismuatan.validation';

interface UpdateJenisMuatanParams {
  id: string;
  fields: JenisMuatanInput;
}

export const getJenisMuatanFn = async (
  filters: GetParams = {},
  signal?: AbortSignal
): Promise<IAllJenisMuatan> => {
  try {
    const queryParams = buildQueryParams(filters);

    const response = await api2.get('/jenismuatan', {
      params: queryParams,
      signal
    });

    return response.data;
  } catch (error) {
    if (signal?.aborted) {
      throw new Error('Request was cancelled');
    }
    // Jangan pakai console.error di sini. AxiosInstance sudah menangani &
    // mencatat network error (sebagai console.warn) + menampilkan offline
    // overlay. Memanggil console.error akan memunculkan overlay merah
    // "Console Error" Next.js untuk error yang sebenarnya sudah ditangani
    // (mis. saat backend port 5004 belum siap / sedang restart). Lempar ulang
    // error aslinya supaya react-query tetap punya konteks status/response.
    throw error;
  }
};

export const storeJenisMuatanFn = async (fields: JenisMuatanInput) => {
  const response = await api2.post(`/jenismuatan`, fields);
  return response.data;
};

export const deleteJenisMuatanFn = async (id: string) => {
  try {
    const response = await api2.delete(`/jenismuatan/${id}`);
    return response.data; // Optionally return response data if needed
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error; // Re-throw the error if you want to handle it in the calling function
  }
};
export const updateJenisMuatanFn = async ({
  id,
  fields
}: UpdateJenisMuatanParams) => {
  const response = await api2.put(`/jenismuatan/${id}`, fields);
  return response.data;
};

export const exportJenisMuatanFn = async (filters: any): Promise<any> => {
  try {
    const queryParams = buildQueryParams(filters);
    const response = await api2.get('/jenismuatan/export', {
      params: queryParams,
      responseType: 'blob' // Pastikan respon dalam bentuk Blob
    });

    return response.data; // Return the Blob file from response
  } catch (error) {
    console.error('Error exporting data:', error);
    throw new Error('Failed to export data');
  }
};
