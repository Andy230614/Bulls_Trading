import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWallet } from "../../state/Wallet/Action";
import { payOrder } from "../../state/Order/Action";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import Big from "big.js";

const TradingForm = () => {
  const dispatch = useDispatch();

  const { wallet } = useSelector((state) => state.wallet);
  const selectedCoin = useSelector((state) => state.coin.coinDetails);
  const jwt = useSelector((state) => state.auth.token) || localStorage.getItem("jwt");

  const [orderType, setOrderType] = useState("BUY");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(getWallet());
  }, [dispatch]);

  const handleChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const numericAmount = parseFloat(amount);
  const coinPrice = selectedCoin?.market_data?.current_price?.usd || 0;
  const totalPrice = numericAmount * coinPrice;
  const marketQuantity = 1 / coinPrice;
  const availableBalance = wallet?.balance || 0;

  const userCoinHolding = wallet?.holdings?.find(
    (h) => h.coinId === selectedCoin?.id
  );
  const availableQuantity = userCoinHolding?.quantity || 0;

  const bigNumericAmount = Big(amount || 0);
  const bigAvailableBalance = Big(availableBalance || 0);
  const bigAvailableQuantity = Big(availableQuantity || 0);
  const bigTotalPrice = Big(totalPrice || 0);

  const amountError =
    !amount
      ? "Amount is required"
      : bigNumericAmount.lte(0)
      ? "Amount must be greater than zero"
      : "";

  const hasInsufficientBalance =
    orderType === "BUY" &&
    amount &&
    bigTotalPrice.gt(bigAvailableBalance);

  const hasInsufficientQuantity =
    orderType === "SELL" &&
    amount &&
    bigNumericAmount.gt(bigAvailableQuantity);

  const handleTrade = async () => {
    if (
      amountError ||
      hasInsufficientBalance ||
      hasInsufficientQuantity ||
      !selectedCoin
    ) {
      toast.error("Trade cannot proceed. Please check your inputs.");
      return;
    }

    const orderData = {
      coinId: selectedCoin.id,
      orderType,
      quantity: parseFloat(bigNumericAmount.toFixed(8)),
      amount: parseFloat(bigTotalPrice.toFixed(8)),
    };

    try {
      setLoading(true);
      await dispatch(payOrder({ jwt, orderData }));
      await dispatch(getWallet());
      toast.success(`${orderType} order placed successfully`);
      setAmount("");
    } catch (error) {
      console.error("Trade failed:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!selectedCoin) return null;

  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg rounded-xl p-8 space-y-8 text-base dark:bg-gray-900 dark:text-white">
      {/* Order Type Buttons */}
      <div className="flex justify-center gap-6">
        <Button
          onClick={() => setOrderType("BUY")}
          className={`px-10 py-3 text-lg font-semibold rounded-lg ${
            orderType === "BUY"
              ? "bg-green-600 text-white hover:bg-green-700"
              : "border border-green-600 text-green-600 hover:bg-green-100"
          }`}
        >
          Buy
        </Button>
        <Button
          onClick={() => setOrderType("SELL")}
          className={`px-10 py-3 text-lg font-semibold rounded-lg ${
            orderType === "SELL"
              ? "bg-red-600 text-white hover:bg-red-700"
              : "border border-red-600 text-red-600 hover:bg-red-100"
          }`}
        >
          Sell
        </Button>
      </div>

      {/* Wallet Info */}
      <div className="flex justify-between text-sm font-medium">
        <span>💰 Balance: ${availableBalance.toFixed(2)}</span>
        <span>📦 Holdings: {availableQuantity} {selectedCoin.symbol.toUpperCase()}</span>
      </div>

      {/* Coin Price and Market Quantity */}
      <div className="space-y-1">
        <div className="text-gray-700 dark:text-gray-300 font-medium text-lg">
          Current Price: ${coinPrice.toFixed(4)}
        </div>
        <div className="text-sm text-muted-foreground">
          ≈ {marketQuantity.toFixed(6)} {selectedCoin.symbol.toUpperCase()} per USD
        </div>
      </div>

      {/* Amount Input */}
      <div className="space-y-2">
        <Input
          type="number"
          name="amount"
          placeholder="Enter quantity..."
          className="w-full text-lg py-3 px-4"
          value={amount}
          onChange={handleChange}
        />
        {amountError && (
          <p className="text-red-500 text-sm">{amountError}</p>
        )}
        {hasInsufficientBalance && (
          <p className="text-red-500 text-sm">Insufficient balance to buy.</p>
        )}
        {hasInsufficientQuantity && (
          <p className="text-red-500 text-sm">Not enough coins to sell.</p>
        )}
      </div>

      {/* Total Display */}
      <div className="text-lg font-semibold">
        Total: ${totalPrice.toFixed(4)}
      </div>

      {/* Submit */}
      <div className="flex justify-center">
        <Button
          onClick={handleTrade}
          disabled={loading}
          className={`px-10 py-3 text-lg font-semibold rounded-lg w-full ${
            orderType === "BUY"
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-red-600 text-white hover:bg-red-700"
          }`}
        >
          {loading ? "Processing..." : `Place ${orderType} Order`}
        </Button>
      </div>
    </div>
  );
};

export default TradingForm;
