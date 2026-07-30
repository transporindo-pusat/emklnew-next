// lib/store/filterSlice/filterSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// ============================================================
// TYPES
// ============================================================

/**
 * Shape filter yang bisa di-pending/commit per halaman.
 * Tambah field baru cukup di sini — slice tidak perlu diubah.
 */
export type PageFilter = {
  tglDari: string;
  tglSampai: string;
  bank_id: string | number;
  bank_nama: string;
  karyawan1: string;
  karyawan2: string;
  year: string;
  // pengeluaranEmkl/penerimaanEmkl menampung `format` = id parameter varchar UUID
  // (juga jadi discriminator sub-form emkl), bukan number.
  pengeluaranEmkl: string | null;
  pengeluaranEmklNama: string;
  penerimaanEmkl: string | null;
  penerimaanEmklNama: string;
  jenisOrderan: string;
  jenisOrderanNama: string;
  jenisStatusJob: number | null;
  jenisStatusJobNama: string;
  biayaEmkl: number | null;
  biayaEmklNama: string;
};

type FilterSliceState = {
  /**
   * Draft — apa yang user ketik/pilih di FilterGrid,
   * belum di-commit, tidak trigger fetch di Grid.
   */
  pending: PageFilter;

  /**
   * Committed — dipakai Grid untuk fetch API.
   * Hanya berubah saat user klik Reload (commitFilter).
   */
  committed: PageFilter;
  selectedDate: string;
  selectedDate2: string;
  selectedBank: string;
  selectedKaryawan1: string;
  selectedKaryawan2: string;
  selectedYear: string;
  selectedPengeluaranEmkl: string | null;
  selectedPengeluaranEmklNama: string;
  selectedPenerimaanEmkl: string | null;
  selectedPenerimaanEmklNama: string;
  selectedJenisOrderan: string;
  selectedJenisOrderanNama: string;
  selectedJenisStatusJob: number | null;
  selectedJenisStatusJobNama: string;
  selectedBiayaEmkl: number | null;
  selectedBiayaEmklNama: string;

  onReload: boolean;
};

// ============================================================
// HELPERS
// ============================================================

const getDefaultDates = () => {
  const now = new Date();
  const fmt = (d: Date) =>
    `${String(d.getDate()).padStart(2, '0')}-${String(
      d.getMonth() + 1
    ).padStart(2, '0')}-${d.getFullYear()}`;
  return {
    from: fmt(new Date(now.getFullYear(), now.getMonth(), 1)),
    to: fmt(new Date(now.getFullYear(), now.getMonth() + 1, 0))
  };
};

const defaults = getDefaultDates();

const emptyFilter: PageFilter = {
  tglDari: defaults.from,
  tglSampai: defaults.to,
  bank_id: '',
  bank_nama: '',
  karyawan1: '',
  karyawan2: '',
  year: '',
  pengeluaranEmkl: null,
  pengeluaranEmklNama: '',
  penerimaanEmkl: null,
  penerimaanEmklNama: '',
  jenisOrderan: '',
  jenisOrderanNama: '',
  jenisStatusJob: null,
  jenisStatusJobNama: '',
  biayaEmkl: null,
  biayaEmklNama: ''
};

// ============================================================
// INITIAL STATE
// ============================================================

const initialState: FilterSliceState = {
  pending: { ...emptyFilter },
  committed: { ...emptyFilter },

  // --- deprecated fields (backward compat) ---
  selectedDate: defaults.from,
  selectedDate2: defaults.to,
  selectedBank: '',
  selectedKaryawan1: '',
  selectedKaryawan2: '',
  selectedYear: '',
  selectedPengeluaranEmkl: null,
  selectedPengeluaranEmklNama: '',
  selectedPenerimaanEmkl: null,
  selectedPenerimaanEmklNama: '',
  selectedJenisOrderan: '',
  selectedJenisOrderanNama: '',
  selectedJenisStatusJob: null,
  selectedJenisStatusJobNama: '',
  selectedBiayaEmkl: null,
  selectedBiayaEmklNama: '',
  onReload: false
};

