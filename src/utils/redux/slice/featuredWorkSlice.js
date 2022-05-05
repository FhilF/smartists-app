import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { nanoid } from "nanoid";
import axios from "axios";

import { apiServer } from "config";

export const getFeaturedWorkAsync = createAsyncThunk(
  "featuredWork/getFeaturedWorkAsync",
  (payload, { dispatch }) => {
    return axios
      .get(`${apiServer}/featuredworks/studioId/${payload.studioId}`)
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

export const deleteFeaturedWorkAsync = createAsyncThunk(
  "featuredWork/deleteFeaturedWorkAsync",
  (payload, { dispatch }) => {
    return axios
      .delete(`${apiServer}/featuredworks/${payload.id}`)
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

const featuredWorkInitialState = {
  smartistsUserFeaturedWork: {
    status: "idle",
    data: {},
    error: {},
  },
};

const featuredWorkSlice = createSlice({
  name: "featuredWork",
  initialState: { ...featuredWorkInitialState },
  reducers: {
    pushFeaturedWork: (state, action) => {
      state.smartistsUserFeaturedWork = {
        status: "fulfilled",
        data: {
          FeaturedWorks: [
            ...state.smartistsUserFeaturedWork.data.FeaturedWorks,
            action.payload,
          ],
        },
        error: {},
      };
    },
  },
  extraReducers: {
    [getFeaturedWorkAsync.pending]: (state, action) => {
      state.smartistsUserFeaturedWork = {
        status: "pending",
        data: {},
        error: {},
      };
    },
    [getFeaturedWorkAsync.fulfilled]: (state, action) => {
      state.smartistsUserFeaturedWork = {
        status: "fulfilled",
        data: action.payload,
        error: {},
      };
    },
    [getFeaturedWorkAsync.rejected]: (state, action) => {
      state.smartistsUserFeaturedWork = {
        status: "rejected",
        data: {},
        error: action.error,
      };
    },

    [deleteFeaturedWorkAsync.pending]: (state, action) => {
      state.smartistsUserFeaturedWork = {
        status: "pending",
        data: {},
        error: {},
      };
    },
    [deleteFeaturedWorkAsync.fulfilled]: (state, action) => {
      state.smartistsUserFeaturedWork = {
        status: "fulfilled",
        data: {},
        error: {},
      };
    },
    [deleteFeaturedWorkAsync.rejected]: (state, action) => {
      state.smartistsUserFeaturedWork = {
        status: "rejected",
        data: {},
        error: action.error,
      };
    },
  },
});

export const { pushFeaturedWork } = featuredWorkSlice.actions;

export default featuredWorkSlice.reducer;
