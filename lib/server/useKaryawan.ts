import { useMutation, useQuery, useQueryClient } from 'react-query';
import { IErrorResponse } from '../types/user.type';
import { AxiosError } from 'axios';
import {
  deleteKaryawanFn,
  getKaryawanFn,
  storeKaryawanFn,
  updateKaryawanFn
} from '../apis/karyawan.api';
import { useAlert } from '../store/client/useAlert';
import { useFormError } from '../hooks/formErrorContext';

export const useGetKaryawan = (
  filters: {
    filters?: {
      nama?: string;
      keterangan?: string;
      jabatan?: string;
      text?: string;
    };
    page?: number;
    sortBy?: string;
    sortDirection?: string;
    limit?: number;
    search?: string; // Kata kunci pencarian
  } = {},
  signal?: AbortSignal
) => {
  return useQuery(
    ['karyawan', filters],
    async () => await getKaryawanFn(filters, signal),
    {
      enabled: !signal?.aborted
    }
  );
};

export const useCreateKaryawan = () => {
  const { setError } = useFormError();
  const queryClient = useQueryClient();
  const { alert } = useAlert();

  return useMutation(storeKaryawanFn, {
    onSuccess: () => {
      void queryClient.invalidateQueries('karyawan');
    },
    onError: (error: AxiosError) => {
      const errorResponse = error.response?.data as IErrorResponse;

      if (errorResponse !== undefined) {
        // Menangani error berdasarkan path
        const errorFields = errorResponse.message || [];

        // Iterasi error message dan set error di form
        if (Array.isArray(errorFields)) {
          errorFields.forEach((err: { path: string[]; message: string }) => {
            const path = err.path[0]; // Ambil path error pertama (misalnya 'nama', 'karyawan_id')

            setError(path, err.message); // Update error di context
          });
        }

        // toast({
        //   variant: 'destructive',
        //   title: errorResponse.message ?? 'Gagal',
        //   description: 'Terjadi masalah dengan permintaan Anda'
        // });
      }
    }
  });
};

export const useDeleteKaryawan = () => {
  const { setError } = useFormError();
  const queryClient = useQueryClient();

  return useMutation(deleteKaryawanFn, {
    onSuccess: () => {
      void queryClient.invalidateQueries('karyawan');
    },
    onError: (error: AxiosError) => {
      const errorResponse = error.response?.data as IErrorResponse;
      if (errorResponse !== undefined) {
        const errorFields = errorResponse.message || [];
        // Array = daftar isu Zod per-field. Nest juga bisa membalas 400 dengan
        // `message` berupa STRING biasa (mis. BadRequestException "karyawan
        // masih dipakai"); memanggil .forEach di string melempar TypeError dan
        // menelan error aslinya — biarkan pemanggil yang menampilkannya.
        if (errorResponse.statusCode === 400 && Array.isArray(errorFields)) {
          // Iterasi error message dan set error di form
          errorFields.forEach((err: { path: string[]; message: string }) => {
            const path = err.path[0]; // Ambil path error pertama (misalnya 'nama', 'akuntansi_id')

            setError(path, err.message); // Update error di context
          });
        }
      }
    }
  });
};
export const useUpdateKaryawan = () => {
  const { setError } = useFormError();
  const queryClient = useQueryClient();

  return useMutation(updateKaryawanFn, {
    onSuccess: () => {
      void queryClient.invalidateQueries('karyawan');
    },
    onError: (error: AxiosError) => {
      const errorResponse = error.response?.data as IErrorResponse;
      if (errorResponse !== undefined) {
        const errorFields = errorResponse.message || [];
        // Array = daftar isu Zod per-field. Nest juga bisa membalas 400 dengan
        // `message` berupa STRING biasa (mis. BadRequestException "karyawan
        // masih dipakai"); memanggil .forEach di string melempar TypeError dan
        // menelan error aslinya — biarkan pemanggil yang menampilkannya.
        if (errorResponse.statusCode === 400 && Array.isArray(errorFields)) {
          // Iterasi error message dan set error di form
          errorFields.forEach((err: { path: string[]; message: string }) => {
            const path = err.path[0]; // Ambil path error pertama (misalnya 'nama', 'akuntansi_id')

            setError(path, err.message); // Update error di context
          });
        }
      }
    }
  });
};
