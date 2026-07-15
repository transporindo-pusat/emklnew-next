import { AxiosError } from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  deleteTypeAkuntansiFn,
  getAllTypeAkuntansiFn,
  storeTypeAkuntansiFn,
  updateTypeAkuntansiFn
} from '../apis/typeakuntansi.api';
import { useAlert } from '../store/client/useAlert';
import { IErrorResponse } from '../types/typeakuntansi.type';
import { useFormError } from '../hooks/formErrorContext';

export const useGetAllTypeAkuntansi = (
  filters: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortDirection?: string;
    filters?: {
      nama?: string;
      order?: number | null | undefined | '';
      keterangan?: string;
      statusaktif_text?: string;
      akuntansi?: string;
      modifiedby?: string;
      created_at?: string;
      updated_at?: string;
    };
  } = {},
  signal?: AbortSignal
) => {
  return useQuery(
    ['typeakuntansi', filters],
    async () => await getAllTypeAkuntansiFn(filters, signal),
    {
      enabled: !signal?.aborted
    }
  );
};

export const useCreateTypeAkuntansi = () => {
  const { setError } = useFormError(); // Mengambil setError dari context
  const queryClient = useQueryClient();
  const { alert } = useAlert();
  return useMutation(storeTypeAkuntansiFn, {
    onSuccess: () => {
      void queryClient.invalidateQueries('typeakuntansi');
    },
    onError: (error: AxiosError) => {
      const errorResponse = error.response?.data as IErrorResponse;
      console.log('errorResponse', errorResponse);
      if (errorResponse !== undefined) {
        // Menangani error berdasarkan path

        const errorFields = Array.isArray(errorResponse.message)
          ? errorResponse.message
          : [];
        if (errorResponse.statusCode === 400) {
          // Iterasi error message dan set error di form
          errorFields?.forEach((err: { path: string[]; message: string }) => {
            const path = err.path[0]; // Ambil path error pertama (misalnya 'nama', 'akuntansi_id')
            console.log('path', path);
            setError(path, err.message); // Update error di context
          });
        } else {
          alert({
            title: errorResponse.message ?? 'Gagal',
            variant: 'danger',
            submitText: 'OK'
          });
        }
      }
    }
  });
};

export const useUpdateTypeAkuntansi = () => {
  const { setError } = useFormError(); // Mengambil setError dari context
  const queryClient = useQueryClient();
  const { alert } = useAlert();

  return useMutation(updateTypeAkuntansiFn, {
    onSuccess: () => {
      void queryClient.invalidateQueries('typeakuntansi');
    },
    onError: (error: AxiosError) => {
      const errorResponse = error.response?.data as IErrorResponse;

      if (errorResponse !== undefined) {
        // Menangani error berdasarkan path
        const errorFields = Array.isArray(errorResponse.message)
          ? errorResponse.message
          : [];

        if (errorResponse.statusCode === 400) {
          // Iterasi error message dan set error di form
          errorFields?.forEach((err: { path: string[]; message: string }) => {
            const path = err.path[0]; // Ambil path error pertama (misalnya 'nama', 'akuntansi_id')
            setError(path, err.message); // Update error di context
          });
        } else {
          alert({
            title: errorResponse.message ?? 'Gagal',
            variant: 'danger',
            submitText: 'OK'
          });
        }
      }
    }
  });
};

export const useDeleteTypeAkuntansi = () => {
  const queryClient = useQueryClient();
  const { alert } = useAlert();

  return useMutation(deleteTypeAkuntansiFn, {
    onSuccess: () => {
      void queryClient.invalidateQueries('typeakuntansi');
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
