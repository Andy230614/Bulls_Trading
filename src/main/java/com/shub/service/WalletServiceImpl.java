package com.shub.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.shub.domain.OrderType;
import com.shub.domain.WalletTransactionType;
import com.shub.exception.InsufficientBalanceException;
import com.shub.model.Coin;
import com.shub.model.Holding;
import com.shub.model.Order;
import com.shub.model.User;
import com.shub.model.Wallet;
import com.shub.model.WalletTransaction;
import com.shub.repository.WalletRepository;
import com.shub.repository.WalletTransactionRepository;

@Service
public class WalletServiceImpl implements WalletService {

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private WalletTransactionRepository walletTransactionRepository;

    @Override
    public Wallet getUserWallet(User user) {
        Wallet wallet = walletRepository.findByUserId(user.getId());
        if (wallet == null) {
            wallet = new Wallet();
            wallet.setUser(user);
            wallet.setBalance(BigDecimal.ZERO);
            wallet.setHoldings(new ArrayList<>());
            walletRepository.save(wallet);
        }
        return wallet;
    }

    @Override
    public void addTransaction(Wallet wallet, BigDecimal amount, String purpose) {
    WalletTransaction txn = new WalletTransaction();
    txn.setWallet(wallet);
    txn.setType(WalletTransactionType.WITHDRAWAL);
    txn.setAmount(amount);
    txn.setDescription("Withdrawal processed");
    txn.setDate(LocalDate.now());
    txn.setTransferId(UUID.randomUUID().toString());
    txn.setPurpose(purpose);
    walletTransactionRepository.save(txn);
    walletRepository.save(wallet);
}


    @Override
    public Wallet addBalance(Wallet wallet, BigDecimal money) {
        BigDecimal balance = wallet.getBalance() != null ? wallet.getBalance() : BigDecimal.ZERO;
        wallet.setBalance(balance.add(money));
        walletRepository.save(wallet);

        WalletTransaction txn = new WalletTransaction();
        txn.setWallet(wallet);
        txn.setType(WalletTransactionType.DEPOSIT);
        txn.setAmount(money);
        txn.setDescription("Deposit via payment");
        txn.setDate(LocalDate.now());
        txn.setTransferId(UUID.randomUUID().toString());
        txn.setPurpose("DEPOSIT");

        walletTransactionRepository.save(txn);
        return wallet;
    }

    @Override
    public Wallet addBalanceToWallet(Wallet wallet, BigDecimal money) {
        return addBalance(wallet, money);
    }

    @Override
    public Wallet findWalletById(Long id) throws Exception {
        return walletRepository.findById(id).orElseThrow(() -> new Exception("Wallet not found"));
    }

