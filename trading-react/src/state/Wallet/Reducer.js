// src/state/Wallet/Reducer.js
import * as types from './ActionType';

const initialState = {
  wallet: {},
  transactions: [],
  loading: false,
  error: null,
};

const walletReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_WALLET_REQUEST:
    case types.DEPOSIT_MONEY_REQUEST:
    case types.WITHDRAWAL_REQUEST:
    case types.TRANSFER_MONEY_REQUEST:
    case types.GET_WALLET_TRANSACTION_REQUEST:
      return { ...state, loading: true, error: null };

    case types.GET_WALLET_SUCCESS:
      return { ...state, wallet: action.payload, loading: false };

    case types.GET_WALLET_TRANSACTION_SUCCESS:
      return { ...state, transactions: action.payload, loading: false };

    case types.DEPOSIT_MONEY_SUCCESS:
    case types.WITHDRAWAL_SUCCESS:
    case types.TRANSFER_MONEY_SUCCESS:
      return { ...state, wallet: action.payload, loading: false };

    case types.GET_WALLET_FAILURE:
    case types.DEPOSIT_MONEY_FAILURE:
    case types.WITHDRAWAL_FAILURE:
    case types.TRANSFER_MONEY_FAILURE:
    case types.GET_WALLET_TRANSACTION_FAILURE:
      return { ...state, loading: false, error: action.error };

    default:
      return state;
  }
};

export default walletReducer;
