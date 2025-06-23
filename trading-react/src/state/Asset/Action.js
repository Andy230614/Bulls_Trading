import api from "../../config/api";
import {
  FETCH_ASSETS_REQUEST,
  FETCH_ASSETS_SUCCESS,
  FETCH_ASSETS_FAILURE,
  GET_HOLDING_SUCCESS,
  GET_HOLDING_FAILURE,
  GET_HOLDING_REQUEST
} from './ActionType';

export const fetchUserAssets = () => async (dispatch) => {
  dispatch({ type: FETCH_ASSETS_REQUEST });

  try {
    const response = await api.get('/api/asset');
    dispatch({ type: FETCH_ASSETS_SUCCESS, payload: response.data });
  } catch (error) {
    console.error("Asset fetch failed:", error);
    dispatch({ type: FETCH_ASSETS_FAILURE, payload: error.message });
  }
};

export const getHoldings = () => async (dispatch, getState) => {
  dispatch({ type: GET_HOLDING_REQUEST });

  try {
    const jwt = getState().auth?.jwt || localStorage.getItem("jwt");
    const response = await api.get("/api/asset/holdings", {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    dispatch({
      type: GET_HOLDING_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: GET_HOLDING_FAILURE,
      error: error?.response?.data?.message || error.message,
    });
  }
};
