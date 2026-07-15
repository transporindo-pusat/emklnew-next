import { GetParams } from '../types/all.type';
import { IAllTrado } from '../types/trado.type';
import { buildQueryParams } from '../utils';
import { api2 } from '../utils/AxiosInstance';
import { TradoInput } from '../validations/trado.validation';

interface UpdateTradoParams {
  id: string;
  fields: TradoInput;
}

export const getTradoFn = async (
  filters: GetParams = {},
  signal?: AbortSignal
): Promise<IAllTrado> => {
  try {
    const queryParams = buildQueryParams(filters);

    const response = await api2.get('/trado', {
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

// Dipakai modul lain (orderanmuatan, bookingorderanmuatan) sebagai sumber
// LookUp trado (endpoint 'trado', isLookUp=true). JANGAN dihapus.
export const getAllTradoFn = async (
  filters: GetParams = {}
): Promise<IAllTrado> => {
  try {
    const queryParams = buildQueryParams(filters);
    const response = await api2.get('trado', { params: queryParams });

    return response.data;
  } catch (error) {
    console.error('Error fetching trado data:', error);
    throw new Error('Failed to fetch trado data');
  }
};

export const storeTradoFn = async (fields: TradoInput) => {
  const response = await api2.post(`/trado`, fields);
  return response.data;
};

export const deleteTradoFn = async (id: string) => {
  try {
    const response = await api2.delete(`/trado/${id}`);
    return response.data; // Optionally return response data if needed
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error; // Re-throw the error if you want to handle it in the calling function
  }
};
export const updateTradoFn = async ({ id, fields }: UpdateTradoParams) => {
  const response = await api2.put(`/trado/${id}`, fields);
  return response.data;
};

export const exportTradoFn = async (filters: any): Promise<any> => {
  try {
    const queryParams = buildQueryParams(filters);
    const response = await api2.get('/trado/export', {
      params: queryParams,
      responseType: 'blob' // Pastikan respon dalam bentuk Blob
    });

    return response.data; // Return the Blob file from response
  } catch (error) {
    console.error('Error exporting data:', error);
    throw new Error('Failed to export data');
  }
};
