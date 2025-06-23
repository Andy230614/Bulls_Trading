package com.shub.service;

import com.shub.domain.OrderType;
import com.shub.model.Coin;
import com.shub.model.Order;
import com.shub.model.OrderItem;
import com.shub.response.OrderResponse;
import com.shub.model.User;

import java.util.List;

public interface OrderService {

    Order createOrder(User user, OrderItem orderitem, OrderType ordertype);

    Order getOrderById(Long  orderId) throws Exception;

    List<Order> getAllOrderOfUser(Long userId, OrderType orderType,String assetSymbol );

    List<OrderResponse> getAllOrderResponse(Long userId, OrderType orderType, String assetSymbol);

    Order processOrder(Coin coin, double quantity, OrderType orderType, User user) throws Exception;
}
