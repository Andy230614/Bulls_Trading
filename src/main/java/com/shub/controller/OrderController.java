package com.shub.controller;

import com.shub.domain.OrderType;
import com.shub.response.OrderResponse;
import com.shub.model.Coin;
import com.shub.model.Order;
import com.shub.model.User;
import com.shub.request.CreatOrderRequest;
import com.shub.service.CoinService;
import com.shub.service.OrderService;
import com.shub.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    @Autowired
    private CoinService coinService;

    @PostMapping("/pay")
    public ResponseEntity<?> payOrderPayment(
            @RequestHeader("Authorization") String jwt,
            @RequestBody CreatOrderRequest req
    ) {
        try {
            if (req.getQuantity() <= 0) {
                return ResponseEntity.badRequest().body("Quantity should be greater than zero");
            }

            User user = userService.findUserProfileByJwt(jwt);
            Coin coin = coinService.findById(req.getCoinId());

            Order order = orderService.processOrder(
                    coin,
                    req.getQuantity(),
                    req.getOrderType(),
                    user
            );

            return ResponseEntity.ok(order);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Server error: " + e.getMessage());
        }
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderById(
            @RequestHeader("Authorization") String jwtToken,
            @PathVariable Long orderId
    ) {
        try {
            User user = userService.findUserProfileByJwt(jwtToken);
            Order order = orderService.getOrderById(orderId);
            if (order.getUser().getId().equals(user.getId())) {
                return ResponseEntity.ok(order);
            } else {
                return ResponseEntity.status(403).body("You don't have access to this order");
            }
        } catch (Exception e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllOrderForUser(
            @RequestHeader("Authorization") String jwt,
            @RequestParam(required = false) String order_type,
            @RequestParam(required = false) String asset_symbol
    ) {
        try {
            Long userId = userService.findUserProfileByJwt(jwt).getId();

            OrderType orderType = null;
            if (order_type != null) {
                try {
                    orderType = OrderType.valueOf(order_type.toUpperCase());
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.badRequest().body("Invalid order_type. Use BUY or SELL.");
                }
            }

            List<OrderResponse> userOrders = orderService.getAllOrderResponse(userId, orderType, asset_symbol);
            return ResponseEntity.ok(userOrders);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }
}
