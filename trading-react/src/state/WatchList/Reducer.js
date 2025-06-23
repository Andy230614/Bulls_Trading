import {
  FETCH_WATCHLIST_REQUEST,
  FETCH_WATCHLIST_SUCCESS,
  FETCH_WATCHLIST_FAILURE,
  TOGGLE_WATCHLIST_ITEM_REQUEST,
  TOGGLE_WATCHLIST_ITEM_SUCCESS,
  TOGGLE_WATCHLIST_ITEM_FAILURE,
} from "./ActionType";

const initialState = {
  coins: [],
  loading: false,
  error: null,
};

const watchListReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_WATCHLIST_REQUEST:
    case TOGGLE_WATCHLIST_ITEM_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_WATCHLIST_SUCCESS:
      return {
        ...state,
        loading: false,
        coins: action.payload,
      };

    case TOGGLE_WATCHLIST_ITEM_SUCCESS: {
  const toggledCoin = action.payload;
  const exists = state.coins.some((coin) => coin.id === toggledCoin.id);
  return {
    ...state,
    loading: false,
    coins: exists
      ? state.coins.filter((coin) => coin.id !== toggledCoin.id)
      : [...state.coins, toggledCoin],
  };
}


    case FETCH_WATCHLIST_FAILURE:
    case TOGGLE_WATCHLIST_ITEM_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default watchListReducer;
