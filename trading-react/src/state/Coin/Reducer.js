import {
  FETCH_COIN_LIST_REQUEST,
  FETCH_COIN_LIST_SUCCESS,
  FETCH_COIN_LIST_FAILURE,
  FETCH_TOP_50_COINS_REQUEST,
  FETCH_TOP_50_COINS_SUCCESS,
  FETCH_TOP_50_COINS_FAILURE,
  FETCH_MARKET_CHART_REQUEST,
  FETCH_MARKET_CHART_SUCCESS,
  FETCH_MARKET_CHART_FAILURE,
  FETCH_COIN_BY_ID_REQUEST,
  FETCH_COIN_BY_ID_SUCCESS,
  FETCH_COIN_BY_ID_FAILURE,
  FETCH_COIN_DETAILS_REQUEST,
  FETCH_COIN_DETAILS_SUCCESS,
  FETCH_COIN_DETAILS_FAILURE,
  SEARCH_COIN_REQUEST,
  SEARCH_COIN_SUCCESS,
  SEARCH_COIN_FAILURE,
  SET_SELECTED_COIN,
  CLEAR_SELECTED_COIN,
  FETCH_TOP_GAINERS_SUCCESS,
  FETCH_TOP_GAINERS_FAILURE,
  FETCH_TOP_GAINERS_REQUEST,
  FETCH_TOP_LOSERS_REQUEST,
  FETCH_TOP_LOSERS_SUCCESS,
  FETCH_TOP_LOSERS_FAILURE
} from "./ActionType";

const initialState = {
  coinList: [],
  top50: [],
  searchCoinList: [],
  topGainers: [],
  topLosers: [],
  marketChart: {
    data: [],
    loading: false,
  },
  coinById: null,
  coinDetails: null,
  selectedCoin: null,
  loading: false,
  error: null,
};

const coinReducer = (state = initialState, action) => {
  switch (action.type) {
    // General Data Fetch Requests
    case FETCH_COIN_LIST_REQUEST:
    case FETCH_TOP_50_COINS_REQUEST:
    case FETCH_COIN_BY_ID_REQUEST:
    case FETCH_COIN_DETAILS_REQUEST:
    case SEARCH_COIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    // Chart Data Fetch Request
    case FETCH_MARKET_CHART_REQUEST:
      return {
        ...state,
        marketChart: {
          data: [],
          loading: true,
        },
        error: null,
      };

    // Success Handlers
    case FETCH_COIN_LIST_SUCCESS:
      return {
        ...state,
        coinList: action.payload,
        loading: false,
      };

    case FETCH_TOP_50_COINS_SUCCESS:
      return {
        ...state,
        top50: action.payload,
        loading: false,
      };

    case FETCH_TOP_GAINERS_REQUEST:
case FETCH_TOP_LOSERS_REQUEST:
  return {
    ...state,
    loading: true,
    error: null,
  };

case FETCH_TOP_GAINERS_SUCCESS:
  return {
    ...state,
    topGainers: action.payload,
    loading: false,
  };

case FETCH_TOP_LOSERS_SUCCESS:
  return {
    ...state,
    topLosers: action.payload,
    loading: false,
  };

case FETCH_TOP_GAINERS_FAILURE:
case FETCH_TOP_LOSERS_FAILURE:
  return {
    ...state,
    loading: false,
    error: action.payload,
  };


    case FETCH_COIN_BY_ID_SUCCESS:
      return {
        ...state,
        coinById: action.payload,
        loading: false,
      };

          case SET_SELECTED_COIN:
      return {
        ...state,
        selectedCoin: action.payload,
      };

    case CLEAR_SELECTED_COIN:
      return {
        ...state,
        selectedCoin: null,
      };


    case FETCH_COIN_DETAILS_SUCCESS:
      return {
        ...state,
        coinDetails: action.payload,
        loading: false,
      };

    case SEARCH_COIN_SUCCESS:
      return {
        ...state,
        searchCoinList: action.payload?.coins || [],
        loading: false,
      };

    case FETCH_MARKET_CHART_SUCCESS:
      return {
        ...state,
        marketChart: {
          data: action.payload,
          loading: false,
        },
      };

    // Failure Handlers
    case FETCH_COIN_LIST_FAILURE:
    case FETCH_TOP_50_COINS_FAILURE:
    case FETCH_COIN_BY_ID_FAILURE:
    case FETCH_COIN_DETAILS_FAILURE:
    case SEARCH_COIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case FETCH_MARKET_CHART_FAILURE:
      return {
        ...state,
        marketChart: {
          data: [],
          loading: false,
        },
        error: action.payload,
      };

    default:
      return state;
  }
};

export default coinReducer;
