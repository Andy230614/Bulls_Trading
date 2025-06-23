package com.shub.model;

import com.shub.domain.OrderStatus;
import com.shub.domain.OrderType;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne(optional = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderType orderType;

    @Column(nullable = false)
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, optional = false)
    private OrderItem orderItem;

    public Coin getCoin() {
        return orderItem != null ? orderItem.getCoin() : null;
    }

    @Column(precision = 32, scale = 8)
    public BigDecimal getQuantity() {
        return orderItem != null ? orderItem.getQuantity() : null;
    }
}
