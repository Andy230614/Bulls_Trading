import {
  ADD_PAYMENT_DETAILS_REQUEST,
  ADD_PAYMENT_DETAILS_SUCCESS,
  ADD_PAYMENT_DETAILS_FAILURE,
  GET_PAYMENT_DETAILS_REQUEST,
  GET_PAYMENT_DETAILS_SUCCESS,
  GET_PAYMENT_DETAILS_FAILURE
} from './ActionType';

const initialState = {
  loading: false,
  paymentDetails: null,
  error: null
};

const paymentDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_PAYMENT_DETAILS_REQUEST:
    case GET_PAYMENT_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case ADD_PAYMENT_DETAILS_SUCCESS:
    case GET_PAYMENT_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        paymentDetails: action.payload,  // ✅ Fix here
        error: null
      };
    case ADD_PAYMENT_DETAILS_FAILURE:
    case GET_PAYMENT_DETAILS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

export default paymentDetailsReducer;
