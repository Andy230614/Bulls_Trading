import { useNavigate } from "react-router-dom";
import {
  Table,
  TableCaption,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

const AssetTable = ({ coin, category }) => {
  const navigate = useNavigate();
  const scrollHeight = category === "all" ? "h-[77vh]" : "h-[82vh]";

  const getCaption = () => {
    switch (category) {
      case "topGainers":
        return "Top Gaining Coins (24h)";
      case "topLosers":
        return "Top Losing Coins (24h)";
      case "top50":
        return "Top 50 Market Cap Coins";
      default:
        return "Live asset data for your watchlist";
    }
  };

  return (
    <div className={`${scrollHeight} overflow-auto`}>
      <div className="w-full">
        <Table className="w-full text-sm">
          <TableCaption className="text-xs text-gray-500 pb-2">
            {getCaption()}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="px-2 text-left">Coin</TableHead>
              <TableHead className="px-2 text-left">Symbol</TableHead>
              <TableHead className="px-2 text-left">Volume</TableHead>
              <TableHead className="px-2 text-left">Market Cap</TableHead>
              <TableHead className="px-2 text-left">24h Change</TableHead>
              <TableHead className="px-2 text-left">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coin.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              coin.map((item) => (
                <TableRow
                  key={item.id || item.name}
                  className="cursor-pointer hover:bg-muted transition"
                  onClick={() => navigate(`/market/${item.id}`)}
                >
                  <TableCell className="px-2 text-left">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage
                          src={item.image}
                          alt={item.name}
                          onError={(e) => (e.target.style.display = "none")}
                        />
                      </Avatar>
                      <span className="truncate max-w-[100px]">{item.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-2 text-left uppercase">
                    {item.symbol}
                  </TableCell>
                  <TableCell className="px-2 text-left">
                    {item.totalVolume?.toLocaleString()}
                  </TableCell>
                  <TableCell className="px-2 text-left">
                    {item.marketCap?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    className={`px-2 text-left ${
                      item.priceChangePercentage24h >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {item.priceChangePercentage24h?.toFixed(2)}%
                  </TableCell>
                  <TableCell className="px-2 text-left">
                    ${item.currentPrice?.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AssetTable;
