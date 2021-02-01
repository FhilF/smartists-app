import {
    FETCH_PORTFOLIO_BEGIN,
    FETCH_PORTFOLIO_SUCCESS,
    FETCH_PORTFOLIO_FAILURE,
    CLEAR_PORTFOLIO,
  } from "../types";
  

  const initialState = {
    loadingPortfolio: false,
    errorPortfolio: null,
    portfolio: [],
  };
  
  function portfolio(state = initialState, action) {
    switch (action.type) {
      case FETCH_PORTFOLIO_BEGIN:
        // Mark the state as "loading" so we can show a spinner or something
        // Also, reset any errors. We're starting fresh.
        return {
          ...state,
          loadingPortfolio: true,
          errorPortfolio: null,
        };
  
      case FETCH_PORTFOLIO_SUCCESS:
        return {
          ...state,
          loadingPortfolio: false,
          portfolio: action.payload.data,
        };
  
      case FETCH_PORTFOLIO_FAILURE:
        return {
          ...state,
          loadingPortfolio: false,
          errorPortfolio: action.payload.error,
          portfolio: [],
        };
  
      case CLEAR_PORTFOLIO:
        return {
          ...state,
          loadingPortfolio: false,
          errorPortfolio: false,
          portfolio: [],
        };
  
      default:
        return state;
    }
  }
  
  export default portfolio;