import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  deleteJenisBiayaMarketingFn,
  getJenisBiayaMarketingFn,
  storeJenisBiayaMarketingFn,
  updateJenisBiayaMarketingFn
} from '../apis/jenisbiayamarketing.api';
import { AxiosError } from 'axios';
import { IErrorResponse } from '../types/user.type';
import { useFormError } from '../hooks/formErrorContext';
import { useAlert } from '../store/client/useAlert';

export const useGetJenisBiayaMarketing = (
  filters: {
    filters?: {
      nama?: string;
      keterangan?: string;
    };
    page?: number;
    sortBy?: string;
    sortDirection?: string;
    limit?: number;
    search?: string;
  } = {},
  signal?: AbortSignal
) => {
  return useQuery(
    ['jenisbiayamarketings', filters],
    async () => await getJenisBiayaMarketingFn(filters, signal),
    {
      enabled: !signal?.aborted
    }
  );
};

export const useCreateJenisBiayaMarketing = () => {
  const { setError } = useFormError();
  const queryClient = useQueryClient();
  const { alert } = useAlert();

  return useMutation(storeJenisBiayaMarketingFn, {
    onSuccess: () => {
      void queryClient.invalidateQueries('jenisbiayamarketings'); //pake s karena sebagai penamaan aja, karena kita pake mutasi, jadi pas crud dan ada data berubah kita ga fetch manual, pake ini aja asal keynya sama
    },
    onError: (error: AxiosError) => {
      const errorResponse = error.response?.data as IErrorResponse;
      if (errorResponse !== undefined) {
        const errorFields = errorResponse.message || [];

        // Iterasi error message dan set error di form
        errorFields?.forEach((err: { path: string[]; message: string }) => {
          const path = err.path[0]; // Ambil path error pertama (misalnya 'nama', 'akuntansi_id')

          setError(path, err.message); // Update error di context
        });
      }
    }
  });
};

export const useDeleteJenisBiayaMarketing = () => {
  const queryClient = useQueryClient();
  const { alert } = useAlert();

  return useMutation(deleteJenisBiayaMarketingFn, {
    onSuccess: () => {
      void queryClient.invalidateQueries('jenisbiayamarketings');
    },
    onError: (error: AxiosError) => {
      const errorResponse = error.response?.data as IErrorResponse;
      if (errorResponse !== undefined) {
        alert({
          title: errorResponse.message ?? 'Gagal',
          variant: 'danger',
          submitText: 'OK'
        });
      }
    }
  });
};
export const useUpdateJenisBiayaMarketing = () => {
  const { setError } = useFormError();
  const queryClient = useQueryClient();
  const { alert } = useAlert();

  return useMutation(updateJenisBiayaMarketingFn, {
    onSuccess: () => {
      void queryClient.invalidateQueries('jenisbiayamarketings');
    },
    onError: (error: AxiosError) => {
      const errorResponse = error.response?.data as IErrorResponse;
      if (errorResponse !== undefined) {
        const errorFields = errorResponse.message || [];

        // Iterasi error message dan set error di form
        errorFields?.forEach((err: { path: string[]; message: string }) => {
          const path = err.path[0]; // Ambil path error pertama (misalnya 'nama', 'akuntansi_id')

          setError(path, err.message); // Update error di context
        });
      }
    }
  });
};
