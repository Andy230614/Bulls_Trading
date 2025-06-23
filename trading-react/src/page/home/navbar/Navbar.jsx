import React, { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Menu, Search, Moon, Sun } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Sidebar from './Sidebar';
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { searchCoins } from '../../../state/Coin/Action';
import { Input } from "@/components/ui/input";

const Navbar = () => {
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const searchResults = useSelector(state => state.coin.searchCoinList);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim()) {
        dispatch(searchCoins(searchTerm));
        setShowDropdown(true);
      } else {
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, dispatch]);

  const handleSelectCoin = (coinId) => {
    setSearchTerm('');
    setShowDropdown(false);
    navigate(`/market/${coinId}`);
  };

  return (
    <div className='px-2 py-1 border-b z-50 bg-background bg-opacity-0 sticky top-0 left-0 right-0 flex justify-between items-center'>
      <div className='flex items-center gap-1'>
        {/* Sidebar Trigger */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full h-11 w-11">
              <Menu className='h-7 w-7' />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-72 p-0 border-r-0 flex flex-col justify-center" side='left'>
            <SheetHeader>
              <SheetTitle>
                <div className="text-3xl flex justify-center items-center gap-1">
                  <Avatar>
                    <AvatarImage src="./src/assets/istockphoto-1408777614-1024x1024.jpg" />
                  </Avatar>
                  <div>
                    <span className="font-bold text-orange-700">Bulls</span>
                    <span>Trading</span>
                  </div>
                </div>
              </SheetTitle>
            </SheetHeader>
            <Sidebar />
          </SheetContent>
        </Sheet>

        <Link to="/" className="text-sm lg:text-base cursor-pointer font-semibold ml-2">
          Bulls Trading
        </Link>

        {/* Search Input */}
        <div className="relative ml-5 w-60">
          <Input
            placeholder="Search coins..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => searchTerm && setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            className="pr-10"
          />
          <Search className="absolute right-2 top-2.5 h-5 w-5 text-gray-400" />

          {/* Search Results Dropdown */}
          {showDropdown && searchResults.length > 0 && (
            <div className="absolute z-50 mt-1 bg-white dark:bg-gray-800 border rounded shadow w-full max-h-64 overflow-auto">
              {searchResults.map((coin) => (
                <div
                  key={coin.id}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleSelectCoin(coin.id)}
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={coin.image} alt={coin.name} />
                    <AvatarFallback>{coin.symbol?.slice(0, 1).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">{coin.name}</div>
                    <div className="text-xs text-muted-foreground uppercase">{coin.symbol}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setIsDark(prev => !prev)}
          className="rounded-full"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        {/* User avatar (if logged in) */}
        {auth?.user && (
          <Avatar>
  <AvatarImage src={auth.user?.profileUrl} alt={auth.user?.username} />
  <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white font-bold">
    {auth.user?.fullName?.[0]?.toUpperCase() || "U"}
  </AvatarFallback>
</Avatar>

        )}
      </div>
    </div>
  );
};

export default Navbar;
