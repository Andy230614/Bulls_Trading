import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { BookmarkIcon, BookmarkFilledIcon, DotIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import TradingForm from "./TradingForm";
import Stockchart from "../home/Stockchart";
import { fetchCoinDetails } from "../../state/Coin/Action";
import { fetchWatchList, toggleWatchListItem } from "../../state/WatchList/Action";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StockDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const coin = useSelector((state) => state.coin.coinDetails);
  const { coins: watchlist = [], loading: watchLoading } = useSelector(
    (state) => state.watchList || {}
  );

  const [loadingToggle, setLoadingToggle] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchCoinDetails(id, localStorage.getItem("jwt")));
      dispatch(fetchWatchList());
    }
  }, [id, dispatch]);

  if (!coin || !coin.id) {
    return <div className="text-center mt-10 text-gray-500">Loading coin details...</div>;
  }

  const isBookmarked = watchlist.some((item) => item.id === coin.id);

  const handleToggleBookmark = async () => {
    if (!coin.id) return;
    setLoadingToggle(true);
    try {
      await dispatch(toggleWatchListItem(coin.id));
      toast.success(
        `${coin.name} has been ${isBookmarked ? "removed from" : "added to"} your watchlist.`,
        { autoClose: 3000 }
      );
    } catch (error) {
      console.error("Failed to toggle watchlist item:", error);
      toast.error("Failed to update watchlist.");
    } finally {
      setLoadingToggle(false);
    }
  };

  const {
    image,
    name,
    symbol,
    market_data: marketData
  } = coin;

  return (
    <div className="p-4 mt-5 max-w-full overflow-x-hidden">
      {/* Coin Info Section */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={image?.large}
              alt={name || "Coin"}
              onError={(e) => (e.target.style.display = "none")}
            />
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium">{symbol?.toUpperCase()}</p>
              <DotIcon className="text-gray-400" />
              <p className="text-gray-500">{name}</p>
            </div>
            <div className="flex flex-col gap-1 mt-1 text-sm text-gray-600">
              <span>Price: ${marketData?.current_price?.usd?.toLocaleString() || "-"}</span>
              <span>Market Cap: ${marketData?.market_cap?.usd?.toLocaleString() || "-"}</span>
              <span
                className={
                  marketData?.price_change_percentage_24h >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                24h Change: {marketData?.price_change_percentage_24h?.toFixed(2) || "0.00"}%
              </span>
            </div>
          </div>
        </div>

        {/* Bookmark & Trade Buttons */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            disabled={loadingToggle || watchLoading}
            onClick={handleToggleBookmark}
            aria-label={isBookmarked ? "Remove from watchlist" : "Add to watchlist"}
          >
            {isBookmarked ? (
              <BookmarkFilledIcon className="h-5 w-5 text-primary" />
            ) : (
              <BookmarkIcon className="h-5 w-5 text-muted-foreground" />
            )}
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg">Trade</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>How much do you want to spend?</DialogTitle>
              </DialogHeader>
              <TradingForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-5 max-h-[500px] overflow-hidden rounded-md">
        <Stockchart coinId={coin.id} />
      </div>
    </div>
  );
};

export default StockDetails;
