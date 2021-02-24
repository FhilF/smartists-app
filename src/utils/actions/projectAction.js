import {
  FETCH_PROJECT_BEGIN,
  FETCH_PROJECT_SUCCESS,
  FETCH_PROJECT_FAILURE,
  CLEAR_PROJECT,
} from "../types";
import { fetchProjectAPI } from "../api";

import { getMediaFileFromUser } from "lib/media";

export const fetchProject = (query, username) => (dispatch) => {
  dispatch(fetchProjectBegin());
  fetchProjectAPI(query)
    .then((res) => {
      return Promise.all(
        res.map(async (el, i) => {
          return getMediaFileFromUser(username, el.fileName).then(
            (value) => {
              if (value) {
                el.file = value;
              } else {
                el.file = null;
              }
              delete el["fileName"];
              return el;
            }
          );
        })
      );
    })
    .then((res) => {
      dispatch(fetchProjectSuccess(res));
    })
    .catch((err) => {
      dispatch(fetchProjectFailure(err));
    });
};

export const fetchProjectBegin = () => ({
  type: FETCH_PROJECT_BEGIN,
});

export const fetchProjectSuccess = (data) => ({
  type: FETCH_PROJECT_SUCCESS,
  payload: { data },
});

export const fetchProjectFailure = (err) => ({
  type: FETCH_PROJECT_FAILURE,
  payload: { err },
});

export const clearProject = (query) => async (dispatch) => {
  dispatch({
    type: CLEAR_PROJECT,
  });
};
