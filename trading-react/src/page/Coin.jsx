import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCoin, fetchCoinHistory } from "../redux/slices/coinSlices";
import { setSelectedCoin } from "../state/Coin/Action"; // ✅ import
import ChartComponent from "../components/ui/ChartComponent";

const Coin = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { coin, history, loading, error } = useSelector((state) => state.coin);

  const [days, setDays] = useState(1);

  useEffect(() => {
    dispatch(fetchCoin(id));
    dispatch(fetchCoinHistory({ coinId: id, days }));
  }, [dispatch, id, days]);

  // ✅ Set selectedCoin for TradingForm
  useEffect(() => {
    if (coin) {
      dispatch(setSelectedCoin(coin));
    }
  }, [coin, dispatch]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{coin?.name} Details</h1>
      <div className="mb-4">
        <label className="mr-2">Select Duration:</label>
        <select
          value={days}
          onChange={(e) => setDays(e.target.value)}
          className="border p-1 rounded"
        >
          <option value={1}>1 Day</option>
          <option value={7}>7 Days</option>
          <option value={30}>30 Days</option>
          <option value={90}>90 Days</option>
          <option value={180}>180 Days</option>
          <option value={365}>1 Year</option>
        </select>
      </div>

      {history && <ChartComponent data={history} days={days} />}
    </div>
  );
};

export default Coin;