    @Override
    @Transactional
    public Wallet walletToWalletTransfer(User sender, Wallet receiverWallet, BigDecimal amount) throws Exception {
        Wallet senderWallet = getUserWallet(sender);

        if (senderWallet.getBalance().compareTo(amount) < 0) {
            throw new InsufficientBalanceException("Insufficient balance to complete the transaction.");
        }

        senderWallet.setBalance(senderWallet.getBalance().subtract(amount));
        receiverWallet.setBalance(receiverWallet.getBalance().add(amount));
        walletRepository.save(senderWallet);
        walletRepository.save(receiverWallet);

        String transferId = UUID.randomUUID().toString();

        WalletTransaction senderTxn = new WalletTransaction();
        senderTxn.setWallet(senderWallet);
        senderTxn.setType(WalletTransactionType.WALLET_TRANSFER);
        senderTxn.setAmount(amount.negate());
        senderTxn.setDescription("Transfer to Wallet ID: " + receiverWallet.getId());
        senderTxn.setDate(LocalDate.now());
        senderTxn.setTransferId(transferId);
        senderTxn.setPurpose("WALLET_TRANSFER");

        walletTransactionRepository.save(senderTxn);

        WalletTransaction receiverTxn = new WalletTransaction();
        receiverTxn.setWallet(receiverWallet);
        receiverTxn.setType(WalletTransactionType.WALLET_TRANSFER);
        receiverTxn.setAmount(amount);
        receiverTxn.setDescription("Received from User ID: " + sender.getId());
        receiverTxn.setDate(LocalDate.now());
        receiverTxn.setTransferId(transferId);
        receiverTxn.setPurpose("WALLET_TRANSFER");

        walletTransactionRepository.save(receiverTxn);

        return senderWallet;
    }

@Override
@Transactional
public Wallet payOrderPayment(Order order, User user) throws Exception {
    System.out.println("=== payOrderPayment called ===");
    System.out.println("Order ID: " + order.getId());
    System.out.println("User ID: " + user.getId());
    System.out.println("Order Type: " + order.getOrderType());
    System.out.println("Order Quantity: " + order.getQuantity());
    System.out.println("Order Price: " + order.getPrice());

    Wallet wallet = getUserWallet(user);
    BigDecimal current = wallet.getBalance();

    System.out.println("Current wallet balance: " + current);

    // Initialize holdings if null
    if (wallet.getHoldings() == null) {
        wallet.setHoldings(new ArrayList<>());
        System.out.println("Holdings was null, initialized to empty list.");
    }

    Coin coin = order.getCoin();
    BigDecimal quantity = order.getQuantity();

    System.out.println("Holdings before update:");
    wallet.getHoldings().forEach(h -> {
        System.out.println(" - Coin: " + h.getCoin().getId() + ", Quantity: " + h.getQuantity());
    });

    if (OrderType.BUY.equals(order.getOrderType())) {
        if (current.compareTo(order.getPrice()) < 0) {
            throw new InsufficientBalanceException("Insufficient funds for this transaction");
        }

        wallet.setBalance(current.subtract(order.getPrice()));
        System.out.println("Wallet balance after debit: " + wallet.getBalance());

        boolean found = false;
        for (Holding h : wallet.getHoldings()) {
            if (h.getCoin().getId().equals(coin.getId())) {
                h.setQuantity(h.getQuantity().add(quantity));
                found = true;
                System.out.println("Updated existing holding for coin: " + coin.getId() + ", new quantity: " + h.getQuantity());
                break;
            }
        }

        if (!found) {
            Holding newHolding = new Holding();
            newHolding.setCoin(coin);
            newHolding.setQuantity(quantity);
            newHolding.setWallet(wallet);
            wallet.getHoldings().add(newHolding);
            System.out.println("Added new holding for coin: " + coin.getId() + ", quantity: " + quantity);
        }

    } else { // SELL
        wallet.setBalance(current.add(order.getPrice()));
        System.out.println("Wallet balance after credit: " + wallet.getBalance());

        Holding holding = wallet.getHoldings().stream()
            .filter(h -> h.getCoin().getId().equals(coin.getId()))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("You do not own this coin"));

        if (holding.getQuantity().compareTo(quantity) < 0) {
            throw new RuntimeException("Insufficient coin quantity to sell");
        }

        holding.setQuantity(holding.getQuantity().subtract(quantity));
        System.out.println("Reduced holding quantity for coin: " + coin.getId() + ", new quantity: " + holding.getQuantity());

        if (holding.getQuantity().compareTo(BigDecimal.ZERO) == 0) {
            wallet.getHoldings().remove(holding);
            System.out.println("Removed holding for coin: " + coin.getId() + " because quantity is zero");
        }
    }

    walletRepository.save(wallet);
    System.out.println("Wallet saved with updated holdings.");

    WalletTransaction txn = new WalletTransaction();
    txn.setWallet(wallet);
    txn.setAmount(order.getPrice());
    txn.setDate(LocalDate.now());
    txn.setDescription("Order payment: " + order.getOrderType());
    txn.setPurpose("ORDER");
    txn.setType(OrderType.BUY.equals(order.getOrderType())
            ? WalletTransactionType.DEBIT
            : WalletTransactionType.CREDIT);
    txn.setTransferId(UUID.randomUUID().toString());

    walletTransactionRepository.save(txn);
    System.out.println("Wallet transaction saved.");

    System.out.println("Holdings after update:");
    wallet.getHoldings().forEach(h -> {
        System.out.println(" - Coin: " + h.getCoin().getId() + ", Quantity: " + h.getQuantity());
    });

    System.out.println("=== payOrderPayment finished ===");

    return wallet;
}


    @Override
    public Wallet withdrawFromWallet(User user, BigDecimal amount) throws Exception {
        Wallet wallet = getUserWallet(user);

        if (wallet.getBalance().compareTo(amount) < 0) {
            throw new InsufficientBalanceException("Insufficient balance to withdraw");
        }

        wallet.setBalance(wallet.getBalance().subtract(amount));
        walletRepository.save(wallet);

        WalletTransaction txn = new WalletTransaction();
        txn.setWallet(wallet);
        txn.setType(WalletTransactionType.WITHDRAWAL);
        txn.setAmount(amount.negate()); // Negative to indicate debit
        txn.setDescription("User withdrawal request");
        txn.setDate(LocalDate.now());
        txn.setTransferId(UUID.randomUUID().toString());
        txn.setPurpose("WITHDRAWAL");

        walletTransactionRepository.save(txn);

        return wallet;
    }

    @Override
    public List<WalletTransaction> getUserWalletTransactions(User user) throws Exception {
        Wallet wallet = getUserWallet(user);
        return walletTransactionRepository.findByWallet(wallet);
    }
}
