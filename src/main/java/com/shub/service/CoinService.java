package com.shub.service;

import com.shub.model.Coin;
import com.shub.response.CoinResponse;

import java.util.List;

public interface CoinService {
    List<CoinResponse> getCoinList(int page) throws Exception;
    List<CoinResponse> getTopFiftyCoinByMarketCapRank() throws Exception;
    String getMarketChart(String coinId, int days) throws Exception;
    String getCoinDetails(String coinId) throws Exception;
    String searchCoin(String keyword) throws Exception;
    List<CoinResponse> getTrendingCoins() throws Exception;
    List<CoinResponse> getTopGainers() throws Exception;
    List<CoinResponse> getTopLosers() throws Exception;
    Coin findById(String coinId) throws Exception;
    CoinResponse getCoinFromDatabase(String coinId) throws Exception;

}
