import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserAssets } from "../../state/Asset/Action";
import { getAllOrdersForUser } from "../../state/Order/Action";
import dayjs from "dayjs";

const Portfolio = () => {
  const dispatch = useDispatch();
  const [showHistory, setShowHistory] = useState(false);

  const { assets, loading: assetLoading } = useSelector((state) => state.asset);
  const { orders, loading: orderLoading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchUserAssets());
    dispatch(getAllOrdersForUser({}));
  }, [dispatch]);

  if (assetLoading || orderLoading) {
    return <p className="text-center p-4">Loading portfolio data...</p>;
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <h1 className="font-bold text-3xl">Portfolio</h1>

      {/* Holdings Table */}
      <Card>
        <CardContent className="p-0">
          {assets?.length === 0 ? (
            <p className="text-center text-gray-500 py-6">No assets in your portfolio.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Asset</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
  {(assets || []).map((asset, index) => {
    const price = asset.coin?.currentPrice ? parseFloat(asset.coin.currentPrice) : 0;
    const quantity = Number(asset.quantity) || 0;
    const value = (price * quantity).toFixed(2);

    return (
      <TableRow key={index} className="hover:bg-muted/30">
        <TableCell className="flex items-center gap-3">
          <Avatar className="h-6 w-6">
            <AvatarImage src={asset.coin?.image || "/placeholder.jpg"} />
          </Avatar>
          <span>
            {asset.coin?.name} ({asset.coin?.symbol?.toUpperCase()})
          </span>
        </TableCell>
        <TableCell>${price.toFixed(2)}</TableCell>
        <TableCell>
          {quantity} {asset.coin?.symbol?.toUpperCase()}
        </TableCell>
        <TableCell className="text-right">${value}</TableCell>
      </TableRow>
    );
  })}
</TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Toggle Trading History */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-2xl">Trading History</h2>
        <Button variant="outline" onClick={() => setShowHistory(!showHistory)}>
          {showHistory ? (
            <>
              <ChevronUp className="mr-1 h-4 w-4" /> Hide
            </>
          ) : (
            <>
              <ChevronDown className="mr-1 h-4 w-4" /> Show
            </>
          )}
        </Button>
      </div>

      {/* History Table */}
      {showHistory && (
        <Card>
          <CardContent className="p-0">
            {orders?.length === 0 ? (
              <p className="text-center text-gray-500 py-6">No trading history available.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Coin</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...orders].reverse().map((order, index) => {
                    const price = parseFloat(order.price || 0);
                    const quantity = parseFloat(order.orderItem?.quantity || order.quantity || 0);
                    const total = (price * quantity).toFixed(8);

                    return (
                      <TableRow key={index}>
                        <TableCell>
                          {order.createdAt
                            ? dayjs(order.createdAt).format("DD MMM YYYY, hh:mm A")
                            : `Order #${order.id}`}
                        </TableCell>
                        <TableCell
                          className={
                            order.orderType === "BUY" ? "text-green-600" : "text-red-600"
                          }
                        >
                          {order.orderType}
                        </TableCell>
                        <TableCell className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={order.image || "/placeholder.jpg"} />
                          </Avatar>
                          {order.coinSymbol?.toUpperCase() || "N/A"}
                        </TableCell>
                        <TableCell>{quantity.toFixed(6)}</TableCell>
                        <TableCell>${price.toLocaleString()}</TableCell>
                        <TableCell className="text-right">${total}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Portfolio;
