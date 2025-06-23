// CoinController.java
package com.shub.controller;

import com.shub.response.CoinResponse;
import com.shub.service.CoinService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coins")
@CrossOrigin(origins = "*")
public class CoinController {

    @Autowired
    private CoinService coinService;

    @GetMapping
    public List<CoinResponse> getCoinList(@RequestParam(defaultValue = "1") int page) throws Exception {
        return coinService.getCoinList(page);
    }

    @GetMapping("/top50")
    public List<CoinResponse> getTopCoins() throws Exception {
        return coinService.getTopFiftyCoinByMarketCapRank();
    }

    @GetMapping("/{coinId}/chart")
    public String getMarketChart(@PathVariable String coinId, @RequestParam(defaultValue = "1") int days) throws Exception {
        return coinService.getMarketChart(coinId, days);
    }

    @GetMapping("/details/{coinId}")
    public String getCoinDetails(@PathVariable String coinId) throws Exception {
        return coinService.getCoinDetails(coinId);
    }

    @GetMapping("/search")
    public String searchCoin(@RequestParam("q") String keyword) throws Exception {
        return coinService.searchCoin(keyword);
    }

    @GetMapping("/top-gainers")
public List<CoinResponse> getTopGainers() throws Exception {
    return coinService.getTopGainers();
}

@GetMapping("/top-losers")
public List<CoinResponse> getTopLosers() throws Exception {
    return coinService.getTopLosers();
}


    @GetMapping("/local/{coinId}")
    public CoinResponse getCoinFromDB(@PathVariable String coinId) throws Exception {
        return coinService.getCoinFromDatabase(coinId);
    }

    @GetMapping("/trending")
    public List<CoinResponse> getTrendingCoins() throws Exception {
        return coinService.getTrendingCoins();
    }
}
