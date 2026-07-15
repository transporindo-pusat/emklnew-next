import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the state as a mapping from arbitrary keys to PDF URLs
interface PdfUrlsState {
  pdfUrls: Record<string, string>;
}

const initialState: PdfUrlsState = {
  pdfUrls: {}
};

const pdfUrlsSlice = createSlice({
  name: 'pdfUrls',
  initialState,
  reducers: {
    setPdfUrl(state, action: PayloadAction<{ key: string; url: string }>) {
      state.pdfUrls[action.payload.key] = action.payload.url;
    },

    removePdfUrl(state, action: PayloadAction<string>) {
      delete state.pdfUrls[action.payload];
    },
    clearPdfUrls(state) {
      state.pdfUrls = {};
    }
  }
});

export const { setPdfUrl, removePdfUrl, clearPdfUrls } = pdfUrlsSlice.actions;
export default pdfUrlsSlice.reducer;
