import {
  FETCH_FEATURED_ARTWORK_BEGIN,
  FETCH_FEATURED_ARTWORK_SUCCESS,
  FETCH_FEATURED_ARTWORK_FAILURE,
  CLEAR_FEATURED_ARTWORK,
} from "../types";
import { fetchFeaturedArtworkAPI } from "../api";

import { getMediaFileFromUser } from "lib/media";

export const fetchFeaturedArtwork = (query, username) => (dispatch) => {
  dispatch(fetchFeaturedArtworkBegin());

  fetchFeaturedArtworkAPI(query)
    .then((res) => {
      return Promise.all(
        res.map(async (el, i) => {
          return getMediaFileFromUser(
            username,
            el.media.fileName
          ).then((value) => {
            if (value) {
              el.media.file = value;
            } else {
              el.media.file = null;
            }
            delete el.media["fileName"];
            return el;
          });
        })
      );
    })
    .then((res) => {
      dispatch(fetchFeaturedArtworkSuccess(res));
    })
    .catch((err) => {
      dispatch(fetchFeaturedArtworkFailure(err));
    });
};

export const fetchFeaturedArtworkBegin = () => ({
  type: FETCH_FEATURED_ARTWORK_BEGIN,
});

export const fetchFeaturedArtworkSuccess = (data) => ({
  type: FETCH_FEATURED_ARTWORK_SUCCESS,
  payload: { data },
});

export const fetchFeaturedArtworkFailure = (err) => ({
  type: FETCH_FEATURED_ARTWORK_FAILURE,
  payload: { err },
});

export const fetchMedia = (data) => ({});

export const clearFeaturedArtwork = () => async (dispatch) => {
  dispatch({
    type: CLEAR_FEATURED_ARTWORK,
  });
};
