/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { useGetMenu } from '@/lib/server/useMenu';
import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import LookUp from '@/components/custom-ui/LookUp';
import FormFooterButtons from '@/components/custom-ui/FormFooterButtons';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { IoMdClose } from 'react-icons/io';
import { FaSave } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { setSubmitClicked } from '@/lib/store/lookupSlice/lookupSlice';

const FormKaryawan = ({
  popOver,
  setPopOver,
  forms,
  onSubmit,
  mode,
  handleClose,
  isLoadingCreate,
  isLoadingUpdate,
  isLoadingDelete
}: any) => {
  const lookUpPropsStatusAktif = [
    {
      columns: [{ key: 'text', name: 'NAMA' }],
      // filterby: { class: 'system', method: 'get' },
      labelLookup: 'STATUS AKTIF LOOKUP',
      required: true,
      selectedRequired: false,
      endpoint: 'parameter?grp=status+aktif',
      label: 'STATUS AKTIF',
      singleColumn: true,
      pageSize: 20,
      dataToPost: 'id',
      showOnButton: true,
      postData: 'text'
    }
  ];
  const lookUpJabatan = [
    {
      columns: [{ key: 'nama', name: 'NAMA' }],
      // filterby: { class: 'system', method: 'get' },
      labelLookup: 'Jabatan LOOKUP',
      required: true,
      selectedRequired: false,
      endpoint: 'jabatan',
      label: 'JABATAN',
      singleColumn: true,
      pageSize: 20,
      dataToPost: 'id',
      showOnButton: true,
      postData: 'nama'
    }
  ];
  const formRef = useRef<HTMLFormElement | null>(null); // Ref untuk form
  const openName = useSelector((state: RootState) => state.lookup.openName);
  const dispatch = useDispatch();

  return (
    <Dialog open={popOver} onOpenChange={setPopOver}>
      <DialogTitle hidden={true}>Title</DialogTitle>
      <DialogContent className="flex h-full min-w-full flex-col overflow-hidden border border-border bg-background">
        <div className="flex items-center justify-between bg-background-form-header px-2 py-2">
          <h2 className="text-sm font-semibold">
            {mode === 'add'
              ? 'Tambah Karyawan'
              : mode === 'edit'
              ? 'Edit Karyawan'
              : mode === 'delete'
              ? 'Delete Karyawan'
              : 'View Karyawan'}
          </h2>
          <div
            className="cursor-pointer rounded-md border border-zinc-200 bg-red-500 p-0 hover:bg-red-400"
            onClick={() => {
              setPopOver(false);
              handleClose();
            }}
          >
            <IoMdClose className="h-5 w-5 font-bold text-white" />
          </div>
        </div>
        <div className="h-full flex-1 overflow-y-auto bg-background-card pl-1 pr-2">
          <div className="h-full bg-background-card px-5 py-3">
            <Form {...forms}>
              <form
                ref={formRef}
                onSubmit={onSubmit}
                className="flex h-full flex-col gap-6"
              >
                <div className="flex h-[100%] flex-col gap-2 lg:gap-3">
                  <FormField
                    name="nama"
                    control={forms.control}
                    render={({ field }) => (
                      <FormItem className="flex w-full flex-col justify-between lg:flex-row lg:items-center">
                        <FormLabel
                          required={true}
                          className="font-semibold lg:w-[15%]"
                        >
                          NAMA
                        </FormLabel>
                        <div className="flex flex-col lg:w-[85%]">
                          <FormControl>
                            <Input
                              autoFocus
                              {...field}
                              value={field.value ?? ''}
                              type="text"
                              readOnly={mode === 'view' || mode === 'delete'}
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <div className="flex w-full flex-col justify-between lg:flex-row lg:items-center">
                    <div className="w-full lg:w-[15%]">
                      <FormLabel
                        required={true}
                        className="text-sm font-semibold"
                      >
                        Jabatan
                      </FormLabel>
                    </div>
                    <div className="w-full lg:w-[85%]">
                      {lookUpJabatan.map((props, index) => (
                        <LookUp
                          key={index}
                          {...props}
                          lookupValue={(id) =>
                            forms.setValue('jabatan_id', id)
                          }
                          inputLookupValue={forms.getValues('jabatan_id')}
                          lookupNama={forms.getValues('jabatan_nama')}
                          // tanpa forms+name, error validasi jabatan_id tak punya
                          // tempat tampil (LookUp bukan FormField) → gagal senyap
                          forms={forms}
                          name="jabatan_id"
                          disabled={mode === 'view' || mode === 'delete'}
                        />
                      ))}
                    </div>
                  </div>
                  <FormField
                    name="kodeabsen"
                    control={forms.control}
                    render={({ field }) => (
                      <FormItem className="flex w-full flex-col justify-between lg:flex-row lg:items-center">
                        <FormLabel className="font-semibold lg:w-[15%]">
                          Kode Absen
                        </FormLabel>
                        <div className="flex flex-col lg:w-[85%]">
                          <FormControl>
                            <Input
                              {...field}
                              value={field.value ?? ''}
                              type="text"
                              readOnly={mode === 'view' || mode === 'delete'}
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  {/*
                    TIDAK ADA input untuk `karyawan_id`. Kolom itu punya FK
                    self-reference ke karyawan(id), jadi satu-satunya nilai sah
                    adalah id karyawan yang benar-benar ada — sesuatu yang tak
                    bisa diketahui/dipilih user karena sumber aslinya (server HR)
                    tak tersedia. Nilai bebas apa pun akan ditolak FK dan
                    menggagalkan simpan, sehingga field ini sengaja dihilangkan
                    dan backend menyimpannya sebagai NULL.

                    absen_id tidak punya FK sehingga aman diisi bebas.
                  */}
                  <FormField
                    name="absen_id"
                    control={forms.control}
                    render={({ field }) => (
                      <FormItem className="flex w-full flex-col justify-between lg:flex-row lg:items-center">
                        <FormLabel
                          required={true}
                          className="font-semibold lg:w-[15%]"
                        >
                          ID Absen
                        </FormLabel>
                        <div className="flex flex-col lg:w-[85%]">
                          <FormControl>
                            <Input
                              {...field}
                              value={field.value ?? ''}
                              type="text"
                              readOnly={mode === 'view' || mode === 'delete'}
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="keterangan"
                    control={forms.control}
                    render={({ field }) => (
                      <FormItem className="flex w-full flex-col justify-between lg:flex-row lg:items-center">
                        <FormLabel className="font-semibold lg:w-[15%]">
                          Keterangan
                        </FormLabel>
                        <div className="flex flex-col lg:w-[85%]">
                          <FormControl>
                            <Input
                              {...field}
                              value={field.value ?? ''}
                              type="text"
                              readOnly={mode === 'view' || mode === 'delete'}
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <div className="flex w-full flex-col justify-between lg:flex-row lg:items-center">
                    <div className="w-full lg:w-[15%]">
                      <FormLabel
                        required={true}
                        className="text-sm font-semibold"
                      >
                        Status Aktif
                      </FormLabel>
                    </div>
                    <div className="w-full lg:w-[85%]">
                      {lookUpPropsStatusAktif.map((props, index) => (
                        <LookUp
                          key={index}
                          {...props}
                          lookupValue={(id) =>
                            forms.setValue('statusaktif', id)
                          }
                          inputLookupValue={forms.getValues('statusaktif')}
                          lookupNama={forms.getValues('statusaktif_text')}
                          forms={forms}
                          name="statusaktif"
                          disabled={mode === 'view' || mode === 'delete'}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
        <FormFooterButtons
          mode={mode}
          onSave={() => {
            onSubmit(false);
            dispatch(setSubmitClicked(true));
          }}
          onSaveAndAdd={() => {
            onSubmit(true);
            dispatch(setSubmitClicked(true));
          }}
          onCancel={handleClose}
          isLoadingCreate={isLoadingCreate}
          isLoadingUpdate={isLoadingUpdate}
          isLoadingDelete={isLoadingDelete}
          deleteMode={mode === 'delete'}
        />
      </DialogContent>
    </Dialog>
  );
};

export default FormKaryawan;
