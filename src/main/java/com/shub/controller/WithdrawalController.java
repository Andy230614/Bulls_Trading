package com.shub.controller;

import com.shub.domain.WalletTransactionType;
import com.shub.model.User;
import com.shub.model.Wallet;
import com.shub.model.WalletTransaction;
import com.shub.model.Withdrawal;
import com.shub.request.WithdrawalRequest;
import com.shub.service.TransactionService;
import com.shub.service.UserService;
import com.shub.service.WalletService;
import com.shub.service.WithdrawalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api")
public class WithdrawalController {

    @Autowired
    private WithdrawalService withdrawalService;

    @Autowired
    private WalletService walletService;

    @Autowired
    private UserService userService;

    @Autowired
    private TransactionService transactionService;

    /**
     * User requests a withdrawal from their wallet balance.
     */
    @PostMapping("/withdrawal")
    public ResponseEntity<?> withdrawalRequest(
            @RequestBody WithdrawalRequest request,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        BigDecimal amount = request.getAmount();

        User user = userService.findUserProfileByJwt(jwt);
        Wallet userWallet = walletService.getUserWallet(user);

        if (userWallet.getBalance().compareTo(amount) < 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Insufficient balance");
        }

        // Create a withdrawal record
        Withdrawal withdrawal = withdrawalService.requestWithdrawal(amount, user);

        // Deduct balance
        walletService.addBalance(userWallet, amount.negate());

        // Log transaction
        transactionService.createTransaction(
                userWallet,
                WalletTransactionType.WITHDRAWAL,
                null,
                "Bank account withdrawal",
                amount
        );

        return ResponseEntity.ok(withdrawal);
    }

    /**
     * Admin approves or rejects a withdrawal request.
     */
    @PatchMapping("/admin/withdrawal/{id}/proceed/{accept}")
    public ResponseEntity<?> proceedWithWithdrawal(
            @PathVariable Long id,
            @PathVariable boolean accept,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        User User = userService.findUserProfileByJwt(jwt); // Authorization check should happen in a filter/interceptor

        Withdrawal withdrawal = withdrawalService.proceedWithWithdrawal(id, accept);

        if (!accept) {
            // Refund user if withdrawal is rejected
            Wallet userWallet = walletService.getUserWallet(withdrawal.getUser());
            walletService.addBalance(userWallet, withdrawal.getAmount());

            // Log refund transaction
            transactionService.createTransaction(
                    userWallet,
                    WalletTransactionType.DEPOSIT,
                    null,
                    "Withdrawal refund",
                    withdrawal.getAmount()
            );
        }

        return ResponseEntity.ok(withdrawal);
    }

    /**
     * User retrieves their withdrawal history.
     */
    @PostMapping("/history/withdrawal")
    public ResponseEntity<List<Withdrawal>> getUserWithdrawalHistory(
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        List<Withdrawal> history = withdrawalService.getUsersWithdrawalHistory(user);
        return ResponseEntity.ok(history);
    }

    /**
     * Admin retrieves all withdrawal requests.
     */
    @GetMapping("/admin/withdrawal")
    public ResponseEntity<List<Withdrawal>> getAllWithdrawalRequests(
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        User adminUser = userService.findUserProfileByJwt(jwt); // Optionally check admin privileges here
        List<Withdrawal> requests = withdrawalService.getAllWithdrawalRequest();
        return ResponseEntity.ok(requests);
    }
}
