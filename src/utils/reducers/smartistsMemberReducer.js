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

const initialState = {
  loadingSmartistsMember: false,
  errorSmartistsMember: null,
  smartistsMember: [],
  loadingSmartistsMembers: false,
  errorSmartistsMembers: null,
  smartistsMembers: [],
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


      case FETCH_SMARTISTS_MEMBERS_BEGIN:
      // Mark the state as "loading" so we can show a spinner or something
      // Also, reset any errors. We're starting fresh.
      return {
        ...state,
        loadingSmartistsMembers: true,
        errorSmartistsMembers: null,
      };

    case FETCH_SMARTISTS_MEMBERS_SUCCESS:
      return {
        ...state,
        loadingSmartistsMembers: false,
        smartistsMembers: action.payload.data,
      };

    case FETCH_SMARTISTS_MEMBERS_FAILURE:
      return {
        ...state,
        loadingSmartistsMembers: false,
        errorSmartistsMembers: action.payload.error,
        smartistsMembers: [],
      };

    case CLEAR_SMARTISTS_MEMBERS:
      return {
        ...state,
        loadingSmartistsMembers: false,
        errorSmartistsMembers: false,
        smartistsMembers: [],
      };

    default:
      return state;
  }
}

export default smartistsMember;
