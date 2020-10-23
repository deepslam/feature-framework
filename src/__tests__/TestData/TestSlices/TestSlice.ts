import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TestSliceStateType = {
  messages: string[];
};

const initialState: TestSliceStateType = {
  messages: [],
};

const slice = createSlice({
  name: 'TestSlice',
  initialState,
  reducers: {
    updateMessages: (state, action: PayloadAction<string[]>) => ({
      ...state,
      messages: [...action.payload],
    }),
  },
});

export default slice;