// ============================================================
// SLICE
// ============================================================

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    // ----------------------------------------------------------
    // ✅ NEW: pending → commit pattern
    // ----------------------------------------------------------

    /** User mengetik/memilih di FilterGrid → update pending saja */
    setPending(state, action: PayloadAction<Partial<PageFilter>>) {
      state.pending = { ...state.pending, ...action.payload };
    },

    /**
     * User klik Reload & validasi lolos → atomic commit.
     * Inilah satu-satunya action yang boleh memicu fetch di Grid.
     */
    commitFilter(state) {
      state.committed = { ...state.pending };

      // Sync ke deprecated fields agar halaman lama tetap berjalan
      state.selectedDate = state.committed.tglDari;
      state.selectedDate2 = state.committed.tglSampai;
      state.selectedBank = String(state.committed.bank_id ?? '');
      state.selectedKaryawan1 = state.committed.karyawan1;
      state.selectedKaryawan2 = state.committed.karyawan2;
      state.selectedYear = state.committed.year;

      state.selectedPengeluaranEmkl = state.committed.pengeluaranEmkl;
      state.selectedPengeluaranEmklNama = state.committed.pengeluaranEmklNama;
      state.selectedPenerimaanEmkl = state.committed.penerimaanEmkl;
      state.selectedPenerimaanEmklNama = state.committed.penerimaanEmklNama;
      state.selectedJenisOrderan = state.committed.jenisOrderan;
      state.selectedJenisOrderanNama = state.committed.jenisOrderanNama;
      state.selectedJenisStatusJob = state.committed.jenisStatusJob;
      state.selectedJenisStatusJobNama = state.committed.jenisStatusJobNama;
      state.selectedBiayaEmkl = state.committed.biayaEmkl;
      state.selectedBiayaEmklNama = state.committed.biayaEmklNama;

      state.onReload = true;
    },

    /** Buang draft, kembalikan ke committed terakhir */
    resetPending(state) {
      state.pending = { ...state.committed };
    },

    // ----------------------------------------------------------
    // ✅ DEPRECATED: dijaga untuk backward compat
    // Halaman lama masih bisa dispatch ini tanpa error
    // ----------------------------------------------------------

    setSelectedDate(state, action: PayloadAction<string>) {
      state.selectedDate = action.payload;
      state.pending.tglDari = action.payload;
    },
    setSelectedDate2(state, action: PayloadAction<string>) {
      state.selectedDate2 = action.payload;
      state.pending.tglSampai = action.payload;
    },
    setSelectedYear(state, action: PayloadAction<string>) {
      state.selectedYear = action.payload;
      state.pending.year = action.payload;
    },
    setSelectedKaryawan1(state, action: PayloadAction<string>) {
      state.selectedKaryawan1 = action.payload;
      state.pending.karyawan1 = action.payload;
    },
    setSelectedKaryawan2(state, action: PayloadAction<string>) {
      state.selectedKaryawan2 = action.payload;
      state.pending.karyawan2 = action.payload;
    },
    setSelectedBank(state, action: PayloadAction<string>) {
      state.selectedBank = action.payload;
      state.pending.bank_id = action.payload;
    },
    setSelectedPengeluaranEmkl(state, action: PayloadAction<string | null>) {
      state.selectedPengeluaranEmkl = action.payload;
      state.pending.pengeluaranEmkl = action.payload;
    },
    setSelectedPengeluaranEmklNama(state, action: PayloadAction<string>) {
      state.selectedPengeluaranEmklNama = action.payload;
      state.pending.pengeluaranEmklNama = action.payload;
    },
    setSelectedPenerimaanEmkl(state, action: PayloadAction<string | null>) {
      state.selectedPenerimaanEmkl = action.payload;
      state.pending.penerimaanEmkl = action.payload;
    },
    setSelectedPenerimaanEmklNama(state, action: PayloadAction<string>) {
      state.selectedPenerimaanEmklNama = action.payload;
      state.pending.penerimaanEmklNama = action.payload;
    },
    setSelectedJenisOrderan(state, action: PayloadAction<string>) {
      state.selectedJenisOrderan = action.payload;
      state.pending.jenisOrderan = action.payload;
    },
    setSelectedJenisOrderanNama(state, action: PayloadAction<string>) {
      state.selectedJenisOrderanNama = action.payload;
      state.pending.jenisOrderanNama = action.payload;
    },
    setSelectedJenisStatusJob(state, action: PayloadAction<number | null>) {
      state.selectedJenisStatusJob = action.payload;
      state.pending.jenisStatusJob = action.payload;
    },
    setSelectedJenisStatusJobNama(state, action: PayloadAction<string>) {
      state.selectedJenisStatusJobNama = action.payload;
      state.pending.jenisStatusJobNama = action.payload;
    },
    setSelectedBiayaEmkl(state, action: PayloadAction<number | null>) {
      state.selectedBiayaEmkl = action.payload;
      state.pending.biayaEmkl = action.payload;
    },
    setSelectedBiayaEmklNama(state, action: PayloadAction<string>) {
      state.selectedBiayaEmklNama = action.payload;
      state.pending.biayaEmklNama = action.payload;
    },
    setOnReload(state, action: PayloadAction<boolean>) {
      state.onReload = action.payload;
    },
    clearFilter(state) {
      state.pending = { ...emptyFilter };
      state.committed = { ...emptyFilter };

      state.selectedDate = '';
      state.selectedDate2 = '';
      state.selectedBank = '';
      state.selectedKaryawan1 = '';
      state.selectedKaryawan2 = '';
      state.selectedYear = '';
      state.selectedPengeluaranEmkl = null;
      state.selectedPengeluaranEmklNama = '';
      state.selectedPenerimaanEmkl = null;
      state.selectedPenerimaanEmklNama = '';
      state.selectedJenisOrderan = '';
      state.selectedJenisOrderanNama = '';
      state.selectedJenisStatusJob = null;
      state.selectedJenisStatusJobNama = '';
      state.selectedBiayaEmkl = null;
      state.selectedBiayaEmklNama = '';
      state.onReload = false;
    },
    clearOnReload(state) {
      state.onReload = false;
    }
  }
});

export const {
  // ✅ New
  setPending,
  commitFilter,
  resetPending,

  // ✅ Deprecated tapi masih bisa dipakai
  setSelectedDate,
  setSelectedDate2,
  setSelectedYear,
  setSelectedBank,
  setSelectedKaryawan1,
  setSelectedKaryawan2,
  setSelectedPengeluaranEmkl,
  setSelectedPengeluaranEmklNama,
  setSelectedPenerimaanEmkl,
  setSelectedPenerimaanEmklNama,
  setSelectedJenisOrderan,
  setSelectedJenisOrderanNama,
  setSelectedJenisStatusJob,
  setSelectedJenisStatusJobNama,
  setSelectedBiayaEmkl,
  setSelectedBiayaEmklNama,
  setOnReload,
  clearFilter,
  clearOnReload
} = filterSlice.actions;

export default filterSlice.reducer;
