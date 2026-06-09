import { createSlice } from '@reduxjs/toolkit';

interface SpinnerState {
  isVisible: boolean;
}

const initialState: SpinnerState = {
  isVisible: false,
};

const spinnerSlice = createSlice({
  name: 'spinner',
  initialState,
  reducers: {
    showSpinner(state) {
      state.isVisible = true;
    },
    hideSpinner(state) {
      state.isVisible = false;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => action.type === 'api/executeMutation/pending',
      (state) => {
        state.isVisible = true;
      }
    );
    builder.addMatcher(
      (action) =>
        action.type === 'api/executeMutation/fulfilled' ||
        action.type === 'api/executeMutation/rejected',
      (state) => {
        state.isVisible = false;
      }
    );
  },
});

export const { showSpinner, hideSpinner } = spinnerSlice.actions;
export default spinnerSlice.reducer;
