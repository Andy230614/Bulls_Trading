package com.shub.service;

import com.shub.domain.WalletTransactionType;
import com.shub.model.Wallet;
import com.shub.model.WalletTransaction;
import com.shub.response.TransactionResponse;
import java.math.BigDecimal;

import java.util.List;

public interface TransactionService {
    List<TransactionResponse> getTransactionsByWallet(Wallet wallet);

    // TransactionService.java
    public WalletTransaction createTransaction(
            Wallet wallet,
            WalletTransactionType type,
            String transferId,
            String purpose,
            BigDecimal amount
    );

}
