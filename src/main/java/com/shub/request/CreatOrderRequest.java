package com.shub.request;

import com.shub.domain.OrderType;
import lombok.Data;

@Data
public class CreatOrderRequest {
    private String coinId;

    private double quantity;

    private OrderType orderType;

    private double amount;
}
