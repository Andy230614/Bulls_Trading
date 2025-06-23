import api from "../../config/api";
import {
  FETCH_COIN_LIST_REQUEST, FETCH_COIN_LIST_SUCCESS, FETCH_COIN_LIST_FAILURE,
  FETCH_TOP_50_COINS_REQUEST, FETCH_TOP_50_COINS_SUCCESS, FETCH_TOP_50_COINS_FAILURE,
  FETCH_MARKET_CHART_REQUEST, FETCH_MARKET_CHART_SUCCESS, FETCH_MARKET_CHART_FAILURE,
  FETCH_COIN_BY_ID_REQUEST, FETCH_COIN_BY_ID_SUCCESS, FETCH_COIN_BY_ID_FAILURE,
  FETCH_COIN_DETAILS_REQUEST, FETCH_COIN_DETAILS_SUCCESS, FETCH_COIN_DETAILS_FAILURE,
  SEARCH_COIN_REQUEST, SEARCH_COIN_SUCCESS, SEARCH_COIN_FAILURE, SET_SELECTED_COIN,
  CLEAR_SELECTED_COIN, FETCH_TOP_GAINERS_SUCCESS, FETCH_TOP_GAINERS_FAILURE,
  FETCH_TOP_GAINERS_REQUEST, FETCH_TOP_LOSERS_REQUEST, FETCH_TOP_LOSERS_SUCCESS, FETCH_TOP_LOSERS_FAILURE
} from "./ActionType";

// 1. Coin List
export const getCoinList = (page) => async (dispatch) => {
  dispatch({ type: FETCH_COIN_LIST_REQUEST });
  try {
    const { data } = await api.get(`/api/coins?page=${page}`);
    dispatch({ type: FETCH_COIN_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FETCH_COIN_LIST_FAILURE, payload: error.message });
  }
};

// 2. Top 50 Coins
export const getTop50Coins = () => async (dispatch) => {
  dispatch({ type: FETCH_TOP_50_COINS_REQUEST });
  try {
    const { data } = await api.get(`/api/coins/top50`);
    dispatch({ type: FETCH_TOP_50_COINS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FETCH_TOP_50_COINS_FAILURE, payload: error.message });
  }
};

// ✅ 3. Market Chart with ApexChart data formatting
export const fetchMarketChart = ({ coinId, days }) => async (dispatch) => {
  dispatch({ type: FETCH_MARKET_CHART_REQUEST });
  try {
    const { data } = await api.get(`/api/coins/${coinId}/chart?days=${days}`);

    // Format: ApexCharts expects { x: time, y: price }
    const formattedData = data.prices.map(([timestamp, price]) => ({
      x: new Date(timestamp).toISOString(),
      y: price,
    }));

    dispatch({ type: FETCH_MARKET_CHART_SUCCESS, payload: formattedData });
  } catch (error) {
    dispatch({ type: FETCH_MARKET_CHART_FAILURE, payload: error.message });
  }
};

// 4. Coin by ID
export const fetchCoinById = (coinId) => async (dispatch) => {
  dispatch({ type: FETCH_COIN_BY_ID_REQUEST });
  try {
    const { data } = await api.get(`/api/coins/local/${coinId}`);
    dispatch({ type: FETCH_COIN_BY_ID_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FETCH_COIN_BY_ID_FAILURE, payload: error.message });
  }
};

// 5. Coin Details from external API
export const fetchCoinDetails = (coinId) => async (dispatch) => {
  dispatch({ type: FETCH_COIN_DETAILS_REQUEST });
  try {
    const { data } = await api.get(`/api/coins/details/${coinId}`);
    dispatch({ type: FETCH_COIN_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FETCH_COIN_DETAILS_FAILURE, payload: error.message });
  }
};

// 6. Search Coins
export const searchCoins = (keyword) => async (dispatch) => {
  dispatch({ type: SEARCH_COIN_REQUEST });
  try {
    const { data } = await api.get(`/api/coins/search?q=${keyword}`);
    dispatch({ type: SEARCH_COIN_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: SEARCH_COIN_FAILURE, payload: error.message });
  }
};

// Top Gainers
export const fetchTopGainers = () => async (dispatch) => {
  dispatch({ type: FETCH_TOP_GAINERS_REQUEST });
  try {
    const { data } = await api.get(`/api/coins/top-gainers`);
    dispatch({ type: FETCH_TOP_GAINERS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: FETCH_TOP_GAINERS_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Top Losers
export const fetchTopLosers = () => async (dispatch) => {
  dispatch({ type: FETCH_TOP_LOSERS_REQUEST });
  try {
    const { data } = await api.get(`/api/coins/top-losers`);
    dispatch({ type: FETCH_TOP_LOSERS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: FETCH_TOP_LOSERS_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};


export const setSelectedCoin = (coin) => ({
  type: SET_SELECTED_COIN,
  payload: coin,
});

export const clearSelectedCoin = () => ({
  type: CLEAR_SELECTED_COIN,
});
