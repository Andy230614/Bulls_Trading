import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import AssetTable from "./AssetTable";
import Stockchart from "./Stockchart";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { DotIcon, MessageCircle } from "lucide-react";
import { Cross1Icon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import {
  getCoinList,
  getTop50Coins,
  fetchCoinDetails,
  fetchTopGainers,
  fetchTopLosers,
} from "../../state/Coin/Action";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Home = () => {
  const [category, setCategory] = useState("all");
  const [inputValue, setInputValue] = useState("");
  const [isBotRelease, setIsBotRelease] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // ✅ for pagination

  const dispatch = useDispatch();
  const coin = useSelector((store) => store.coin);
  const coinDetails = useSelector((state) => state.coin.coinDetails);

  useEffect(() => {
    if (category === "top50") dispatch(getTop50Coins());
    else if (category === "topGainers") dispatch(fetchTopGainers());
    else if (category === "topLosers") dispatch(fetchTopLosers());
    else dispatch(getCoinList(currentPage)); // ✅ paginated fetch
  }, [category, currentPage, dispatch]);

  useEffect(() => {
    dispatch(fetchCoinDetails("bitcoin", localStorage.getItem("jwt")));
  }, [dispatch]);

  const handleCategory = (value) => {
    setCategory(value);
    setCurrentPage(1); // ✅ reset to page 1 when switching category
  };

  const handleChange = (e) => setInputValue(e.target.value);
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      console.log(inputValue);
      setInputValue("");
    }
  };
  const handleBotRelease = () => setIsBotRelease(!isBotRelease);

  const { image, name, symbol, market_data: marketData } = coinDetails || {};

  const getCoinData = () => {
    switch (category) {
      case "top50":
        return coin.top50;
      case "topGainers":
        return coin.topGainers;
      case "topLosers":
        return coin.topLosers;
      default:
        return coin.coinList;
    }
  };

  return (
    <div className="relative overflow-hidden">
      <div className="lg:grid lg:grid-cols-2 gap-5 lg:h-[calc(100vh-5rem)] overflow-auto">
        {/* Left Panel */}
        <div>
          <div className="p-3 flex items-center gap-4 flex-wrap">
            {["all", "top50", "topGainers", "topLosers"].map((cat) => (
              <Button
                key={cat}
                onClick={() => handleCategory(cat)}
                variant={category === cat ? "default" : "outline"}
                className="rounded-full capitalize"
              >
                {cat.replace("top", "Top ")}
              </Button>
            ))}
          </div>

          <AssetTable coin={getCoinData()} category={category} />

          {/* Pagination */}
          {category === "all" && (
            <div className="my-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage((prev) => Math.max(prev - 1, 1));
                      }}
                    />
                  </PaginationItem>

                  {[currentPage - 1, currentPage, currentPage + 1].map((page) => {
                    if (page < 1) return null;
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          isActive={page === currentPage}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage((prev) => prev + 1);
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="overflow-auto">
          <div className="mb-5 max-h-[400px] overflow-hidden rounded-md shadow border">
            <Stockchart coinId={"bitcoin"} />
          </div>

          <div className="flex gap-5 items-center mt-4">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={image?.large}
                alt={name || "Bitcoin"}
                onError={(e) => (e.target.style.display = "none")}
              />
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">{symbol?.toUpperCase() || "BTC"}</p>
                <DotIcon className="text-gray-400" />
                <p className="text-gray-400">{name || "Bitcoin"}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xl font-bold">
                  ${marketData?.current_price?.usd?.toLocaleString() || "0"}
                </p>
                <p
                  className={`text-sm ${
                    marketData?.price_change_percentage_24h >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  <span>
                    {marketData?.market_cap?.usd?.toLocaleString() || "-"}
                  </span>
                  <span>
                    {" "}
                    ({marketData?.price_change_percentage_24h?.toFixed(2) || "0.00"}%)
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Bot */}
      <section className="absolute bottom-5 right-5 z-40 flex flex-col justify-end items-end gap-2">
        {isBotRelease && (
          <div className="rounded-md w-[20rem] md:w-[25rem] h-[70vh] bg-slate-100 flex flex-col justify-between shadow-lg">
            <div className="flex justify-between items-center border-b px-6 h-[12%]">
              <p className="text-lg font-semibold">Chat Bot</p>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={handleBotRelease}
              >
                <Cross1Icon />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">Chat content here...</div>
            <div className="p-4 border-t">
              <Input
                placeholder="Ask something..."
                value={inputValue}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
              />
            </div>
          </div>
        )}
        <Button
          onClick={handleBotRelease}
          className="rounded-full flex items-center gap-2 shadow"
        >
          <MessageCircle className="h-4 w-4" />
          Chat
        </Button>
      </section>
    </div>
  );
};

export default Home;
