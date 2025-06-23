package com.shub.repository;

import com.shub.domain.OrderType;
import com.shub.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserId(Long userId);

    List<Order> findByUserIdAndOrderType(Long userId, OrderType orderType);

    @Query("SELECT o FROM Order o JOIN o.orderItem oi JOIN oi.coin c WHERE o.user.id = :userId AND c.symbol = :symbol")
    List<Order> findByUserIdAndAssetSymbol(@Param("userId") Long userId, @Param("symbol") String assetSymbol);

    @Query("SELECT o FROM Order o JOIN o.orderItem oi JOIN oi.coin c WHERE o.user.id = :userId AND o.orderType = :orderType AND c.symbol = :symbol")
    List<Order> findByUserIdAndOrderTypeAndAssetSymbol(@Param("userId") Long userId, @Param("orderType") OrderType orderType, @Param("symbol") String assetSymbol);

    @Query("SELECT o FROM Order o JOIN FETCH o.orderItem oi JOIN FETCH oi.coin WHERE o.user.id = :userId")
    List<Order> findAllWithOrderItemAndCoinByUserId(@Param("userId") Long userId);

    // ✅ ADD THIS
    @Query("SELECT o FROM Order o JOIN FETCH o.orderItem oi JOIN FETCH oi.coin c WHERE o.user.id = :userId AND c.symbol = :symbol")
    List<Order> findAllWithOrderItemAndCoinByUserIdAndAssetSymbol(@Param("userId") Long userId, @Param("symbol") String assetSymbol);

    // ✅ ADD THIS
    @Query("SELECT o FROM Order o JOIN FETCH o.orderItem oi JOIN FETCH oi.coin c WHERE o.user.id = :userId AND o.orderType = :orderType AND c.symbol = :symbol")
    List<Order> findAllWithOrderItemAndCoinByUserIdAndOrderTypeAndAssetSymbol(@Param("userId") Long userId, @Param("orderType") OrderType orderType, @Param("symbol") String assetSymbol);

    // ✅ OPTIONAL: If needed for filtering by orderType only
    @Query("SELECT o FROM Order o JOIN FETCH o.orderItem oi JOIN FETCH oi.coin c WHERE o.user.id = :userId AND o.orderType = :orderType")
    List<Order> findAllWithOrderItemAndCoinByUserIdAndOrderType(@Param("userId") Long userId, @Param("orderType") OrderType orderType);
}
