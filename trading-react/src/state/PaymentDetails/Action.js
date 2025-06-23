import {
  ADD_PAYMENT_DETAILS_REQUEST,
  ADD_PAYMENT_DETAILS_SUCCESS,
  ADD_PAYMENT_DETAILS_FAILURE,
  GET_PAYMENT_DETAILS_REQUEST,
  GET_PAYMENT_DETAILS_SUCCESS,
  GET_PAYMENT_DETAILS_FAILURE
} from './ActionType';

import api from '../../config/api'; // Adjust path to where your `api.js` is

const API_URL = '/api/payment-details';

export const addPaymentDetails = (details) => async (dispatch) => {
  dispatch({ type: ADD_PAYMENT_DETAILS_REQUEST });
  try {
    const response = await api.post(API_URL, details); // use `api` instead of `axios`
    dispatch({
      type: ADD_PAYMENT_DETAILS_SUCCESS,
      payload: response.data
    });
  } catch (error) {
    dispatch({
      type: ADD_PAYMENT_DETAILS_FAILURE,
      payload: error.response?.data?.message || error.message
    });
  }
};

export const getPaymentDetails = () => async (dispatch) => {
  dispatch({ type: GET_PAYMENT_DETAILS_REQUEST });
  try {
    const response = await api.get(`/api/user/payment-details`); // use `api` instead of `axios`
    dispatch({
      type: GET_PAYMENT_DETAILS_SUCCESS,
      payload: response.data
    });
  } catch (error) {
    dispatch({
      type: GET_PAYMENT_DETAILS_FAILURE,
      payload: error.response?.data?.message || error.message
    });
  }
};
