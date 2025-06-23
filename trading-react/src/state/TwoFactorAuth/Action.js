// src/state/Otp/Action.js
import * as types from "./ActionType";
import axios from "axios";

const API_BASE = "http://localhost:5455/auth";

export const sendOtp = (emailObj) => async (dispatch) => {
  dispatch({ type: types.SEND_OTP_REQUEST });

  try {
    const res = await axios.post(`${API_BASE}/send-otp`, emailObj); // ✅ Updated endpoint
    dispatch({ type: types.SEND_OTP_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({
      type: types.SEND_OTP_FAILURE,
      payload: error.response?.data?.message || "Failed to send OTP",
    });
  }
};

export const verifyOtp = (otp, id) => async (dispatch) => {
  dispatch({ type: types.VERIFY_OTP_REQUEST });

  try {
    const res = await axios.post(`${API_BASE}/two-factor/verify`, {
      sessionId: id,
      otp,
    });
    dispatch({ type: types.VERIFY_OTP_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({
      type: types.VERIFY_OTP_FAILURE,
      payload: error.response?.data?.message || "OTP verification failed",
    });
  }
};

export const forgotPassword = (email) => async (dispatch) => {
  dispatch({ type: types.FORGOT_PASSWORD_REQUEST });

  try {
    const res = await axios.post(`${API_BASE}/forgot-password`, { email });
    dispatch({ type: types.FORGOT_PASSWORD_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({
      type: types.FORGOT_PASSWORD_FAILURE,
      payload: error.response?.data?.message || "Failed to send reset link",
    });
  }
};
