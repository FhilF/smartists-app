import {
    FETCH_FEATURED_ARTWORK_BEGIN,
    FETCH_FEATURED_ARTWORK_SUCCESS,
    FETCH_FEATURED_ARTWORK_FAILURE,
    CLEAR_FEATURED_ARTWORK,
  } from "../types";
  

  const initialState = {
    loadingFeaturedArtwork: false,
    errorFeaturedArtwork: null,
    featuredArtwork: [],
  };
  
  function featuredArtwork(state = initialState, action) {
    switch (action.type) {
      case FETCH_FEATURED_ARTWORK_BEGIN:
        // Mark the state as "loading" so we can show a spinner or something
        // Also, reset any errors. We're starting fresh.
        return {
          ...state,
          loadingFeaturedArtwork: true,
          errorFeaturedArtwork: null,
        };
  
      case FETCH_FEATURED_ARTWORK_SUCCESS:
        return {
          ...state,
          loadingFeaturedArtwork: false,
          featuredArtwork: action.payload.data,
        };
  
      case FETCH_FEATURED_ARTWORK_FAILURE:
        return {
          ...state,
          loadingFeaturedArtwork: false,
          errorFeaturedArtwork: action.payload.error,
          featuredArtwork: [],
        };
  
      case CLEAR_FEATURED_ARTWORK:
        return {
          ...state,
          loadingFeaturedArtwork: false,
          errorFeaturedArtwork: false,
          featuredArtwork: [],
        };
  
      default:
        return state;
    }
  }
  
  export default featuredArtwork;