package com.shub.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private BigDecimal quantity;

    @ManyToOne(optional = false)
    private Coin coin;

    private BigDecimal buyPrice;
    private BigDecimal sellPrice;

    @JsonIgnore
    @OneToOne(optional = false)
    @JoinColumn(name = "order_id", referencedColumnName = "id")
    private Order order;
}
