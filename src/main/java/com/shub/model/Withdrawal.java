package com.shub.model;

import com.shub.domain.WithdrawalStatus;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

import java.time.LocalDateTime;

@Data
@Entity
public class Withdrawal {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Enumerated(EnumType.ORDINAL) // ✅ Important: ORDINAL maps to 0, 1, 2...
    private WithdrawalStatus status;

    private BigDecimal amount;

    @ManyToOne
    private User user;

    private LocalDateTime date=LocalDateTime.now();

}
