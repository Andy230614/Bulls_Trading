package com.shub.service;

import com.shub.domain.WalletTransactionType;
import com.shub.model.User;
import com.shub.model.Wallet;
import com.shub.model.WalletTransaction;
import com.shub.repository.WalletTransactionRepository;
import com.shub.response.TransactionResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class TransactionServiceImpl implements TransactionService {

    @Autowired
    private WalletTransactionRepository wallettransactionRepository;

    @Override
    public List<TransactionResponse> getTransactionsByWallet(Wallet wallet) {
        System.out.println("Wallet ID: " + wallet.getId());
        List<WalletTransaction> transactions = wallettransactionRepository.findByWallet(wallet);
        System.out.println("Transactions: " + transactions);

        List<TransactionResponse> responseList = new ArrayList<>();

        for (WalletTransaction tx : transactions) {
            TransactionResponse response = new TransactionResponse();

            response.setId(tx.getId());
            response.setType(tx.getType().toString());
            response.setDate(tx.getDate());
            response.setTransferId(tx.getTransferId());
            response.setPurpose(tx.getPurpose());
            response.setAmount(tx.getAmount());

            TransactionResponse.WalletInfo walletInfo = new TransactionResponse.WalletInfo();
            walletInfo.setId(wallet.getId());
            walletInfo.setBalance(wallet.getBalance()); // ✅ convert BigDecimal → Long

            User user = wallet.getUser();

            TransactionResponse.UserInfo userInfo = new TransactionResponse.UserInfo();
            userInfo.setId(user.getId());
            userInfo.setFullName(user.getFullName());
            userInfo.setEmail(user.getEmail());

            if (user.getTwoFactorAuth() != null) {
                userInfo.setTwoFactorAuth(user.getTwoFactorAuth().isEnabled());
            } else {
                userInfo.setTwoFactorAuth(false);
            }

            userInfo.setEnabled(user.isEnabled());
            userInfo.setRole(user.getRole().toString());
            userInfo.setSendTo(tx.getTransferId()); // Or tx.getSendTo() if applicable

            walletInfo.setUser(userInfo);
            response.setWallet(walletInfo);

            responseList.add(response);
        }

        return responseList;
    }

    @Override
    public WalletTransaction createTransaction(
            Wallet wallet,
            WalletTransactionType type,
            String transferId,
            String purpose,
            BigDecimal amount // input is Long
    ) {
        WalletTransaction transaction = new WalletTransaction();
        transaction.setWallet(wallet);
        transaction.setType(type);
        transaction.setTransferId(transferId);
        transaction.setPurpose(purpose);
        transaction.setDate(LocalDate.now());
        transaction.setAmount(amount); // ✅ convert Long → BigDecimal

        return wallettransactionRepository.save(transaction);
    }
}
