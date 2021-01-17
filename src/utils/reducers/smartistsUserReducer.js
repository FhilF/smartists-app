import {
  FETCH_SMARTISTS_USER_BEGIN,
  FETCH_SMARTISTS_USER_SUCCESS,
  FETCH_SMARTISTS_USER_FAILURE,
  CLEAR_SMARTISTS_USER,
} from "../types";

const initialState = {
  loadingSmartistsUser: false,
  errorSmartistsUser: null,
  smartistsUser: [],
};

function smartistsUserReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_SMARTISTS_USER_BEGIN:
      // Mark the state as "loading" so we can show a spinner or something
      // Also, reset any errors. We're starting fresh.
      return {
        ...state,
        loadingSmartistsUser: true,
        errorSmartistsUser: null,
      };

    case FETCH_SMARTISTS_USER_SUCCESS:
      return {
        ...state,
        loadingSmartistsUser: false,
        smartistsUser: action.payload.data,
      };

    case FETCH_SMARTISTS_USER_FAILURE:
      return {
        ...state,
        loadingSmartistsUser: false,
        errorSmartistsUser: action.payload.error,
        smartistsUser: [],
      };

    default:
      return state;
  }
}

export default smartistsUserReducer;
