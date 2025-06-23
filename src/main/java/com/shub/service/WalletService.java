package com.shub.service;

import com.shub.model.Order;
import com.shub.model.User;
import com.shub.model.Wallet;
import com.shub.model.WalletTransaction;

import java.math.BigDecimal;
import java.util.List;

public interface WalletService {
    Wallet getUserWallet(User user);
    Wallet addBalance(Wallet wallet, BigDecimal money);
    Wallet addBalanceToWallet(Wallet wallet, BigDecimal money);
    Wallet findWalletById(Long id) throws Exception;
    Wallet walletToWalletTransfer(User sender, Wallet receiverWallet, BigDecimal amount) throws Exception;
    Wallet withdrawFromWallet(User user, BigDecimal amount) throws Exception;
    public void addTransaction(Wallet wallet, BigDecimal amount, String purpose);
    Wallet payOrderPayment(Order order, User user) throws Exception;
    List<WalletTransaction> getUserWalletTransactions(User user) throws Exception;
}