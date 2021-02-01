import {
  FETCH_PORTFOLIO_BEGIN,
  FETCH_PORTFOLIO_SUCCESS,
  FETCH_PORTFOLIO_FAILURE,
  CLEAR_PORTFOLIO,
} from "../types";
import { fetchPortfolioAPI } from "../api";

export const fetchPortfolio = (query) => async (dispatch) => {
  dispatch({
    type: FETCH_PORTFOLIO_BEGIN,
  });
  try {
    let data = await fetchPortfolioAPI(query);
    dispatch({
      type: FETCH_PORTFOLIO_SUCCESS,
      payload: { data },
    });
  } catch (error) {
    dispatch({ type: FETCH_PORTFOLIO_FAILURE, payload: { error } });
  }
};

export const clearPortfolio = (query) => async (dispatch) => {
  dispatch({
    type: CLEAR_PORTFOLIO,
  });
};
