import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ReportDataState {
  reportData: Record<string, any>[];
  detailDataReport: Record<string, any>[];
}

const initialState: ReportDataState = {
  reportData: [],
  detailDataReport: []
};

const reportData = createSlice({
  name: 'report-data',
  initialState,
  reducers: {
    setReportData(state, action: PayloadAction<Record<string, any>[]>) {
      state.reportData = action.payload;
    },
    setDetailDataReport(state, action: PayloadAction<Record<string, any>[]>) {
      state.detailDataReport = action.payload;
    },
    clearReport(state) {
      state.reportData = [];
      state.detailDataReport = [];
    }
  }
});

export const { setReportData, setDetailDataReport, clearReport } =
  reportData.actions;
export default reportData.reducer;
