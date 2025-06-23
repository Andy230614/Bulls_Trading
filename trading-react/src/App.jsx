import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUser } from "./state/Auth/Action";
//import axios from "axios";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./page/home/navbar/Navbar";
import Home from "./page/home/Home";
import Portfolio from "./page/portfolio/portfolio";
import Activity from "./page/activity/activity";
import Wallet from "./page/Wallet/wallet";
import Withdrawal from "./page/withdrawal/withdrawal";
import PaymentDetails from "./page/paymentdetails/paymentdetails";
import StockDetails from "./page/stockdetails/stockdetails";
import Watchlist from "./page/watchlist/watchlist";
import Profile from "./page/home/profile/profile";
import SearchCoin from "./page/search/searchcoin";
import WithdrawalAdmin from "./page/admin/withdrawaladmin";
import NotFound from "./page/notfound/notfound";
import ResetPasswordForm from "./page/auth/ResetPasswordForm";
import Auth from "./page/auth/Auth";
import Coin from "./page/Coin";

/*const jwt = localStorage.getItem("jwt");
if (jwt) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
}*/

function App() {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  if (auth.loading)
    return <div className="text-white text-center mt-10">Loading...</div>;

  return (
    <>
      <Routes>
        {/* Default: Show Auth page at / if not logged in */}
        <Route
          path="/"
          element={
            auth.user ? (
              <>
                <Navbar />
                <Home />
              </>
            ) : (
              <Navigate to="/signin" replace />
            )
          }
        />

        {/* Auth Routes */}
        <Route path="/signin" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />
        <Route path="/forgot-password" element={<Auth />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />

        {/* Protected Routes */}
        {auth.user && (
          <>
            <Route path="/portfolio" element={<><Navbar /><Portfolio /></>} />
            <Route path="/activity" element={<><Navbar /><Activity /></>} />
            <Route path="/wallet" element={<><Navbar /><Wallet /></>} />
            <Route path="/withdrawal" element={<><Navbar /><Withdrawal /></>} />
            <Route path="/payment-details" element={<><Navbar /><PaymentDetails /></>} />
            <Route path="/market/:id" element={<><Navbar /><StockDetails /></>} />
            <Route path="/watchlist" element={<><Navbar /><Watchlist /></>} />
            <Route path="/profile" element={<><Navbar /><Profile /></>} />
            <Route path="/search" element={<><Navbar /><SearchCoin /></>} />
            <Route path="/admin" element={<><Navbar /><WithdrawalAdmin /></>} />
            <Route path="/coins/:id" element={<><Navbar /><Coin /></>} />
          </>
        )}

        {/* Fallback */}
        <Route path="*" element={<Navigate to={auth.user ? "/" : "/signin"} replace />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </>
  );
}

export default App;
