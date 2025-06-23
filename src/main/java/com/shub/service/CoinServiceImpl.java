package com.shub.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shub.model.Coin;
import com.shub.repository.CoinRepository;
import com.shub.response.CoinResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.*;
import java.util.concurrent.Semaphore;

@Service
public class CoinServiceImpl implements CoinService {

    private final CoinRepository coinRepository;
    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate = new RestTemplate();
    private static final Semaphore RATE_LIMITER = new Semaphore(30);

    @Autowired
    public CoinServiceImpl(CoinRepository coinRepository, ObjectMapper objectMapper) {
        this.coinRepository = coinRepository;
        this.objectMapper = objectMapper;
    }

    private HttpHeaders buildHeaders() {
        return new HttpHeaders();
    }

    @FunctionalInterface
    private interface ApiCall<T> {
        T call() throws Exception;
    }

    private <T> T withRateLimit(ApiCall<T> apiCall) throws Exception {
        if (!RATE_LIMITER.tryAcquire()) {
            throw new RuntimeException("Rate limit exceeded: Too many requests");
        }
        try {
            return apiCall.call();
        } finally {
            RATE_LIMITER.release();
        }
    }
    

    @Override
@Cacheable(value = "coinList", key = "#page")
public List<CoinResponse> getCoinList(int page) throws Exception {
    return withRateLimit(() -> {
        String url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=10&page=" + page;
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity<>(buildHeaders()), String.class);

        JsonNode root = objectMapper.readTree(response.getBody());
        List<CoinResponse> coinResponses = new ArrayList<>();

        for (JsonNode node : root) {
            CoinResponse coin = new CoinResponse();
            coin.setId(node.path("id").asText());
            coin.setName(node.path("name").asText());
            coin.setSymbol(node.path("symbol").asText());
            coin.setImage(node.path("image").asText());
            coin.setCurrentPrice(node.path("current_price").asDouble(0));
            coin.setMarketCap(node.path("market_cap").asDouble(0));
            coin.setTotalVolume(node.path("total_volume").asDouble(0));
            coin.setPriceChangePercentage24h(node.path("price_change_percentage_24h").asDouble(0));

            // ✅ ADD THIS LINE:
            coin.setMarketCapChange24h(node.path("market_cap_change_24h").asDouble(0));

            coinResponses.add(coin);
        }

        return coinResponses;
    });
}


    @Override
    @Cacheable(value = "marketChart", key = "#coinId + '_' + #days")
    public String getMarketChart(String coinId, int days) throws Exception {
        return withRateLimit(() -> {
            String url = String.format("https://api.coingecko.com/api/v3/coins/%s/market_chart?vs_currency=usd&days=%d", coinId, days);
            return restTemplate.exchange(url, HttpMethod.GET, new HttpEntity<>(buildHeaders()), String.class).getBody();
        });
    }

    @Override
    @Cacheable(value = "coinDetails", key = "#coinId")
    public String getCoinDetails(String coinId) throws Exception {
        return withRateLimit(() -> {
            String url = "https://api.coingecko.com/api/v3/coins/" + coinId;
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity<>(buildHeaders()), String.class);

            String body = response.getBody();
            if (body == null) throw new RuntimeException("Empty response for coin: " + coinId);

            JsonNode json = objectMapper.readTree(body);
            if (json == null || json.isEmpty()) throw new RuntimeException("Invalid JSON for coin: " + coinId);

            Coin coin = parseCoinDetails(json);
            coinRepository.save(coin);
            return body;
        });
    }

    private Coin parseCoinDetails(JsonNode json) {
        Coin coin = new Coin();
        coin.setId(json.path("id").asText(""));
        coin.setName(json.path("name").asText(""));
        coin.setSymbol(json.path("symbol").asText(""));
        coin.setImage(json.path("image").path("large").asText(""));

        JsonNode market = json.path("market_data");

        coin.setCurrentPrice(BigDecimal.valueOf(market.path("current_price").path("usd").asDouble(0)));
        coin.setFullyDiluteValuation(BigDecimal.valueOf(market.path("fully_diluted_valuation").path("usd").asDouble(0)));

        coin.setMarketCap(market.path("market_cap").path("usd").asLong(0));
        coin.setTotalVolume(market.path("total_volume").path("usd").asLong(0));
        coin.setMarketCapChange24h(market.path("market_cap_change_24h").asLong(0));
        coin.setTotalSupply(market.path("total_supply").asLong(0));
        coin.setCirculatingSupply(market.path("circulating_supply").asLong(0));
        coin.setMaxSupply(market.path("max_supply").asLong(0));

        coin.setMarketCapRank(market.path("market_cap_rank").asInt(0));
        coin.setHigh24h(market.path("high_24h").path("usd").asDouble(0));
        coin.setLow24h(market.path("low_24h").path("usd").asDouble(0));
        coin.setPriceChange24h(market.path("price_change_24h").asDouble(0));
        coin.setPriceChangePercentage24h(market.path("price_change_percentage_24h").asDouble(0));
        coin.setMarketCapChangePercentage24h(market.path("market_cap_change_percentage_24h").asDouble(0));
        coin.setAth(market.path("ath").path("usd").asDouble(0));
        coin.setAthChangePercentage(market.path("ath_change_percentage").path("usd").asDouble(0));
        coin.setAtl(market.path("atl").path("usd").asDouble(0));
        coin.setAtlChangePercentage(market.path("atl_change_percentage").path("usd").asDouble(0));

        try {
            coin.setAthDate(objectMapper.convertValue(market.path("ath_date").path("usd"), Date.class));
            coin.setAtlDate(objectMapper.convertValue(market.path("atl_date").path("usd"), Date.class));
        } catch (Exception e) {
            System.out.println("Date parsing error: " + e.getMessage());
        }

        return coin;
    }

    @Override
    @Cacheable(value = "searchCoin", key = "#keyword")
    public String searchCoin(String keyword) throws Exception {
        return withRateLimit(() -> {
            String url = "https://api.coingecko.com/api/v3/search?query=" + keyword;
            return restTemplate.exchange(url, HttpMethod.GET, new HttpEntity<>(buildHeaders()), String.class).getBody();
        });
    }

    @Override
    @Cacheable(value = "topFiftyCoins")
    public List<CoinResponse> getTopFiftyCoinByMarketCapRank() throws Exception {
        return withRateLimit(() -> {
            String url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=50&page=1";
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity<>(buildHeaders()), String.class);

            JsonNode root = objectMapper.readTree(response.getBody());
            List<CoinResponse> coinResponses = new ArrayList<>();

            for (JsonNode node : root) {
                CoinResponse coin = new CoinResponse();
                coin.setId(node.path("id").asText());
                coin.setName(node.path("name").asText());
                coin.setSymbol(node.path("symbol").asText());
                coin.setImage(node.path("image").asText());
                coin.setCurrentPrice(node.path("current_price").asDouble(0));
                coin.setMarketCap(node.path("market_cap").asDouble(0));
                coin.setTotalVolume(node.path("total_volume").asDouble(0));
                coin.setPriceChangePercentage24h(node.path("price_change_percentage_24h").asDouble(0));
                coinResponses.add(coin);
            }

            return coinResponses;
        });
    }

    @Override
    @Cacheable(value = "trendingCoins")
    public List<CoinResponse> getTrendingCoins() throws Exception {
        return withRateLimit(() -> {
            String url = "https://api.coingecko.com/api/v3/search/trending";
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity<>(buildHeaders()), String.class);
            return parseTrendingCoinResponses(objectMapper.readTree(response.getBody()));
        });
    }

    private List<CoinResponse> parseTrendingCoinResponses(JsonNode json) {
        List<CoinResponse> coins = new ArrayList<>();
        for (JsonNode coinNode : json.path("coins")) {
            JsonNode item = coinNode.path("item");
            CoinResponse coin = new CoinResponse();
            coin.setId(item.path("id").asText());
            coin.setName(item.path("name").asText());
            coin.setSymbol(item.path("symbol").asText());
            coin.setImage(item.path("large").asText());
            coin.setMarketCap(item.path("market_cap_rank").asDouble()); // fallback
            coin.setCurrentPrice(0);
            coin.setTotalVolume(0);
            coin.setPriceChangePercentage24h(0);
            coins.add(coin);
        }
        return coins;
    }

    @Override
