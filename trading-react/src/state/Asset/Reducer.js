import {
  FETCH_ASSETS_REQUEST,
  FETCH_ASSETS_SUCCESS,
  FETCH_ASSETS_FAILURE,
  GET_HOLDING_SUCCESS,
  GET_HOLDING_FAILURE,
  GET_HOLDING_REQUEST
} from './ActionType';

const initialState = {
  loading: false,
  assets: [],
  holdings: [],
  error: ''
};

const assetReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ASSETS_REQUEST:
      return {
        ...state,
        loading: true
      };
    case FETCH_ASSETS_SUCCESS:
      return {
        loading: false,
        assets: action.payload,
        error: ''
      };
    case FETCH_ASSETS_FAILURE:
      return {
        loading: false,
        assets: [],
        error: action.payload
      };
      case GET_HOLDING_REQUEST:
      return { ...state, loading: true };
    case GET_HOLDING_SUCCESS:
      return { holdings: Array.isArray(action.payload) ? action.payload : [],
    loading: false };
    case GET_HOLDING_FAILURE:
      return { ...state, error: action.error, loading: false };
    default:
      return state;
  }
};

export default assetReducer;
