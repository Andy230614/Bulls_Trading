// src/state/Store.js
import { legacy_createStore, combineReducers, applyMiddleware } from "redux";
import {thunk} from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "./Auth/Reducer";
import coinReducer from "./Coin/Reducer";
import walletReducer from "./Wallet/Reducer";
import orderReducer from "./Order/Reducer";
import assetReducer from "./Asset/Reducer";
import watchListReducer from "./WatchList/Reducer";
import withdrawalReducer from "./Withdrawal/Reducer";
import paymentDetailsReducer from "./PaymentDetails/Reducer";
import otpReducer from "./TwoFactorAuth/Reducer";

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  coin: coinReducer,
  wallet: walletReducer,
  order: orderReducer,
  asset: assetReducer,
  watchList: watchListReducer,
  withdrawal: withdrawalReducer,
  paymentDetails: paymentDetailsReducer,
  otp: otpReducer,
});

// Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // Persist only auth (can add more like "wallet" if needed)
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store with persisted reducer
export const store = legacy_createStore(persistedReducer, applyMiddleware(thunk));

// Create persistor
export const persistor = persistStore(store);
