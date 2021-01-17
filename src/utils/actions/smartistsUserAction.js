import {
  FETCH_SMARTISTS_USER_BEGIN,
  FETCH_SMARTISTS_USER_SUCCESS,
  FETCH_SMARTISTS_USER_FAILURE,
  CLEAR_SMARTISTS_USER,
} from "../types";
import { fetchSmartistsUserAPI } from "../api";


export const fetchSmartistsUser = (query) => async (dispatch) => {
    dispatch({
      type: FETCH_SMARTISTS_USER_BEGIN,
    });
    try {
      let data = await fetchSmartistsUserAPI(query);
      dispatch({
        type: FETCH_SMARTISTS_USER_SUCCESS,
        payload: { data },
      });
    } catch (error) {
      dispatch({ type: FETCH_SMARTISTS_USER_FAILURE, payload: { error } });
    }
  };