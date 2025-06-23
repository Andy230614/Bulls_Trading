package com.shub.controller;

import com.shub.model.User;
import com.shub.model.Wallet;
import com.shub.response.TransactionResponse;
import com.shub.service.TransactionService;
import com.shub.service.UserService;
import com.shub.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class TransactionController {

    @Autowired
    private WalletService walletService;

    @Autowired
    private UserService userService;

    @Autowired
    private TransactionService transactionService;

    @GetMapping("/api/transactions")
    public ResponseEntity<List<TransactionResponse>> getTransactionByWallet(
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        Wallet wallet = walletService.getUserWallet(user);

        List<TransactionResponse> response = transactionService.getTransactionsByWallet(wallet);

        return ResponseEntity.ok(response);
    }
}
