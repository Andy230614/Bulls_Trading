import api from "../../config/api"; // ✅ use centralized axios instance
import {
  FETCH_WATCHLIST_REQUEST,
  FETCH_WATCHLIST_SUCCESS,
  FETCH_WATCHLIST_FAILURE,
  TOGGLE_WATCHLIST_ITEM_REQUEST,
  TOGGLE_WATCHLIST_ITEM_SUCCESS,
  TOGGLE_WATCHLIST_ITEM_FAILURE,
} from "./ActionType";

// ✅ Fetch user's watchlist
export const fetchWatchList = () => async (dispatch) => {
  dispatch({ type: FETCH_WATCHLIST_REQUEST });

  try {
    const res = await api.get("/api/watchlist/user");

    dispatch({
      type: FETCH_WATCHLIST_SUCCESS,
      payload: res.data.coins, // assuming backend returns { coins: [...] }
    });
  } catch (err) {
    dispatch({
      type: FETCH_WATCHLIST_FAILURE,
      payload: err.response?.data?.message || err.message,
    });
  }
};

// ✅ Toggle a coin in the watchlist
export const toggleWatchListItem = (coinId) => async (dispatch) => {
  dispatch({ type: TOGGLE_WATCHLIST_ITEM_REQUEST });

  try {
    const res = await api.patch(`/api/watchlist/add/coin/${coinId}`);

    dispatch({
      type: TOGGLE_WATCHLIST_ITEM_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: TOGGLE_WATCHLIST_ITEM_FAILURE,
      payload: err.response?.data?.message || err.message,
    });
  }
};
