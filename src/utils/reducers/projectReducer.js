import {
    FETCH_PROJECT_BEGIN,
    FETCH_PROJECT_SUCCESS,
    FETCH_PROJECT_FAILURE,
    CLEAR_PROJECT,
  } from "../types";
  

  const initialState = {
    loadingProject: false,
    errorProject: null,
    project: [],
  };
  
  function portfolio(state = initialState, action) {
    switch (action.type) {
      case FETCH_PROJECT_BEGIN:
        // Mark the state as "loading" so we can show a spinner or something
        // Also, reset any errors. We're starting fresh.
        return {
          ...state,
          loadingProject: true,
          errorProject: null,
        };
  
      case FETCH_PROJECT_SUCCESS:
        return {
          ...state,
          loadingProject: false,
          project: action.payload.data,
        };
  
      case FETCH_PROJECT_FAILURE:
        return {
          ...state,
          loadingProject: false,
          errorProject: action.payload.error,
          project: [],
        };
  
      case CLEAR_PROJECT:
        return {
          ...state,
          loadingProject: false,
          errorProject: false,
          project: [],
        };
  
      default:
        return state;
    }
  }
  
  export default portfolio;