import { configureStore } from "@reduxjs/toolkit";
import smartistsUserSlice from "./slice/smartistsUserSlice";
import featuredWorkSlice from "./slice/featuredWorkSlice";
import projectSlice from "./slice/projectSlice";
import userSessionSlice from "./slice/userSessionSlice";
import nftSlice from "./slice/nftSlice";

export const store = configureStore({
  reducer: {
    userSessionReducer: userSessionSlice,
    smartistsUserReducer: smartistsUserSlice,
    featuredWorkReducer: featuredWorkSlice,
    projectReducer: projectSlice,
    nftReducer: nftSlice,
  },
});
