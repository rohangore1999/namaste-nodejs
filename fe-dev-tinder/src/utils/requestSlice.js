import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "requests",
  initialState: null,
  reducers: {
    addRequest: (state, action) => action.payload,
    removeRequest: (state, action) => {
      console.log({state})
      console.log("action.payload >>", action.payload)
      // state will contain the current state (addRequest data), from that we are removing the accepted/rejected id
      const newArr = state.filter(request => request._id !== action.payload)

      return newArr
    }
  },
});

export const { addRequest, removeRequest } = requestSlice.actions;
export default requestSlice.reducer;
