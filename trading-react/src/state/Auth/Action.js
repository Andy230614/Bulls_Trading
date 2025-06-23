import axios from "axios";
import * as types from "./ActionType";
import { persistor } from "../../state/Store";
import { toast } from "react-toastify";

const baseUrl = "http://localhost:5455";

// Helper: Check if JWT token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch {
    return true;
  }
};

// ✅ Register
export const register = (userData) => async (dispatch) => {
  dispatch({ type: types.REGISTER_REQUEST });
  try {
    const response = await axios.post(`${baseUrl}/auth/signup`, userData);
    const user = response.data;

    localStorage.setItem("jwt", user.jwt);
    axios.defaults.headers.common["Authorization"] = `Bearer ${user.jwt}`;
    dispatch({ type: types.REGISTER_SUCCESS, payload: { jwt: user.jwt, user: user.user } });

    toast.success("Registration successful!");

    const userResponse = await axios.get(`${baseUrl}/api/users/profile`);
    dispatch({ type: types.GET_USER_SUCCESS, payload: userResponse.data });
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    dispatch({ type: types.REGISTER_FAILURE, payload: msg });
    toast.error(msg);
  }
};

// ✅ Login
// Inside /state/Auth/Action.js
export const login = ({ email, password }, navigate) => async (dispatch) => {
  dispatch({ type: types.LOGIN_REQUEST });
  try {
    const response = await axios.post(`${baseUrl}/auth/signin`, { email, password });
    const data = response.data;

    // ✅ Case 1: 2FA Required
    if (response.status === 202 && data.twoFactorAuthEnabled) {
      dispatch({
        type: types.LOGIN_2FA_REQUIRED,
        payload: {
          user: { email },
          session: data.session,
        },
      });
      return;
    }

    // ✅ Case 2: Normal Login
    localStorage.setItem("jwt", data.jwt);
    axios.defaults.headers.common["Authorization"] = `Bearer ${data.jwt}`;

    dispatch({ type: types.LOGIN_SUCCESS, payload: { jwt: data.jwt, user: data.user } });

    const userResponse = await axios.get(`${baseUrl}/api/users/profile`);
    dispatch({ type: types.GET_USER_SUCCESS, payload: userResponse.data });

    toast.success("Login successful!");
    navigate("/");
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    dispatch({ type: types.LOGIN_FAILURE, payload: msg });
    toast.error(msg);
  }
};


// ✅ Get user profile
export const getUser = () => async (dispatch) => {
  const jwt = localStorage.getItem("jwt");
  if (!jwt) return;

  if (isTokenExpired(jwt)) {
    localStorage.removeItem("jwt");
    delete axios.defaults.headers.common["Authorization"];
    dispatch({
      type: types.GET_USER_FAILURE,
      payload: "Session expired. Please login again.",
    });
    toast.error("Session expired. Please login again.");
    return;
  }

  dispatch({ type: types.GET_USER_REQUEST });
  try {
    axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
    const response = await axios.get(`${baseUrl}/api/users/profile`);
    dispatch({ type: types.GET_USER_SUCCESS, payload: response.data });
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message;
    if (errorMsg === "Token expired" || error.response?.status === 401) {
      localStorage.removeItem("jwt");
      delete axios.defaults.headers.common["Authorization"];
      dispatch({
        type: types.GET_USER_FAILURE,
        payload: "Session expired. Please login again.",
      });
      toast.error("Session expired. Please login again.");
    } else {
      dispatch({
        type: types.GET_USER_FAILURE,
        payload: errorMsg,
      });
      toast.error(errorMsg);
    }
  }
};

// ✅ Update profile
export const updateProfile = (formData) => async (dispatch) => {
  dispatch({ type: types.UPDATE_PROFILE_REQUEST });
  try {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) throw new Error("No token found");

    axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
    const response = await axios.patch(`${baseUrl}/api/users/profile`, formData);
    
    dispatch({ type: types.UPDATE_PROFILE_SUCCESS, payload: response.data });
    dispatch({ type: types.GET_USER_SUCCESS, payload: response.data });

    toast.success("Profile updated successfully!");
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    dispatch({ type: types.UPDATE_PROFILE_FAILURE, payload: msg });
    toast.error(msg);
  }
};

// ✅ Logout
export const logout = () => (dispatch) => {
  localStorage.removeItem("jwt");
  persistor.purge();
  dispatch({ type: types.LOGOUT });
  toast.success("Logged out successfully.");
};

// ✅ Send reset password link
export const sendResetPasswordLink = (email) => async (dispatch) => {
  dispatch({ type: types.SEND_RESET_PASSWORD_REQUEST });
  try {
    const res = await axios.post(`${baseUrl}/auth/forgot-password`, { email });
    dispatch({ type: types.SEND_RESET_PASSWORD_SUCCESS, payload: res.data.message });
    toast.success("Reset password link sent to your email.");
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    dispatch({ type: types.SEND_RESET_PASSWORD_FAILURE, payload: msg });
    toast.error(msg);
  }
};

// ✅ Reset password using token
export const resetPassword = ({ token, newPassword }) => async (dispatch) => {
  dispatch({ type: types.VERIFY_RESET_PASSWORD_REQUEST });
  try {
    const res = await axios.post(`${baseUrl}/auth/reset-password`, { token, newPassword });
    dispatch({ type: types.VERIFY_RESET_PASSWORD_SUCCESS, payload: res.data.message });
    toast.success("Password reset successfully!");
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    dispatch({ type: types.VERIFY_RESET_PASSWORD_FAILURE, payload: msg });
    toast.error(msg);
  }
};

// ✅ Toggle 2FA
export const toggleTwoFactor = () => async (dispatch, getState) => {
  dispatch({ type: types.TOGGLE_2FA_REQUEST });
  try {
    const token = getState().auth.jwt || localStorage.getItem("jwt");
    const isCurrentlyEnabled = getState().auth.user?.twoFactorEnabled;

    const response = await axios.put(
      `${baseUrl}/user/two-factor`,
      { enable: !isCurrentlyEnabled }, // ✅ No userId sent anymore
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    dispatch({ type: types.TOGGLE_2FA_SUCCESS, payload: response.data });

    dispatch(getUser());

    toast.success(!isCurrentlyEnabled ? "2FA Enabled" : "2FA Disabled");
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    dispatch({ type: types.TOGGLE_2FA_FAILURE, payload: msg });
    toast.error(msg || "2FA toggle failed");
  }
};
