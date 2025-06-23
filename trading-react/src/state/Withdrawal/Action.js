import {
  CREATE_WITHDRAWAL_REQUEST,
  CREATE_WITHDRAWAL_SUCCESS,
  CREATE_WITHDRAWAL_FAILURE,
  GET_WITHDRAWALS_REQUEST,
  GET_WITHDRAWALS_SUCCESS,
  GET_WITHDRAWALS_FAILURE,
  GET_ALL_WITHDRAWALS_SUCCESS,
  GET_ALL_WITHDRAWALS_FAILURE,
  PROCEED_WITHDRAWAL_SUCCESS,
  PROCEED_WITHDRAWAL_FAILURE,
} from "./ActionType";

import api from "../../config/api"; // using axios with interceptors

export const createWithdrawal = (amount) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_WITHDRAWAL_REQUEST });

    const response = await api.post("/api/withdrawal", { amount });

    dispatch({ type: CREATE_WITHDRAWAL_SUCCESS, payload: response.data }); // payload contains new withdrawal with status PENDING

  } catch (error) {
    dispatch({
      type: CREATE_WITHDRAWAL_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};


export const getUserWithdrawals = () => async (dispatch) => {
  try {
    dispatch({ type: GET_WITHDRAWALS_REQUEST });

    const response = await api.post("/api/history/withdrawal");

    dispatch({ type: GET_WITHDRAWALS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({
      type: GET_WITHDRAWALS_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const getAllWithdrawals = () => async (dispatch) => {
  try {
    const response = await api.get("/api/admin/withdrawal");

    dispatch({ type: GET_ALL_WITHDRAWALS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({
      type: GET_ALL_WITHDRAWALS_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const proceedWithdrawal = (id, accept) => async (dispatch) => {
  try {
    const response = await api.patch(`/api/admin/withdrawal/${id}/proceed/${accept}`);

    dispatch({ type: PROCEED_WITHDRAWAL_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({
      type: PROCEED_WITHDRAWAL_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};
