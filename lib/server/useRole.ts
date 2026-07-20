import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useToast } from '@/hooks/use-toast';
import { AxiosError } from 'axios';
import { IErrorResponse } from '../types/user.type';
import {
  deleteRoleFn,
  getRoleAclFn,
  getRoleFn,
  storeRoleFn,
  updateRoleAclFn,
  updateRoleFn
} from '../apis/role.api';
import { useAlert } from '../store/client/useAlert';

export const useGetRole = (
  filters: {
    filters?: {
      rolename?: string; // Filter berdasarkan class
      modifiedby?: string; // Filter berdasarkan nama
      created_at?: string; // Filter berdasarkan method
      updated_at?: string; // Filter berdasarkan method
    };
    page?: number;
    limit?: number;
    search?: string; // Kata kunci pencarian
    sortBy?: string;
    sortDirection?: string;
  } = {}
) => {
  return useQuery(['roles', filters], async () => await getRoleFn(filters));
};

export const useGetRoleAcl = (id?: string) => {
  return useQuery(['role-acl', id], async () => await getRoleAclFn(id!), {
    enabled: !!id // Hanya jalankan query jika id memiliki nilai valid
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { alert } = useAlert();

  // invalidateQueries WAJIB tetap ada di GridRole — berbeda dengan
  // useCreateAlatbayar yang justru harus membuangnya. Alasannya arsitektur
  // grid-nya beda: `rows` di GridRole digerakkan effect react-query
  // (`if (!role || isDataUpdated) return; ... return newRows`) yang MENIMPA
  // rows setiap kali `role` / currentPage / isDataUpdated berubah. Tanpa
  // invalidate, refetch tak pernah terjadi sehingga effect itu menimpa balik
  // data hasil redis dengan data BASI -> baris yang baru disimpan hilang dari
  // grid. Alatbayar aman membuangnya karena rows-nya berasal dari
  // pageDataCache + Row Combiner (cache lokal yang otoritatif), bukan dari
  // query. Fokus baris tersimpan di GridRole ditangani pendingFocusIdRef yang
  // di-re-assert setelah rows berubah.
  return useMutation(storeRoleFn, {
    onSuccess: () => {
      void queryClient.invalidateQueries('roles');
      toast({
        title: 'Proses Berhasil',
        description: 'Data Berhasil Ditambahkan'
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
export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { alert } = useAlert();

  // Sama seperti useCreateRole: invalidate WAJIB dipertahankan (lihat alasannya
  // di sana), fokus baris ditangani pendingFocusIdRef di GridRole.
  return useMutation(updateRoleFn, {
    onSuccess: () => {
      void queryClient.invalidateQueries('roles');
      toast({
        title: 'Proses Berhasil.',
        description: 'Data Berhasil Diubah.'
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
export const useUpdateRoleAcl = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { alert } = useAlert();

  return useMutation(updateRoleAclFn, {
    onSuccess: () => {
      void queryClient.invalidateQueries('roles');
      toast({
        title: 'Proses Berhasil.',
        description: 'Data Berhasil Diubah.'
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
export const useDeleteRole = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { alert } = useAlert();

  return useMutation(deleteRoleFn, {
    onSuccess: () => {
      void queryClient.invalidateQueries('roles');
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
