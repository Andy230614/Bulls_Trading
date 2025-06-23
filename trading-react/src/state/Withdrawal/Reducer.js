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

const initialState = {
  loading: false,
  withdrawals: [],
  allWithdrawals: [],
  error: null,
};

const withdrawalReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_WITHDRAWAL_REQUEST:
    case GET_WITHDRAWALS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case CREATE_WITHDRAWAL_SUCCESS:
      return {
        ...state,
        loading: false,
        // ✅ use real backend status (e.g., "PENDING"), don't override
        withdrawals: [...state.withdrawals, action.payload],
      };

    case GET_WITHDRAWALS_SUCCESS:
      return {
        ...state,
        loading: false,
        // ✅ ensure response is a valid array, reversed for newest first
        withdrawals: Array.isArray(action.payload)
          ? [...action.payload].reverse()
          : [...(action.payload.withdrawals || [])].reverse(),
      };

    case GET_ALL_WITHDRAWALS_SUCCESS:
      return {
        ...state,
        loading: false,
        allWithdrawals: Array.isArray(action.payload)
          ? action.payload
          : action.payload.allWithdrawals || [],
      };

    case PROCEED_WITHDRAWAL_SUCCESS:
      return {
        ...state,
        loading: false,
        allWithdrawals: state.allWithdrawals.map((wd) =>
          wd.id === action.payload.id ? action.payload : wd
        ),
        // ✅ Optionally also update the user withdrawals list
        withdrawals: state.withdrawals.map((wd) =>
          wd.id === action.payload.id ? action.payload : wd
        ),
      };

    case CREATE_WITHDRAWAL_FAILURE:
    case GET_WITHDRAWALS_FAILURE:
    case GET_ALL_WITHDRAWALS_FAILURE:
    case PROCEED_WITHDRAWAL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default withdrawalReducer;
