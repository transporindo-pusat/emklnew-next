import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import {
  setProcessed,
  setProcessing
} from '../store/loadingSlice/loadingSlice';
import { useDispatch } from 'react-redux';
import {
  getPenerimaanEmklHeaderFn,
  getPenerimaanEmklDetailFn,
  storePenerimaanEmklHeaderFn,
  updatePenerimaanEmklHeaderFn,
  deletePenerimaanEmklHeaderFn
} from '../apis/penerimaanemklheader.api';
import { AxiosError } from 'axios';
import { IErrorResponse } from '../types/user.type';
import { useAlert } from '../store/client/useAlert';

export const useGetPenerimaanEmklHeader = (
  filters: {
    filters?: {
      nobukti?: string;
      tglbukti?: string;
      tgljatuhtempo?: string;
      keterangan?: string | null;
      tglDari?: string | null;
      tglSampai?: string | null;
    };
    page?: number;
    sortBy?: string;
    sortDirection?: string;
    limit?: number;
    search?: string; // Kata kunci pencarian
  } = {}
) => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { alert } = useAlert();
  const queryClient = useQueryClient();

  return useQuery(
    ['penerimaanemklheader', filters],
    async () => {
      // Only trigger processing if the page is 1
      if (filters.page === 1) {
        dispatch(setProcessing());
      }

      try {
        const data = await getPenerimaanEmklHeaderFn(filters);
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
        // Regardless of success or failure, we dispatch setProcessed after the query finishes
        dispatch(setProcessed());
      }
    },
    {
      // Optionally, you can use the `onSettled` callback if you want to reset the processing state after query success or failure
      onSettled: () => {
        if (filters.page === 1) {
          dispatch(setProcessed());
        }
      }
    }
  );
};
export const useCreatePenerimaanEmklHeader = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { alert } = useAlert();

  return useMutation(storePenerimaanEmklHeaderFn, {
    // before the mutation fn runs
    onMutate: () => {
      dispatch(setProcessing());
    },
    // on success, invalidate + toast + clear loading
    onSuccess: () => {
      void queryClient.invalidateQueries(['penerimaanemklheader']);
      void queryClient.invalidateQueries('penerimaanemkl');
      void queryClient.invalidateQueries('pengeluaranemklheaderpengembalian');
      void queryClient.invalidateQueries('pengeluaranemklheaderlist');
      toast({
        title: 'Proses Berhasil',
        description: 'Data Berhasil Ditambahkan'
      });
      dispatch(setProcessed());
    },
    // on error, toast + clear loading
    onError: (error: AxiosError) => {
      const err = (error.response?.data as IErrorResponse) ?? {};
      alert({
        title: err.message ?? 'Gagal',
        variant: 'danger',
        submitText: 'OK'
      });
      dispatch(setProcessed());
    }
    // alternatively: always clear loading, whether success or fail
    // onSettled: () => {
    //   dispatch(clearProcessing());
    // }
  });
};
export const useGetPenerimaanEmklDetail = (
  filters: {
    filters?: {
      nobukti?: string;
      tglbukti?: string;
      keterangan?: string | null;
    };
    sortBy?: string;
    sortDirection?: string;
    search?: string; // Kata kunci pencarian
  } = {}
) => {
  return useQuery(
    ['penerimaanemkl', filters],
    async () => await getPenerimaanEmklDetailFn(filters)
  );
};

export const useUpdatePenerimaanEmklHeader = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { alert } = useAlert();

  return useMutation(updatePenerimaanEmklHeaderFn, {
    onSuccess: () => {
      void queryClient.invalidateQueries('penerimaanemkl');
      void queryClient.invalidateQueries('pengeluaranemklheaderpengembalian');
      void queryClient.invalidateQueries('pengeluaranemklheaderlist');
      //   toast({
      //     title: 'Proses Berhasil.',
      //     description: 'Data Berhasil Diubah.'
      //   });
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
export const useDeletePenerimaanEmklHeader = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { alert } = useAlert();

  return useMutation(deletePenerimaanEmklHeaderFn, {
    onSuccess: () => {
      void queryClient.invalidateQueries('penerimaanemkl');
      toast({
        title: 'Proses Berhasil.',
        description: 'Data Berhasil Dihapus.'
      });
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
