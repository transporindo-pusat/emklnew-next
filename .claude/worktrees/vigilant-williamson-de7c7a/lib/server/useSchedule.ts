import { useDispatch } from 'react-redux';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  deleteScheduleFn,
  getScheduleDetailFn,
  getScheduleHeaderFn,
  storeScheduleFn,
  updateScheduleFn
} from '../apis/schedule.api';
import {
  setProcessed,
  setProcessing
} from '../store/loadingSlice/loadingSlice';
import { AxiosError } from 'axios';
import { IErrorResponse } from '../types/user.type';
import { useFormError } from '../hooks/formErrorContext';
import { useAlert } from '../store/client/useAlert';

export const useGetScheduleHeader = (
  filters: {
    filters?: {
      nobukti?: string;
      tglbukti?: string;
      keterangan?: string | null;
      bank_id?: number | null;
      pengeluaran_nobukti?: string | null;
      coakaskeluar?: string | null;
      tglDari?: string | null;
      tglSampai?: string | null;
    };
    page?: number;
    sortBy?: string;
    sortDirection?: string;
    limit?: number;
    search?: string; // Kata kunci pencarian
  } = {},
  signal?: AbortSignal
) => {
  const dispatch = useDispatch();
  const { alert } = useAlert();
  const queryClient = useQueryClient();

  return useQuery(
    ['schedule', filters],
    async () => {
      if (filters.page === 1) {
        dispatch(setProcessing()); // Only trigger processing if the page is 1
      }

      try {
        const data = await getScheduleHeaderFn(filters, signal);
        return data;
      } catch (error) {
        // Show error toast and dispatch processed
        dispatch(setProcessed());
        alert({
          title: 'Gagal',
          variant: 'danger',
          submitText: 'OK'
        });
        throw error;
      } finally {
        dispatch(setProcessed());
      }
    },
    {
      enabled: !signal?.aborted
    }
    // {
    //   onSettled: () => {
    //     if (filters.page === 1) {
    //       dispatch(setProcessed());
    //     }
    //   }
    // }
  );
};

export const useGetScheduleDetail = (
  id?: string,
  filters: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortDirection?: string;
    filters?: {
      nobukti?: string;
      pelayaran?: string;
      kapal?: string;
      tujuankapal?: string;
      tglberangkat?: string;
      tgltiba?: string;
      etb?: string;
      eta?: string;
      etd?: string;
      voyberangkat?: string;
      voytiba?: string;
      closing?: string;
      etatujuan?: string;
      etdtujuan?: string;
      keterangan?: string;
    };
  } = {}
) => {
  return useQuery(
    ['schedule', id, filters],
    async () => await getScheduleDetailFn(id!, filters),
    {
      enabled: !!id // Hanya aktifkan query jika tab aktif adalah "pengalamankerja"
    }
  );
};

export const useCreateSchedule = () => {
  const { setError } = useFormError(); // Mengambil setError dari context
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { alert } = useAlert();

  return useMutation(storeScheduleFn, {
    // before the mutation fn runs
    onMutate: () => {
      dispatch(setProcessing());
    },
    onSuccess: () => {
      // on success, invalidate + clear loading
      void queryClient.invalidateQueries(['schedule']);
      dispatch(setProcessed());
    },
    onError: (error: AxiosError) => {
      // on error, clear loading
      const err = (error.response?.data as IErrorResponse) ?? {};

      if (err !== undefined) {
        const errorFields = Array.isArray(err.message) ? err.message : [];

        if (err.statusCode === 400) {
          // Iterasi error message dan set error di form
          errorFields?.forEach((err: { path: string[]; message: string }) => {
            const path = err.path[0]; // Ambil path error pertama (misalnya 'nama', 'akuntansi_id')
            setError(path, err.message); // Update error di context
          });
        } else {
          alert({
            title: err.message ?? 'Gagal',
            variant: 'danger',
            submitText: 'OK'
          });
        }
      }
      dispatch(setProcessed());
    }
    // onSettled: () => {
    //   dispatch(setProcessed());
    // }
  });
};

export const useUpdateSchedule = () => {
  const { setError } = useFormError();
  const queryClient = useQueryClient();
  const { alert } = useAlert();
  const dispatch = useDispatch();

  return useMutation(updateScheduleFn, {
    onMutate: () => {
      dispatch(setProcessing());
    },
    onSuccess: () => {
      void queryClient.invalidateQueries('schedule');
      dispatch(setProcessed());
    },
    onError: (error: AxiosError) => {
      const errorResponse = error.response?.data as IErrorResponse;
      if (errorResponse !== undefined) {
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
      dispatch(setProcessed());
    }
  });
};

export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();
  const { alert } = useAlert();

  return useMutation(deleteScheduleFn, {
    onSuccess: () => {
      void queryClient.invalidateQueries('schedule');
      // toast({
      //   title: 'Proses Berhasil.',
      //   description: 'Data Berhasil Dihapus.'
      // });
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
