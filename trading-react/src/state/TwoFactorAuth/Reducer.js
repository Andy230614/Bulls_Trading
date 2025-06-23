// src/state/Otp/otpReducer.js

import * as types from "./ActionType";

const initialState = {
  loading: false,
  error: null,
  success: false,
  session: null,
  jwt: null,
  message: "",
};

const otpReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SEND_OTP_REQUEST:
    case types.VERIFY_OTP_REQUEST:
    case types.FORGOT_PASSWORD_REQUEST:
      return { ...state, loading: true, error: null, success: false };

    case types.SEND_OTP_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        session: action.payload.session,
        message: action.payload.message,
      };

    case types.VERIFY_OTP_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        jwt: action.payload.jwt,
        message: action.payload.message,
      };

    case types.FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        message: action.payload.message,
      };

    case types.SEND_OTP_FAILURE:
    case types.VERIFY_OTP_FAILURE:
    case types.FORGOT_PASSWORD_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };

    default:
      return state;
  }
};

export default otpReducer;
