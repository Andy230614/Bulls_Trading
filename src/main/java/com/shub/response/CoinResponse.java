package com.shub.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CoinResponse {
    private String id;
    private String name;
    private String symbol;
    private String image;
    private double currentPrice;
    private double marketCap;
    private double totalVolume;
    private int marketCapRank;
    private double priceChangePercentage24h;
    private double marketCapChange24h;
}
