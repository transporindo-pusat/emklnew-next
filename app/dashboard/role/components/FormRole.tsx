/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import FormFooterButtons from '@/components/custom-ui/FormFooterButtons';
import { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/utils/AxiosInstance';
import LookUp from '@/components/custom-ui/LookUp';
import { IoMdClose } from 'react-icons/io';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';

const FormRole = ({
  popOver,
  setPopOver,
  forms,
  onSubmit,
  mode,
  isLoadingDelete,
  handleClose,
  isLoadingCreate,
  isLoadingUpdate
}: any) => {
  // Read-only untuk mode yang tidak boleh mengubah data. Dulu view dipaksa
  // lewat prop `deleteMode`; kini keduanya dibaca dari satu `mode`.
  const isReadOnly = mode === 'delete' || mode === 'view';
  interface FieldLengthDetails {
    column: string;
    length: number;
  }

  interface FieldLengths {
    data: {
      [key: string]: FieldLengthDetails;
    };
  }
  const lookUpPropsStatusAktif = [
    {
      columns: [{ key: 'text', name: 'NAMA' }],
      // filterby: { class: 'system', method: 'get' },
      labelLookup: 'STATUS AKTIF LOOKUP',
      selectedRequired: false,
      endpoint: 'parameter?grp=status+aktif',
      label: 'status aktif',
      singleColumn: true,
      pageSize: 20,
      showOnButton: true,
      postData: 'text'
    }
  ];
  const [dataMaxLength, setDataMaxLength] = useState<{ [key: string]: number }>(
    {}
  );

  useEffect(() => {
    if (popOver) {
      fetchFieldLengths('role');
    }
  }, [popOver]);

  const fetchFieldLengths = async (mytable: any) => {
    try {
      const formData = new FormData();
      formData.append('table', mytable);

      const response = await api.post('/api/fieldlength', formData);

      if (response.status !== 200) {
        throw new Error('Network response was not ok');
      }

      const result = response.data.data;

      const maxLengthMap: { [key: string]: number } = {};
      Object.entries(result).forEach(([key, value]: any) => {
        maxLengthMap[key] = value.length;
      });

      setDataMaxLength(maxLengthMap);

      Object.entries(result).forEach(([index, value]: any) => {
        if (
          typeof index === 'string' &&
          value !== null &&
          value !== 0 &&
          value !== undefined
        ) {
          const field = document.querySelector(
            `input[name=${value.column}]`
          ) as HTMLInputElement | null;

          if (field) {
            field.setAttribute('maxlength', value.length.toString());
          }
        }
      });
    } catch (error) {}
  };
  const formRef = useRef<HTMLFormElement | null>(null); // Ref untuk form

  const openName = useSelector((state: RootState) => state.lookup.openName);

  useEffect(() => {
    // Fungsi untuk menangani pergerakan fokus berdasarkan tombol
    const handleKeyDown = (event: KeyboardEvent) => {
      // Jika popOverDate ada nilainya, jangan lakukan apa-apa
      if (openName) {
        return;
      }

      const form = formRef.current;

      if (!form) return;

      const inputs = Array.from(
        form.querySelectorAll('input, select, textarea, button')
      ).filter(
        (element) =>
          element.id !== 'image-dropzone' &&
          element.tagName !== 'BUTTON' &&
          !element.hasAttribute('readonly') // Pengecualian jika input readonly
      ) as HTMLElement[]; // Ambil semua input dalam form kecuali button dan readonly inputs

      const focusedElement = document.activeElement as HTMLElement;

      // Cek apakah elemen yang difokuskan adalah dropzone
      const isImageDropzone =
        document.querySelector('input#image-dropzone') === focusedElement;
      const isFileInput =
        document.querySelector('input#file-input') === focusedElement;

      if (isImageDropzone || isFileInput) return; // Jangan pindah fokus jika elemen fokus adalah dropzone atau input file

      let nextElement: HTMLElement | null = null;

      if (event.key === 'ArrowDown' || event.key === 'Tab') {
        nextElement = getNextFocusableElement(inputs, focusedElement, 'down');
        if (event.key === 'Tab') {
          event.preventDefault(); // Cegah default tab behavior jika ingin mengontrol pergerakan fokus
        }
      } else if (
        event.key === 'ArrowUp' ||
        (event.shiftKey && event.key === 'Tab')
      ) {
        nextElement = getNextFocusableElement(inputs, focusedElement, 'up');
      }
      // Jika ditemukan input selanjutnya, pindahkan fokus
      if (nextElement) {
        nextElement.focus();
      }
    };

    // Fungsi untuk mendapatkan elemen input selanjutnya berdasarkan arah (down atau up)
    const getNextFocusableElement = (
      inputs: HTMLElement[],
      currentElement: HTMLElement,
      direction: 'up' | 'down'
    ): HTMLElement | null => {
      const index = Array.from(inputs).indexOf(currentElement as any);

      if (direction === 'down') {
        // Jika sudah di input terakhir, tidak perlu pindah fokus
        if (index === inputs.length - 1) {
          return null; // Tidak ada elemen selanjutnya
        }
        return inputs[index + 1]; // Fokus pindah ke input setelahnya
      } else {
        return inputs[index - 1]; // Fokus pindah ke input sebelumnya
      }
    };

    // Menambahkan event listener untuk keydown
    document.addEventListener('keydown', handleKeyDown);

    // Membersihkan event listener ketika komponen tidak lagi digunakan
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [openName]); // Tambahkan popOverDate sebagai dependensi
  return (
    <Dialog open={popOver} onOpenChange={setPopOver}>
      <DialogTitle hidden={true}>Title</DialogTitle>
      <DialogContent className="flex h-full min-w-full flex-col overflow-hidden border border-border bg-background">
        <div className="flex items-center justify-between bg-background-form-header px-2 py-2">
          <h2 className="text-sm font-semibold">Role Form</h2>
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
                // Submit native (ENTER di suatu field) diperlakukan sama dengan
                // tombol SAVE: preventDefault lalu onSubmit(false) supaya objek
                // event tidak pernah bocor ke slot keepOpenModal.
                onSubmit={(e) => {
                  e.preventDefault();
                  onSubmit(false);
                }}
                className="flex h-full flex-col gap-6"
              >
                <div className="flex-grow">
                  <div className="grid grid-cols-1 gap-2">
                    <FormField
                      name="rolename"
                      control={forms.control}
                      render={({ field }) => (
                        <FormItem className="flex w-full flex-col justify-between lg:flex-row lg:items-center">
                          <FormLabel
                            required
                            className="font-semibold lg:w-[15%]"
                          >
                            Nama Role
                          </FormLabel>
                          <div className="flex flex-col lg:w-[85%]">
                            <FormControl>
                              <Input
                                {...field}
                                value={(field.value as string) ?? ''}
                                type="text"
                                readOnly={isReadOnly}
                              />
                            </FormControl>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                    <div className="flex w-full flex-col justify-between lg:flex-row lg:items-center">
                      <div className="w-full lg:w-[15%]">
                        <FormLabel className="text-sm font-semibold">
                          Status Aktif
                        </FormLabel>
                      </div>
                      <div className="w-full lg:w-[85%]">
                        {lookUpPropsStatusAktif.map((props, index) => (
                          <LookUp
                            key={index}
                            {...props}
                            lookupValue={(id) =>
                              // statusaktif adalah varchar id (mis. "02-DBCF9E01-...").
                              // Jangan di-Number() — menghasilkan NaN dan memicu 500 di MSSQL.
                              forms.setValue('statusaktif', id)
                            }
                            inputLookupValue={forms.getValues('statusaktif')}
                            lookupNama={forms.getValues('statusaktif_text')}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
        <FormFooterButtons
          // `mode` diteruskan apa adanya: FormFooterButtons memakai ini untuk
          // label tombol ("DELETE" saat mode delete) dan untuk memunculkan
          // SAVE & ADD yang hanya tampil saat mode 'add'.
          mode={mode}
          onSave={() => onSubmit(false)}
          onSaveAndAdd={() => onSubmit(true)}
          onCancel={handleClose}
          isLoadingCreate={isLoadingCreate}
          isLoadingUpdate={isLoadingUpdate}
          isLoadingDelete={isLoadingDelete}
        />
      </DialogContent>
    </Dialog>
  );
};

export default FormRole;
