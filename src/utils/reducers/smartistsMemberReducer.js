import {
  FETCH_SMARTISTS_MEMBER_BEGIN,
  FETCH_SMARTISTS_MEMBER_SUCCESS,
  FETCH_SMARTISTS_MEMBER_FAILURE,
  CLEAR_SMARTISTS_MEMBER,
} from "../types";

const initialState = {
  loadingSmartistsMember: false,
  errorSmartistsMember: null,
  smartistsMember: [],
};

function smartistsMember(state = initialState, action) {
  switch (action.type) {
    case FETCH_SMARTISTS_MEMBER_BEGIN:
      // Mark the state as "loading" so we can show a spinner or something
      // Also, reset any errors. We're starting fresh.
      return {
        ...state,
        loadingSmartistsMember: true,
        errorSmartistsMember: null,
      };

    case FETCH_SMARTISTS_MEMBER_SUCCESS:
      return {
        ...state,
        loadingSmartistsMember: false,
        smartistsMember: action.payload.data,
      };

    case FETCH_SMARTISTS_MEMBER_FAILURE:
      return {
        ...state,
        loadingSmartistsMember: false,
        errorSmartistsMember: action.payload.error,
        smartistsMember: [],
      };

    case CLEAR_SMARTISTS_MEMBER:
      return {
        ...state,
        loadingSmartistsMember: false,
        errorSmartistsMember: false,
        smartistsMember: [],
      };

    default:
      return state;
  }
}

export default smartistsMember;
