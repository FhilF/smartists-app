import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { nanoid } from "nanoid";
import axios from "axios";
import {
  smartContractsApi,
  nonFungibleTokensApi,
  smartistsContractAddress,
  accountsApi,
  isMainnet,
} from "config";

import { apiServer } from "config";

export const getSmartistsUserAsync = createAsyncThunk(
  "smartistsMember/getSmartistsUserAsync",
  (payload, { dispatch }) => {
    return axios
      .get(`${apiServer}/smartistsusers/${payload.walletAddress}`)
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

export const getFeaturedWorkByIdAsync = createAsyncThunk(
  "smartistsMember/getFeaturedWorkByIdAsync",
  (payload, { dispatch }) => {
    return axios
      .get(`${apiServer}/featuredworks/${payload.id}`)
      .then((res) => {
        return res.data.FeaturedWork;
      })
      .catch((err) => {
        if (err.response.status === 404) {
          return null;
        } else {
          throw JSON.stringify(err.response);
        }
      });
  }
);

export const getFeaturedProjectByIdAsync = createAsyncThunk(
  "smartistsMember/getFeaturedProjectByIdAsync",
  (payload, { dispatch }) => {
    return axios
      .get(`${apiServer}/projects/${payload.id}`)
      .then((res) => {
        console.log(res);
        return res.data.FeaturedProject;
      })
      .catch((err) => {
        if (err.response.status === 404) {
          return null;
        } else {
          throw JSON.stringify(err.response);
        }
      });
  }
);

export const getSmartistsMemberNftHoldingsAsync = createAsyncThunk(
  "smartistsMember/getSmartistsMemberNftHoldingsAsync",
  (payload, { dispatch }) => {
    return nonFungibleTokensApi
      .getNftHoldings({
        principal: payload.walletAddress,
      })
      .then((res) => {
        return { list: res.results, walletAddress: payload.walletAddress };
      })
      .catch((err) => {
        throw err;
      });
  }
);

const smartistsUserInitialState = {
  smartistsUser: {
    status: "idle",
    data: {},
    error: {},
  },
  featuredWork: {
    status: "idle",
    data: null,
    error: {},
  },
  featuredProject: {
    status: "idle",
    data: null,
    error: {},
  },
  nftList: {
    status: "idle",
    data: {},
    walletAddress: null,
    error: {},
  },
};

const smartistsUserSlice = createSlice({
  name: "smartistsUser",
  initialState: { ...smartistsUserInitialState },
  reducers: {
    defineFeaturedWork: (state, action) => {
      state.featuredWork = {
        status: "fulfilled",
        data: action.payload,
        error: {},
      };
    },

    defineFeaturedProject: (state, action) => {
      state.featuredProject = {
        status: "fulfilled",
        data: action.payload,
        error: {},
      };
    },
    updateFeaturedProject: (state, action) => {
      state.featuredProject = {
        status: "fulfilled",
        data: {
          ...state.smartistsUserSession.data,
          ...action.payload,
        },
        error: {},
      };
    },
  },
  extraReducers: {
    [getFeaturedWorkByIdAsync.pending]: (state, action) => {
      state.featuredWork = {
        status: "pending",
        data: {},
        error: {},
      };
    },
    [getFeaturedWorkByIdAsync.fulfilled]: (state, action) => {
      state.featuredWork = {
        status: "fulfilled",
        data: action.payload,
        error: {},
      };
    },
    [getFeaturedWorkByIdAsync.rejected]: (state, action) => {
      state.featuredWork = {
        status: "rejected",
        data: {},
        error: action.error,
      };
    },

    [getFeaturedProjectByIdAsync.pending]: (state, action) => {
      state.featuredProject = {
        status: "pending",
        data: {},
        error: {},
      };
    },
    [getFeaturedProjectByIdAsync.fulfilled]: (state, action) => {
      state.featuredProject = {
        status: "fulfilled",
        data: action.payload,
        error: {},
      };
    },
    [getFeaturedProjectByIdAsync.rejected]: (state, action) => {
      state.featuredProject = {
        status: "rejected",
        data: {},
        error: action.error,
      };
    },

    [getSmartistsMemberNftHoldingsAsync.pending]: (state, action) => {
      state.nftList = {
        status: "pending",
        data: {},
        error: {},
      };
    },
    [getSmartistsMemberNftHoldingsAsync.fulfilled]: (state, action) => {
      state.nftList = {
        status: "fulfilled",
        data: action.payload.list,
        walletAddress: action.payload.walletAddress,
        error: {},
      };
    },
    [getSmartistsMemberNftHoldingsAsync.rejected]: (state, action) => {
      state.nftList = {
        status: "rejected",
        data: {},
        error: action.error,
      };
    },
  },
});

export const selectSmartistsUser = (state) => state.smartistsUserReducer;

export const {
  defineFeaturedWork,
  defineFeaturedProject,
  updateFeaturedProject,
} = smartistsUserSlice.actions;

export default smartistsUserSlice.reducer;
