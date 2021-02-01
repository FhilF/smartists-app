import { combineReducers } from "redux";
import smartistsMemberReducer from "./smartistsMemberReducer";
import portfolioReducer from "./portfolioReducer";
import projectReducer from "./projectReducer";

export default combineReducers({
  smartistsMemberReducer: smartistsMemberReducer,
  portfolioReducer: portfolioReducer,
  projectReducer: projectReducer
});
