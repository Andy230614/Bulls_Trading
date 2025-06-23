import api from "../../config/api";
import * as types from './ActionType';

// PAY ORDER
export const payOrder = ({ jwt, orderData }) => async (dispatch, getState) => {
  dispatch({ type: types.PAY_ORDER_REQUEST });

  try {
    const token = jwt || getState()?.auth?.jwt || localStorage.getItem("jwt");
    if (!token) throw new Error("User not authenticated");

    const response = await api.post('/api/orders/pay', orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch({
      type: types.PAY_ORDER_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: types.PAY_ORDER_FAILURE,
      error: error?.response?.data?.message || error.message,
    });
  }
};

// GET ORDER BY ID
export const getOrderById = (orderId) => async (dispatch, getState) => {
  dispatch({ type: types.GET_ORDER_REQUEST });

  try {
    const jwt = getState()?.auth?.jwt || localStorage.getItem("jwt");
    if (!jwt) throw new Error("User not authenticated");

    const response = await api.get(`/api/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    dispatch({
      type: types.GET_ORDER_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: types.GET_ORDER_FAILURE,
      error: error?.response?.data?.message || error.message,
    });
  }
};

// GET ALL ORDERS
export const getAllOrdersForUser = ({ orderType, assetSymbol } = {}) => async (dispatch, getState) => {
  dispatch({ type: types.GET_ALL_ORDERS_REQUEST });

  try {
    const jwt = getState()?.auth?.jwt || localStorage.getItem("jwt");
    if (!jwt) throw new Error("User not authenticated");

    const response = await api.get('/api/orders', {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      params: {
        ...(orderType && { order_type: orderType }),
        ...(assetSymbol && { asset_symbol: assetSymbol }),
      },
    });

    dispatch({
      type: types.GET_ALL_ORDERS_SUCCESS,
      payload: response.data,
    });
    console.log("data orders", response.data);
  } catch (error) {
    dispatch({
      type: types.GET_ALL_ORDERS_FAILURE,
      error: error?.response?.data?.message || error.message,
    });
  }
};
