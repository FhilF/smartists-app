import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { nanoid } from "nanoid";
import axios from "axios";

import { apiServer } from "config";

export const getProjectAsync = createAsyncThunk(
  "project/getProjectAsync",
  (payload, { dispatch }) => {
    return axios
      .get(`${apiServer}/projects/studioId/${payload.studioId}`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        if (err.response.status === 404) {
          return {};
        } else {
          throw JSON.stringify(err.response);
        }
      });
  }
);

const projectInitialState = {
  smartistsUserProject: {
    status: "idle",
    data: {},
    error: {},
  },
};

const projectSlice = createSlice({
  name: "project",
  initialState: { ...projectInitialState },
  reducers: {
    pushProject: (state, action) => {
      state.smartistsUserProject = {
        status: "fulfilled",
        data: {
          Projects: [
            ...state.smartistsUserProject.data.Projects,
            action.payload,
          ],
        },
        error: {},
      };
    },
  },
  extraReducers: {
    [getProjectAsync.pending]: (state, action) => {
      state.smartistsUserProject = {
        status: "pending",
        data: {},
        error: {},
      };
    },
    [getProjectAsync.fulfilled]: (state, action) => {
      state.smartistsUserProject = {
        status: "fulfilled",
        data: action.payload,
        error: {},
      };
    },
    [getProjectAsync.rejected]: (state, action) => {
      state.smartistsUserProject = {
        status: "rejected",
        data: {},
        error: action.error,
      };
    },
  },
});

export const { pushProject } = projectSlice.actions;

export default projectSlice.reducer;
