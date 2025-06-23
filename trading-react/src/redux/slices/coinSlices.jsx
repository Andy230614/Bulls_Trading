import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

// Fetch a single coin by ID
export const fetchCoin = createAsyncThunk(
  "coin/fetchCoin",
  async (coinId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/coins/${coinId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch coin.");
    }
  }
);

// Fetch historical market data for a coin
export const fetchCoinHistory = createAsyncThunk(
  "coin/fetchCoinHistory",
  async ({ coinId, days }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/coins/${coinId}/market_chart`, {
        params: { vs_currency: "usd", days },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch history.");
    }
  }
);

// Initial Redux state
const initialState = {
  coin: null,
  selectedCoin: null, // ✅ Added selectedCoin
  history: null,
  loading: false,
  error: null,
};

// Slice definition
const coinSlice = createSlice({
  name: "coin",
  initialState,
  reducers: {
    // ✅ Optional: Set selectedCoin manually (for coin list scenarios)
    setSelectedCoin: (state, action) => {
      state.selectedCoin = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoin.fulfilled, (state, action) => {
        state.coin = action.payload;
        state.selectedCoin = action.payload; // ✅ Sync selectedCoin
        state.loading = false;
      })
      .addCase(fetchCoin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCoinHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoinHistory.fulfilled, (state, action) => {
        state.history = action.payload;
        state.loading = false;
      })
      .addCase(fetchCoinHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// ✅ Export the optional action
export const { setSelectedCoin } = coinSlice.actions;

export default coinSlice.reducer;
