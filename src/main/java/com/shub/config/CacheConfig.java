package com.shub.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

@Configuration
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager("chartData", "marketChart", "coinDetails", "coinList", "topFiftyCoins", "searchCoin", "trendingCoins", "topGainers", "topLosers"); // Add "coinDetails"*/*654 */
        cacheManager.setCaffeine(
            Caffeine.newBuilder() 
                    .expireAfterWrite(1, TimeUnit.HOURS)
                    .maximumSize(100)
        );
        return cacheManager;
    }
}
