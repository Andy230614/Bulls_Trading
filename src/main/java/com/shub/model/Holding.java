package com.shub.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

import java.math.BigDecimal;

@Entity
@Data
@ToString(exclude = "wallet")  // Exclude wallet to prevent recursion in toString()
public class Holding {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JsonBackReference  // Prevent infinite JSON recursion
    private Wallet wallet;

    @ManyToOne
    private Coin coin;

    @Column(precision = 18, scale = 8)
    private BigDecimal quantity;
}
