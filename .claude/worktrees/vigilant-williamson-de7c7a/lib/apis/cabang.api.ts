import { GetParams } from '../types/all.type';
import { IAllCabang } from '../types/cabang.type';
import { buildQueryParams } from '../utils';
import { api2 } from '../utils/AxiosInstance';
import { CabangInput } from '../validations/cabang.validation';

interface updateCabangParams {
  id: string;
  fields: CabangInput;
}

export const getCabangFn = async (
  filters: GetParams = {},
  signal?: AbortSignal
): Promise<IAllCabang> => {
  try {
    const queryParams = buildQueryParams(filters);
    const response = await api2.get('/cabang', { params: queryParams, signal });
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

// Alias lama — masih dipakai asalkapal/tujuankapal sebagai lookup cabang.
export const getAllCabangFn = getCabangFn;

export const reportCabangBySelectFn = async (ids: { id: string }[]) => {
  try {
    const response = await api2.post(`/cabang/report-byselect`, ids);
    return response.data;
  } catch (error) {
    console.error('Error in sending data:', error);
    throw new Error('Failed to send data to the API');
  }
};

export const exportCabangFn = async (filters: any): Promise<any> => {
  try {
    const queryParams = buildQueryParams(filters);
    const response = await api2.get('/cabang/export', {
      params: queryParams,
      responseType: 'blob'
    });

    return response.data;
  } catch (error) {
    console.error('Error exporting data:', error);
    throw new Error('Failed to export data');
  }
};
export const exportCabangBySelectFn = async (ids: { id: string }[]) => {
  try {
    const response = await api2.post('/cabang/export-byselect', ids, {
      responseType: 'blob'
    });

    return response.data;
  } catch (error) {
    console.error('Error exporting data:', error);
    throw new Error('Failed to export data');
  }
};
export const storeCabangFn = async (fields: CabangInput) => {
  const response = await api2.post(`/cabang`, fields);
  return response.data;
};
export const updateCabangFn = async ({ id, fields }: updateCabangParams) => {
  const response = await api2.put(`/cabang/${id}`, fields);

  return response.data;
};

export const checkCabangFn = async (id: string) => {
  const response = await api2.get(`/cabang/check/${id}`);
  return response.data;
};

export const deleteCabangFn = async (id: string) => {
  try {
    const response = await api2.delete(`/cabang/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};
