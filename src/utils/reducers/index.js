import { combineReducers } from "redux";
import smartistsMemberReducer from "./smartistsMemberReducer";
import featuredArtworkReducer from "./featuredArtworkReducer";
import projectReducer from "./projectReducer";

export default combineReducers({
  smartistsMemberReducer: smartistsMemberReducer,
  featuredArtworkReducer: featuredArtworkReducer,
  projectReducer: projectReducer
});
