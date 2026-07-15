import { GetParams } from '../types/all.type';
import { IAllGandengan } from '../types/gandengan.type';
import { buildQueryParams } from '../utils';
import { api2 } from '../utils/AxiosInstance';
import { GandenganInput } from '../validations/gandengan.validation';

interface UpdateGandenganParams {
  id: string;
  fields: GandenganInput;
}

export const getGandenganFn = async (
  filters: GetParams = {},
  signal?: AbortSignal
): Promise<IAllGandengan> => {
  try {
    const queryParams = buildQueryParams(filters);

    const response = await api2.get('/gandengan', {
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
// LookUp gandengan (endpoint 'gandengan', isLookUp=true). JANGAN dihapus.
export const getAllGandenganFn = async (
  filters: GetParams = {}
): Promise<IAllGandengan> => {
  try {
    const queryParams = buildQueryParams(filters);
    const response = await api2.get('gandengan', { params: queryParams });

    return response.data;
  } catch (error) {
    console.error('Error fetching gandengan data:', error);
    throw new Error('Failed to fetch gandengan data');
  }
};

export const storeGandenganFn = async (fields: GandenganInput) => {
  const response = await api2.post(`/gandengan`, fields);
  return response.data;
};

export const deleteGandenganFn = async (id: string) => {
  try {
    const response = await api2.delete(`/gandengan/${id}`);
    return response.data; // Optionally return response data if needed
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error; // Re-throw the error if you want to handle it in the calling function
  }
};
export const updateGandenganFn = async ({
  id,
  fields
}: UpdateGandenganParams) => {
  const response = await api2.put(`/gandengan/${id}`, fields);
  return response.data;
};

export const exportGandenganFn = async (filters: any): Promise<any> => {
  try {
    const queryParams = buildQueryParams(filters);
    const response = await api2.get('/gandengan/export', {
      params: queryParams,
      responseType: 'blob' // Pastikan respon dalam bentuk Blob
    });

    return response.data; // Return the Blob file from response
  } catch (error) {
    console.error('Error exporting data:', error);
    throw new Error('Failed to export data');
  }
};
