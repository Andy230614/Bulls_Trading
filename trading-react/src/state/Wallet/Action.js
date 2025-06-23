// src/state/Wallet/Action.js
import api from '../../config/api';
import * as types from './ActionType';

export const getWallet = () => async (dispatch) => {
  dispatch({ type: types.GET_WALLET_REQUEST });
  try {
    const res = await api.get('/api/wallet');
    dispatch({ type: types.GET_WALLET_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({ type: types.GET_WALLET_FAILURE, error: error.message });
  }
};

export const depositMoney = (amount, paymentMethod) => async (dispatch) => {
  dispatch({ type: types.DEPOSIT_MONEY_REQUEST });

  try {
    const res = await api.post(`/api/payment/${paymentMethod}/amount/${amount}`);
    const { orderId, gateway, clientSecret } = res.data;

    if (gateway === 'RAZORPAY') {
      const options = {
        key: 'rzp_test_1j0I4gzay8lTH8',
        amount: amount * 100,
        currency: 'INR',
        name: 'Bulls Trading',
        description: 'Wallet Top-up',
        order_id: orderId,
        handler: function (response) {
          dispatch(finalizeDeposit(orderId, response.razorpay_payment_id));
        },
        theme: { color: '#3399cc' },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

      razorpay.on('payment.failed', function (response) {
        dispatch({
          type: types.DEPOSIT_MONEY_FAILURE,
          error: response.error.description || 'Razorpay payment failed',
        });
      });
    } else if (gateway === 'STRIPE') {
      const stripe = await window.Stripe('YOUR_STRIPE_PUBLISHABLE_KEY');
      stripe.redirectToCheckout({ sessionId: clientSecret });
    } else {
      dispatch({
        type: types.DEPOSIT_MONEY_FAILURE,
        error: 'Unsupported payment gateway',
      });
    }
  } catch (error) {
    dispatch({ type: types.DEPOSIT_MONEY_FAILURE, error: error.message });
  }
};

export const finalizeDeposit = (orderId, paymentId) => async (dispatch) => {
  dispatch({ type: types.DEPOSIT_MONEY_REQUEST });
  try {
    const res = await api.put(`/api/wallet/deposit?order_id=${orderId}&payment_id=${paymentId}`);
    dispatch({ type: types.DEPOSIT_MONEY_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({ type: types.DEPOSIT_MONEY_FAILURE, error: error.message });
  }
};

export const withdrawalMoney = (amount) => async (dispatch) => {
  dispatch({ type: types.WITHDRAWAL_REQUEST });

  try {
    const res = await api.post('/api/wallet/withdrawal', { amount });
    dispatch({ type: types.WITHDRAWAL_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({
      type: types.WITHDRAWAL_FAILURE,
      error: error.response?.data?.message || error.message,
    });
  }
};

export const transferMoney = (walletId, amount, purpose) => async (dispatch) => {
  dispatch({ type: types.TRANSFER_MONEY_REQUEST });
  try {
    const res = await api.put(`/api/wallet/${walletId}/transfer`, { amount, purpose });
    dispatch({ type: types.TRANSFER_MONEY_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({ type: types.TRANSFER_MONEY_FAILURE, error: error.message });
  }
};

export const getWalletTransactionHistory = () => async (dispatch) => {
  dispatch({ type: types.GET_WALLET_TRANSACTION_REQUEST });
  try {
    const res = await api.get('/api/wallet/transactions');
    dispatch({ type: types.GET_WALLET_TRANSACTION_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({ type: types.GET_WALLET_TRANSACTION_FAILURE, error: error.message });
  }
};
