import {
    FETCH_PROJECT_BEGIN,
    FETCH_PROJECT_SUCCESS,
    FETCH_PROJECT_FAILURE,
    CLEAR_PROJECT,
  } from "../types";
  import { fetchProjectAPI } from "../api";
  
  export const fetchProject = (query) => async (dispatch) => {
    dispatch({
      type: FETCH_PROJECT_BEGIN,
    });
    try {
      let data = await fetchProjectAPI(query);
      dispatch({
        type: FETCH_PROJECT_SUCCESS,
        payload: { data },
      });
    } catch (error) {
      dispatch({ type: FETCH_PROJECT_FAILURE, payload: { error } });
    }
  };
  
  export const clearProject = (query) => async (dispatch) => {
    dispatch({
      type: CLEAR_PROJECT,
    });
  };
  