@Cacheable("topGainers")
public List<CoinResponse> getTopGainers() throws Exception {
    return withRateLimit(() -> {
        String url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1";
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity<>(buildHeaders()), String.class);
        JsonNode root = objectMapper.readTree(response.getBody());

        List<CoinResponse> allCoins = new ArrayList<>();
        for (JsonNode node : root) {
            CoinResponse coin = new CoinResponse();
            coin.setId(node.path("id").asText());
            coin.setName(node.path("name").asText());
            coin.setSymbol(node.path("symbol").asText());
            coin.setImage(node.path("image").asText());
            coin.setCurrentPrice(node.path("current_price").asDouble(0));
            coin.setMarketCap(node.path("market_cap").asDouble(0));
            coin.setTotalVolume(node.path("total_volume").asDouble(0));
            coin.setPriceChangePercentage24h(node.path("price_change_percentage_24h").asDouble(0));
            allCoins.add(coin);
        }

        // Sort descending by price change percentage
        allCoins.sort((a, b) -> Double.compare(b.getPriceChangePercentage24h(), a.getPriceChangePercentage24h()));
        return allCoins.subList(0, Math.min(10, allCoins.size())); // Top 10 gainers
    });
}

@Override
@Cacheable("topLosers")
public List<CoinResponse> getTopLosers() throws Exception {
    return withRateLimit(() -> {
        String url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1";
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity<>(buildHeaders()), String.class);
        JsonNode root = objectMapper.readTree(response.getBody());

        List<CoinResponse> allCoins = new ArrayList<>();
        for (JsonNode node : root) {
            CoinResponse coin = new CoinResponse();
            coin.setId(node.path("id").asText());
            coin.setName(node.path("name").asText());
            coin.setSymbol(node.path("symbol").asText());
            coin.setImage(node.path("image").asText());
            coin.setCurrentPrice(node.path("current_price").asDouble(0));
            coin.setMarketCap(node.path("market_cap").asDouble(0));
            coin.setTotalVolume(node.path("total_volume").asDouble(0));
            coin.setPriceChangePercentage24h(node.path("price_change_percentage_24h").asDouble(0));
            allCoins.add(coin);
        }

        // Sort ascending by price change percentage
        allCoins.sort(Comparator.comparingDouble(CoinResponse::getPriceChangePercentage24h));
        return allCoins.subList(0, Math.min(10, allCoins.size())); // Top 10 losers
    });
}

    @Override
    public Coin findById(String coinId) throws Exception {
        return coinRepository.findById(coinId)
                .orElseThrow(() -> new Exception("Coin not found: " + coinId));
    }

    @Override
public CoinResponse getCoinFromDatabase(String coinId) throws Exception {
    Coin coin = coinRepository.findById(coinId)
        .orElseThrow(() -> new Exception("Coin not found in database"));

    CoinResponse response = new CoinResponse();
response.setId(coin.getId());
response.setName(coin.getName());
response.setSymbol(coin.getSymbol());
response.setImage(coin.getImage());
response.setCurrentPrice(coin.getCurrentPrice().doubleValue());
response.setMarketCap(coin.getMarketCap());
response.setMarketCapRank(coin.getMarketCapRank()); // or .intValue() if needed
response.setTotalVolume(coin.getTotalVolume());

    return response;
}


    @Scheduled(fixedRate = 600000)
    @CacheEvict(value = {
            "coinList", "marketChart", "coinDetails",
            "searchCoin", "topFiftyCoins", "trendingCoins"
    }, allEntries = true)
    public void refreshAllCaches() {
        System.out.println("Refreshing all cache entries...");
    }
}  
