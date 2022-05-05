import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { nanoid } from "nanoid";
import axios from "axios";

import { apiServer } from "config";

export const createStudioAsync = createAsyncThunk(
  "smartists/createStudioAsync",
  (payload, { dispatch }) => {
    return axios
      .post(`${apiServer}/studios`, { ...payload })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error)
        throw JSON.stringify(error.response.data);
      });
  }
);

const smartistsUserInitialState = {
  newStudio: {
    status: "idle",
    data: {},
    error: {},
  },
};

const smartistsUserSlice = createSlice({
  name: "studio",
  initialState: { ...smartistsUserInitialState },
  reducers: {
    
  },
  extraReducers: {
    [createStudioAsync.pending.type]: (state, action) => {
      state.smartistsUserSignUp = {
        status: "pending",
        data: {},
        error: {},
      };
    },
    [createStudioAsync.fulfilled.type]: (state, action) => {
      state.smartistsUserSignUp = {
        status: "fulfilled",
        data: action.payload,
        error: {},
      };
    },
    [createStudioAsync.rejected.type]: (state, action) => {
      state.smartistsUserSignUp = {
        status: "rejected",
        data: {},
        error: action.error.message,
      };
    },
  },
});

export const { defineSmartistsUserSession } =
  smartistsUserSlice.actions;

export default smartistsUserSlice.reducer;
