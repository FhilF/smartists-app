import {
  FETCH_SMARTISTS_MEMBER_BEGIN,
  FETCH_SMARTISTS_MEMBER_SUCCESS,
  FETCH_SMARTISTS_MEMBER_FAILURE,
  CLEAR_SMARTISTS_MEMBER,
  FETCH_SMARTISTS_MEMBERS_BEGIN,
  FETCH_SMARTISTS_MEMBERS_SUCCESS,
  FETCH_SMARTISTS_MEMBERS_FAILURE,
  CLEAR_SMARTISTS_MEMBERS,
} from "../types";
import { fetchSmartistsMemberAPI, fetchSmartistsMembersAPI } from "../api";


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


  export const fetchSmartistsMembers = (query) => async (dispatch) => {
    dispatch({
      type: FETCH_SMARTISTS_MEMBERS_BEGIN,
    });
    try {
      let data = await fetchSmartistsMembersAPI(query);
      dispatch({
        type: FETCH_SMARTISTS_MEMBERS_SUCCESS,
        payload: { data },
      });
    } catch (error) {
      dispatch({ type: FETCH_SMARTISTS_MEMBERS_FAILURE, payload: { error } });
    }
  };


  export const clearSmartistsMember = (query) => async (dispatch) => {
    dispatch({
      type: CLEAR_SMARTISTS_MEMBER,
    });
  };

  export const clearSmartistsMembers = (query) => async (dispatch) => {
    dispatch({
      type: CLEAR_SMARTISTS_MEMBERS,
    });
  };