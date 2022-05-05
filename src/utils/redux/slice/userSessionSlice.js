import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  smartContractsApi,
  nonFungibleTokensApi,
  smartistsContractAddress,
  accountsApi,
  isMainnet,
} from "config";
import axios from "axios";

import { apiServer } from "config";

export const getSmartistsUserAsync = createAsyncThunk(
  "smartistsUserSession/getSmartistsUserAsync",
  (payload, { dispatch }) => {
    return axios
      .get(
        `${apiServer}/smartistsusers/${payload.walletAddress}${
          payload.isMainnet ? "?isMainnet=true" : ""
        }`
      )
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

export const registerSmartistsUserAsync = createAsyncThunk(
  "smartistsUserSession/registerSmartistsUserAsync",
  (payload, { dispatch }) => {
    return axios
      .post(`${apiServer}/smartistsusers`, { ...payload })
      .then((response) => {
        console.log(response);
        return response.data;
      })
      .catch((error) => {
        console.log(error);
        throw JSON.stringify(error.response.data);
      });
  }
);

export const getSessionedMemberNftHoldingsAsync = createAsyncThunk(
  "smartistsUserSession/getSessionedMemberNftHoldingsAsync",
  (payload, { dispatch }) => {
    return nonFungibleTokensApi
      .getNftHoldings({
        principal: payload.walletAddress,
        asset_identifiers: payload.assetIdentifiers
      })
      .then((res) => {
        return res.results;
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
  smartistsUserSession: {
    status: "idle",
    data: {},
    error: {},
  },
  smartistsUserSignUp: {
    status: "idle",
    data: {},
    error: {},
  },
  userSessionType: {
    status: "idle",
    data: "User",
    error: {},
  },
  nftList: {
    status: "idle",
    data: {},
    error: {},
  },
};

const smartistsUserSessionSlice = createSlice({
  name: "smartistsUserSession",
  initialState: { ...smartistsUserInitialState },
  reducers: {
    defineSmartistsUserSession: (state, action) => {
      state.smartistsUserSession = {
        status: "fulfilled",
        data: action.payload,
        error: {},
      };
    },
    defineUserSessionType: (state, action) => {
      state.userSessionType = {
        status: "fulfilled",
        data: action.payload,
        error: {},
      };
    },
    updateSmartistsUserSession: (state, action) => {
      state.smartistsUserSession = {
        status: "fulfilled",
        data: {
          ...state.smartistsUserSession.data,
          ...action.payload,
        },
        error: {},
      };
    },
    defineStudioUserSession: (state, action) => {
      state.smartistsUserSession = {
        status: "fulfilled",
        data: {
          ...state.smartistsUserSession.data,
          ...action.payload,
        },
        error: {},
      };
    },
    defineFeaturedWorkUserSession: (state, action) => {
      state.smartistsUserSession = {
        status: "fulfilled",
        data: {
          ...state.smartistsUserSession.data.smartistsUser,
          Studio: {
            ...state.smartistsUserSession.data.smartistsUser.Studio,
            FeaturedWorks: [
              ...state.smartistsUserSession.data.smartistsUser.Studio
                .FeaturedWorks,
              action.payload.FeaturedWork,
            ],
          },
        },
        error: {},
      };
    },
  },
  extraReducers: {
    [getSmartistsUserAsync.pending]: (state, action) => {
      state.smartistsUser = {
        status: "pending",
        data: {},
        error: {},
      };
    },
    [getSmartistsUserAsync.fulfilled]: (state, action) => {
      state.smartistsUser = {
        status: "fulfilled",
        data: action.payload,
        error: {},
      };
    },
    [getSmartistsUserAsync.rejected]: (state, action) => {
      state.smartistsUser = {
        status: "rejected",
        data: {},
        error: action.error,
      };
    },

    [registerSmartistsUserAsync.pending.type]: (state, action) => {
      state.smartistsUserSignUp = {
        status: "pending",
        data: {},
        error: {},
      };
    },
    [registerSmartistsUserAsync.fulfilled.type]: (state, action) => {
      state.smartistsUserSignUp = {
        status: "fulfilled",
        data: action.payload,
        error: {},
      };
    },
    [registerSmartistsUserAsync.rejected.type]: (state, action) => {
      state.smartistsUserSignUp = {
        status: "rejected",
        data: {},
        error: action.error.message,
      };
    },

    [getSessionedMemberNftHoldingsAsync.pending.type]: (state, action) => {
      state.nftList = {
        status: "pending",
        data: {},
        error: {},
      };
    },
    [getSessionedMemberNftHoldingsAsync.fulfilled.type]: (state, action) => {
      state.nftList = {
        status: "fulfilled",
        data: action.payload,
        error: {},
      };
    },
    [getSessionedMemberNftHoldingsAsync.rejected.type]: (state, action) => {
      state.nftList = {
        status: "rejected",
        data: {},
        error: action.error,
      };
    },
  },
});

export const selectUserSession = (state) => state.userSessionReducer;
// export const selectSessionUserNFT = (state) => state;

export const {
  defineStudioUserSession,
  defineSmartistsUserSession,
  defineFeaturedWorkUserSession,
  defineUserSessionType,
  updateSmartistsUserSession,
} = smartistsUserSessionSlice.actions;

export default smartistsUserSessionSlice.reducer;
