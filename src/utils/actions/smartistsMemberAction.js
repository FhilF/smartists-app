import {
  FETCH_SMARTISTS_MEMBER_BEGIN,
  FETCH_SMARTISTS_MEMBER_SUCCESS,
  FETCH_SMARTISTS_MEMBER_FAILURE,
  CLEAR_SMARTISTS_MEMBER,
} from "../types";
import { fetchSmartistsMemberAPI } from "../api";


export const fetchSmartistsMember = (query) => async (dispatch) => {
    dispatch({
      type: FETCH_SMARTISTS_MEMBER_BEGIN,
    });
    try {
      let data = await fetchSmartistsMemberAPI(query);
      dispatch({
        type: FETCH_SMARTISTS_MEMBER_SUCCESS,
        payload: { data },
      });
    } catch (error) {
      dispatch({ type: FETCH_SMARTISTS_MEMBER_FAILURE, payload: { error } });
    }
  };


  export const clearSmartistsMember = (query) => async (dispatch) => {
    dispatch({
      type: CLEAR_SMARTISTS_MEMBER,
    });
  };