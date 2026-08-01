import { api2 } from '../utils/AxiosInstance';

export interface ReportJobPayload {
  /** Nama file template .mrt yang ada di folder `reports` milik backend. */
  mrtName: string;
  search?: string;
  filters?: Record<string, string | number | null>;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  judullaporan?: string;
}

export interface ReportJobResponse {
  jobId: string;
}

/**
 * Meminta backend mencetak laporan Group Biaya Extra di background.
 * Balasannya hanya jobId — progres render datang lewat socket `/report`
 * (event `report:progress`), lalu PDF-nya diambil via downloadReportPdfFn.
 */
export const generateGroupbiayaextraReportFn = async (
  payload: ReportJobPayload
): Promise<ReportJobResponse> => {
  const response = await api2.post('/groupbiayaextra/report', payload);
  return response.data;
};

/**
 * Mengunduh hasil render. `downloadPath` diambil apa adanya dari event socket
 * (`/report/download/<jobId>`) supaya frontend tidak menebak-nebak URL-nya.
 */
export const downloadReportPdfFn = async (
  downloadPath: string
): Promise<Blob> => {
  const response = await api2.get(downloadPath, { responseType: 'blob' });
  return new Blob([response.data], { type: 'application/pdf' });
};
