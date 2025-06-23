package com.shub.controller;

import com.shub.domain.WalletTransactionType;
import com.shub.model.*;
import com.shub.request.WithdrawalRequest;
import com.shub.response.PaymentResponse;
import com.shub.response.TransactionResponse;
import com.shub.response.WalletResponse;
import com.shub.service.*;
import com.shub.controller.WalletMapper; // ✅ import your new mapper

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
public class WalletController {

    @Autowired private WalletService walletService;
    @Autowired private UserService userService;
    @Autowired private OrderService orderService;
    @Autowired private TransactionService transactionService;
    @Autowired private PaymentService paymentService;
    @Autowired
    private WithdrawalService withdrawalService;

    // ✅ use WalletMapper
    @GetMapping("/api/wallet")
    public ResponseEntity<WalletResponse> getUserWallet(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        Wallet wallet = walletService.getUserWallet(user);
        WalletResponse response = WalletMapper.mapToWalletResponse(wallet);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/api/wallet/transactions")
    public ResponseEntity<List<TransactionResponse>> getUserWalletTransactions(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        Wallet wallet = walletService.getUserWallet(user);
        List<TransactionResponse> transactions = transactionService.getTransactionsByWallet(wallet);
        return new ResponseEntity<>(transactions, HttpStatus.OK);
    }

    @PutMapping("/api/wallet/{walletId}/transfer")
    public ResponseEntity<Wallet> walletToWalletTransfer(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long walletId,
            @RequestBody WalletTransaction req) throws Exception {

        User senderUser = userService.findUserProfileByJwt(jwt);
        Wallet receiverWallet = walletService.findWalletById(walletId);
        Wallet updatedWallet = walletService.walletToWalletTransfer(senderUser, receiverWallet, req.getAmount());

        return new ResponseEntity<>(updatedWallet, HttpStatus.OK);
    }

    @PutMapping("/api/wallet/order/{orderId}/pay")
    public ResponseEntity<Wallet> payOrderPayment(@RequestHeader("Authorization") String jwt, @PathVariable Long orderId) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        Order order = orderService.getOrderById(orderId);
        Wallet updatedWallet = walletService.payOrderPayment(order, user);
        return new ResponseEntity<>(updatedWallet, HttpStatus.OK);
    }

    @PutMapping("/api/wallet/deposit")
    public ResponseEntity<Wallet> addMoneyToWallet(
            @RequestHeader("Authorization") String jwt,
            @RequestParam(name = "order_id") Long orderId,
            @RequestParam(name = "payment_id") String paymentId) throws Exception {

        User user = userService.findUserProfileByJwt(jwt);
        Wallet wallet = walletService.getUserWallet(user);
        PaymentOrder order = paymentService.getPaymentOrderById(orderId);
        boolean paymentSuccess = paymentService.proceedPaymentOrder(order, paymentId);

        if (wallet.getBalance() == null) wallet.setBalance(BigDecimal.ZERO);

        if (paymentSuccess) {
            walletService.addBalance(wallet, BigDecimal.valueOf(order.getAmount()));
        }

        return new ResponseEntity<>(wallet, HttpStatus.OK);
    }

    @PostMapping("/api/wallet/withdrawal")
public ResponseEntity<?> withdraw(@RequestBody WithdrawalRequest request, @RequestHeader("Authorization") String jwt) throws Exception {
    User user = userService.findUserProfileByJwt(jwt);

    // Create withdrawal
    Withdrawal withdrawal = withdrawalService.requestWithdrawal(request.getAmount(), user);

    // Proceed
    withdrawalService.proceedWithWithdrawal(withdrawal.getId(), true);

    // Return updated wallet
    Wallet updatedWallet = walletService.getUserWallet(user);
    return ResponseEntity.ok(updatedWallet);
}

    @PutMapping("/api/wallet/deposit/amount/{amount}")
    public ResponseEntity<PaymentResponse> depositMoney(
            @RequestHeader("Authorization") String jwt,
            @PathVariable BigDecimal amount) throws Exception {

        User user = userService.findUserProfileByJwt(jwt);
        Wallet wallet = walletService.getUserWallet(user);
        walletService.addBalanceToWallet(wallet, amount);

        PaymentResponse res = new PaymentResponse();
        res.setPayment_url("deposit success");
        return new ResponseEntity<>(res, HttpStatus.OK);
    }
}
