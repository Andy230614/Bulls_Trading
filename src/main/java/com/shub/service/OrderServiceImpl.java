package com.shub.service;

import com.shub.domain.OrderStatus;
import com.shub.domain.OrderType;
import com.shub.model.*;
import com.shub.repository.OrderRepository;
import com.shub.response.OrderResponse;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private WalletService walletService;

    @Autowired
    private AssetService assetService;

    private static final BigDecimal MIN_QUANTITY = new BigDecimal("0.00000001");

    @Override
    public Order getOrderById(Long orderId) throws Exception {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new Exception("Order not found"));
    }

    @Override
    public List<Order> getAllOrderOfUser(Long userId, OrderType orderType, String assetSymbol) {
        boolean hasOrderType = orderType != null;
        boolean hasAssetSymbol = assetSymbol != null && !assetSymbol.isEmpty();

        if (!hasOrderType && !hasAssetSymbol) {
            return orderRepository.findAllWithOrderItemAndCoinByUserId(userId);
        } else if (hasOrderType && !hasAssetSymbol) {
            return orderRepository.findAllWithOrderItemAndCoinByUserIdAndOrderType(userId, orderType);
        } else if (!hasOrderType && hasAssetSymbol) {
            return orderRepository.findAllWithOrderItemAndCoinByUserIdAndAssetSymbol(userId, assetSymbol);
        } else {
            return orderRepository.findAllWithOrderItemAndCoinByUserIdAndOrderTypeAndAssetSymbol(userId, orderType, assetSymbol);
        }
    }

    @Override
    public List<OrderResponse> getAllOrderResponse(Long userId, OrderType orderType, String assetSymbol) {
        List<Order> orders = getAllOrderOfUser(userId, orderType, assetSymbol);

        return orders.stream().map(order -> {
            OrderResponse res = new OrderResponse();
            res.setId(order.getId());
            res.setOrderType(order.getOrderType().name());
            res.setStatus(order.getStatus().name());
            res.setPrice(order.getPrice().doubleValue());
            res.setCreatedAt(order.getCreatedAt());

            if (order.getOrderItem() != null) {
                res.setQuantity(order.getOrderItem().getQuantity().doubleValue());
                res.setCoinSymbol(order.getOrderItem().getCoin().getSymbol());
                res.setImage(order.getOrderItem().getCoin().getImage());
                res.setCoinName(order.getOrderItem().getCoin().getName());
                res.setBuyPrice(order.getOrderItem().getBuyPrice());
                res.setSellPrice(order.getOrderItem().getSellPrice());
            }

            return res;
        }).toList();
    }

    @Override
    public Order createOrder(User user, OrderItem orderItem, OrderType orderType) {
        BigDecimal price = orderItem.getCoin().getCurrentPrice().multiply(orderItem.getQuantity());

        Order order = new Order();
        order.setUser(user);
        order.setOrderType(orderType);
        order.setPrice(price);
        order.setStatus(OrderStatus.PENDING);

        order.setOrderItem(orderItem);
        orderItem.setOrder(order);

        return orderRepository.save(order);
    }

    @Transactional
    public Order buyAsset(Coin coin, double quantityDouble, User user) throws Exception {
        BigDecimal quantity = new BigDecimal(String.format("%.8f", quantityDouble)).setScale(8, RoundingMode.DOWN);

        if (quantity.compareTo(MIN_QUANTITY) < 0) {
            throw new IllegalArgumentException("Quantity must be at least 0.00000001");
        }

        BigDecimal buyPrice = coin.getCurrentPrice();

        OrderItem orderItem = new OrderItem();
        orderItem.setCoin(coin);
        orderItem.setQuantity(quantity);
        orderItem.setBuyPrice(buyPrice);
        orderItem.setSellPrice(BigDecimal.ZERO);

        Order order = createOrder(user, orderItem, OrderType.BUY);
        walletService.payOrderPayment(order, user);

        order.setStatus(OrderStatus.SUCCESS);
        orderRepository.save(order);

        Asset existingAsset = assetService.findAssetByUserIdAndCoinId(user.getId(), coin.getId());
        if (existingAsset == null) {
            assetService.creatAsset(user, coin, quantity);
        } else {
            assetService.updateAsset(existingAsset.getId(), quantity);
        }

        return order;
    }

    @Transactional
    public Order sellAsset(Coin coin, double quantityDouble, User user) throws Exception {
        BigDecimal quantity = BigDecimal.valueOf(quantityDouble).setScale(8, RoundingMode.DOWN);

        if (quantity.compareTo(MIN_QUANTITY) < 0) {
            throw new IllegalArgumentException("Quantity must be at least 0.00000001");
        }

        BigDecimal sellPrice = coin.getCurrentPrice().setScale(8, RoundingMode.DOWN);

        Asset assetToSell = assetService.findAssetByUserIdAndCoinId(user.getId(), coin.getId());
        if (assetToSell == null) {
            throw new IllegalArgumentException("Asset not found");
        }

        BigDecimal availableQuantity = assetToSell.getQuantity().setScale(8, RoundingMode.DOWN);

        if (availableQuantity.compareTo(quantity) < 0) {
            throw new IllegalArgumentException("Insufficient quantity to sell");
        }

        BigDecimal buyPrice = assetToSell.getBuyPrice();

        OrderItem orderItem = new OrderItem();
        orderItem.setCoin(coin);
        orderItem.setQuantity(quantity);
        orderItem.setBuyPrice(buyPrice);
        orderItem.setSellPrice(sellPrice);

        Order order = createOrder(user, orderItem, OrderType.SELL);
        walletService.payOrderPayment(order, user);

        order.setStatus(OrderStatus.SUCCESS);
        orderRepository.save(order);

        Asset updatedAsset = assetService.updateAsset(assetToSell.getId(), quantity.negate());
        BigDecimal totalValue = updatedAsset.getQuantity().multiply(coin.getCurrentPrice());

        BigDecimal epsilon = new BigDecimal("0.00000001");
        if (totalValue.compareTo(BigDecimal.ONE) <= 0 && updatedAsset.getQuantity().compareTo(epsilon) < 0) {
            assetService.deleteAsset(updatedAsset.getId());
        }

        return order;
    }

    @Transactional
    @Override
    public Order processOrder(Coin coin, double quantity, OrderType orderType, User user) throws Exception {
        return switch (orderType) {
            case BUY -> buyAsset(coin, quantity, user);
            case SELL -> sellAsset(coin, quantity, user);
        };
    }
}
