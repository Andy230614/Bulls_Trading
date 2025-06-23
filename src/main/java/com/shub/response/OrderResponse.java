package com.shub.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private String orderType;
    private double price;

    @Column(precision = 18, scale = 8)
    private double quantity;

    private String image;
    private BigDecimal buyPrice;
    private BigDecimal sellPrice;
    private String status;
    private LocalDateTime createdAt;
    private String coinName;
    private String coinSymbol;
}
