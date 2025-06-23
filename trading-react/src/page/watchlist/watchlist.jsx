// src/components/Watchlist.jsx

import React, { useEffect } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { BookmarkFilledIcon } from '@radix-ui/react-icons';
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { fetchWatchList, toggleWatchListItem } from "../../state/WatchList/Action";

const Watchlist = () => {
  const dispatch = useDispatch();
  const { coins = [], loading, error } = useSelector((state) => state.watchList); // <- match reducer name

  useEffect(() => {
    dispatch(fetchWatchList());
  }, [dispatch]);

  const handleRemoveFromWatchlist = (coinId) => {
    dispatch(toggleWatchListItem(coinId));
  };

  return (
    <div className="p-2 lg:p-5">
      <h1 className="font-bold text-3xl pb-5">Watchlist</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Coin</TableHead>
            <TableHead className="text-left">Symbol</TableHead>
            <TableHead className="text-left">Volume</TableHead>
            <TableHead className="text-left">Market Cap</TableHead>
            <TableHead className="text-left">24H</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right text-red-600">Remove</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
  {coins.length === 0 && !loading && (
    <TableRow>
      <TableCell colSpan={7} className="text-center text-muted-foreground">
        No coins in your watchlist.
      </TableCell>
    </TableRow>
  )}

  {coins.map((coin) => (
    <TableRow key={coin.id}>
      <TableCell className="flex items-center gap-2">
        <Avatar className="h-6 w-6">
          <AvatarImage src={coin.image || "/default-coin.png"} />
        </Avatar>
        <span>{coin.name} ({coin.symbol?.toUpperCase()})</span>
      </TableCell>
      <TableCell className="text-left">{coin.symbol?.toUpperCase()}</TableCell>
      <TableCell className="text-left">
        {coin.totalVolume ? coin.totalVolume.toLocaleString() : "-"}
      </TableCell>
      <TableCell className="text-left">
        {coin.marketCap ? `$${coin.marketCap.toLocaleString()}` : "-"}
      </TableCell>
      <TableCell className="text-left">
        {coin.priceChangePercentage24h ? coin.priceChangePercentage24h.toFixed(2) : "0.00"}%
      </TableCell>
      <TableCell className="text-right">${coin.currentPrice?.toLocaleString() || "-"}</TableCell>
      <TableCell className="text-right">
        <Button
          variant="ghost"
          onClick={() => handleRemoveFromWatchlist(coin.id)}
          size="icon"
          className="h-8 w-8"
          disabled={loading}
        >
          <BookmarkFilledIcon className="w-6 h-6 text-red-500" />
        </Button>
      </TableCell>
    </TableRow>
  ))}
</TableBody>

      </Table>
    </div>
  );
};

export default Watchlist;
