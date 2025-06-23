import React, { useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersForUser } from "../../state/Order/Action";
import { getHoldings } from "../../state/Asset/Action";

const Activity = () => {
  const dispatch = useDispatch();
  const { holdings = [] } = useSelector((state) => state.asset);
  const { orders = [], loading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getAllOrdersForUser());
    dispatch(getHoldings());
  }, [dispatch]);

  const pastOrders = orders
  .filter((order) =>
    ["SUCCESS", "CANCELLED", "FAILED", "ERROR"].includes(order.status)
  )
  .slice()
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const renderHoldingsTable = () => (
    <div className="pb-10">
      <h2 className="font-semibold text-xl mb-4">Active Orders (Holdings)</h2>
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Coin</TableHead>
            <TableHead className="text-left">Quantity</TableHead>
            <TableHead className="text-left">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {holdings
            .slice()
            .sort((a, b) => b.value - a.value)
            .map((holding, index) => (
              <TableRow key={index}>
                <TableCell className="text-left">
                  <div className="flex items-center gap-2">
                    <Avatar>
  <AvatarImage src={holding.image || "/default-coin.png"} />
</Avatar>
<span>{holding.symbol?.toUpperCase() || "—"}</span>
                  </div>
                </TableCell>
                <TableCell className="text-left">
                  {parseFloat(holding.quantity || 0).toFixed(4)}
                </TableCell>
                <TableCell className="text-left">
                  ${parseFloat(holding.value || 0).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );

  const renderOrdersTable = () => (
  <div className="pb-10">
    <h2 className="font-semibold text-xl mb-4">Past Orders</h2>
    <Table className="border">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[180px] text-left">Date & Time</TableHead>
          <TableHead className="text-left">Trading Pair</TableHead>
          <TableHead className="text-left">Buy Price</TableHead>
          <TableHead className="text-left">Sell Price</TableHead>
          <TableHead className="text-left">Order Type</TableHead>
          <TableHead className="text-left">Profit/Loss</TableHead>
          <TableHead className="text-left">Value</TableHead>
          <TableHead className="text-left">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pastOrders.map((order, index) => {
          //const item = order.orderItem || {};
          //const coin = item.coin || {};
          const buyPrice = parseFloat(order.buyPrice ?? 0);
          const sellPrice = parseFloat(order.sellPrice ?? 0);
          const quantity = parseFloat(order.quantity ?? 0);
          const orderType = order.orderType || "—";

          const value =
            orderType === "SELL"
              ? sellPrice * quantity
              : buyPrice * quantity;

          const profitLoss =
            orderType === "SELL" && buyPrice > 0
              ? ((sellPrice - buyPrice) / buyPrice) * 100
              : 0;

          return (
            <TableRow key={index}>
              <TableCell className="text-left">
                {new Date(order.createdAt).toLocaleDateString()} <br />
                {new Date(order.createdAt).toLocaleTimeString()}
              </TableCell>
              <TableCell className="text-left">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={order.image || "/default-coin.png"} />
                  </Avatar>
                  <span>{order.coinSymbol?.toUpperCase() || "—"}/USDT</span>
                </div>
              </TableCell>
              <TableCell className="text-left">
                {buyPrice ? `$${buyPrice.toFixed(2)}` : "—"}
              </TableCell>
              <TableCell className="text-left">
                {sellPrice ? `$${sellPrice.toFixed(2)}` : "—"}
              </TableCell>
              <TableCell className="text-left">{orderType}</TableCell>
              <TableCell className="text-left">
                {orderType === "SELL" && buyPrice > 0
                  ? `${profitLoss.toFixed(2)}%`
                  : "0.00%"}
              </TableCell>
              <TableCell className="text-left">
                ${value.toFixed(2)}
              </TableCell>
              <TableCell className="text-left">{order.status}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  </div>
);


  return (
    <div className="p-2 lg:p-5">
      <h1 className="font-bold text-3xl pb-5">Activity</h1>
      {loading ? <p>Loading orders...</p> : (
        <>
          {renderHoldingsTable()}
          {renderOrdersTable()}
        </>
      )}
    </div>
  );
};

export default Activity;
