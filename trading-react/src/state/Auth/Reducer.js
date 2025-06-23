import {
  GET_USER_FAILURE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE,
  TOGGLE_2FA_REQUEST,
  TOGGLE_2FA_SUCCESS,
  TOGGLE_2FA_FAILURE
} from "./ActionType";

const initialState = {
  user: null,
  loading: false,
  error: null,
  jwt: localStorage.getItem("jwt") || null,
  loaded: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_REQUEST:
    case LOGIN_REQUEST:
    case GET_USER_REQUEST:
    case UPDATE_PROFILE_REQUEST:
      return { ...state, loading: true, error: null };

    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
  return {
    ...state,
    jwt: action.payload.jwt, // ✅ Save JWT to Redux state
    user: action.payload.user,
    loading: false,
    isAuthenticated: true,
  };


    case GET_USER_SUCCESS:
    case UPDATE_PROFILE_SUCCESS:
      return { ...state, loading: false, user: action.payload,loaded: true, };

    case REGISTER_FAILURE:
    case LOGIN_FAILURE:
    case GET_USER_FAILURE:
    case UPDATE_PROFILE_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case TOGGLE_2FA_REQUEST:
  return { ...state, loading: true };

case TOGGLE_2FA_SUCCESS:
  return {
    ...state,
    loading: false,
    success: true,
    message: action.payload.message,
  };

case TOGGLE_2FA_FAILURE:
  return { ...state, loading: false, error: action.payload };

    case LOGOUT:
      return { ...initialState, jwt: null };

    default:
      return state;
  }
};

export default authReducer;
