package com.shub.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Coin {
    
    @Id
    private String id;

    private String name;
    private String symbol;
    private String image;

    @Column(name = "current_price")
    private BigDecimal currentPrice;

    private long marketCap;
    private int marketCapRank;
    private long totalVolume;

    private double high24h;
    private double low24h;
    private double priceChange24h;
    private double priceChangePercentage24h;
    private long marketCapChange24h;
    private double marketCapChangePercentage24h;

    private long totalSupply;
    private long circulatingSupply;
    private long maxSupply;

    private double ath;
    private double athChangePercentage;
    private double atl;
    private double atlChangePercentage;

    private Date athDate;
    private Date atlDate;

    @Column(name = "fully_dilute_valuation")
    private BigDecimal fullyDiluteValuation;
}
