package com.shub.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.shub.domain.WalletTransactionType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Data
@ToString(exclude = "wallet")  // Exclude wallet to prevent recursion in toString()
public class WalletTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "wallet_id")
    @JsonBackReference
    private Wallet wallet;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", length = 20)
    private WalletTransactionType type;

    private LocalDate date;
    private String transferId;
    private String purpose;
    private BigDecimal amount;
    private String description;
}
