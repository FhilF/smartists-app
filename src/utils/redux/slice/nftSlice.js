import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { nanoid } from "nanoid";
import axios from "axios";
import { StacksApiUrl } from "config";

import { apiServer } from "config";

export const getContractStoredAssetsAsync = createAsyncThunk(
  "nft/getContractStoredAssetsAsync",
  (payload, { dispatch }) => {
    console.log("Test")
    return axios
      .get(
        `${StacksApiUrl}/extended/v1/tokens/nft/holdings?principal=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.genuine-v1&asset_identifiers=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.genuine-v1::Genuine`
      )
      .then((res) => {
        console.log(res);
        return res.data;
      })
      .catch((err) => {
        console.log(err)
        if (err.response.status === 404) {
          return {};
        } else {
          throw JSON.stringify(err.response);
        }
      });
  }
);

const nftInitialState = {
  contractStoredAssets: {
    status: "idle",
    data: {},
    error: {},
  },
};

const nftSlice = createSlice({
  name: "nft",
  initialState: { ...nftInitialState },
  reducers: {},
  extraReducers: {
    [getContractStoredAssetsAsync.pending]: (state, action) => {
      state.contractStoredAssets = {
        status: "pending",
        data: {},
        error: {},
      };
    },
    [getContractStoredAssetsAsync.fulfilled]: (state, action) => {
      state.contractStoredAssets = {
        status: "fulfilled",
        data: action.payload,
        error: {},
      };
    },
    [getContractStoredAssetsAsync.rejected]: (state, action) => {
      state.contractStoredAssets = {
        status: "rejected",
        data: {},
        error: action.error,
      };
    },
  },
});

export default nftSlice.reducer;
