package com.shub.service;

import com.shub.domain.WithdrawalStatus;
import com.shub.model.User;
import com.shub.model.Wallet;
import com.shub.model.Withdrawal;
import com.shub.repository.WithdrawalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class WithdrawalServiceImpl implements WithdrawalService {

    @Autowired
    private WithdrawalRepository withdrawalRepository;

    @Autowired
    private WalletService walletService;


    @Override
public Withdrawal requestWithdrawal(BigDecimal amount, User user) {
    Withdrawal withdrawal = new Withdrawal();
    withdrawal.setAmount(amount);
    withdrawal.setUser(user);
    withdrawal.setStatus(WithdrawalStatus.PENDING); // initial status
    return withdrawalRepository.save(withdrawal);
}

@Override
@Transactional
public Withdrawal proceedWithWithdrawal(Long withdrawalId, boolean accept) throws Exception {
    System.out.println("Inside proceedWithWithdrawal. accept=" + accept);

    Optional<Withdrawal> optionalWithdrawal = withdrawalRepository.findById(withdrawalId);
    if (optionalWithdrawal.isEmpty()) throw new Exception("Withdrawal not found");

    Withdrawal withdrawal = optionalWithdrawal.get();
    withdrawal.setDate(LocalDateTime.now());

    if (accept) {
        Wallet wallet = walletService.getUserWallet(withdrawal.getUser());
        if (wallet.getBalance().compareTo(withdrawal.getAmount()) < 0) {
            throw new Exception("Insufficient balance");
        }

        wallet.setBalance(wallet.getBalance().subtract(withdrawal.getAmount()));
        walletService.addTransaction(wallet, withdrawal.getAmount(), "WITHDRAWAL");

        withdrawal.setStatus(WithdrawalStatus.SUCCESS);
        System.out.println("Set status to SUCCESS");
    } else {
        withdrawal.setStatus(WithdrawalStatus.DECLINE);
        System.out.println("Set status to DECLINE");
    }

    return withdrawalRepository.save(withdrawal); // ✅ Final statement
}

    @Override
    public List<Withdrawal> getUsersWithdrawalHistory(User user) {
        return withdrawalRepository.findByUserId(user.getId());
    }

    @Override
    public List<Withdrawal> getAllWithdrawalRequest() {
        return withdrawalRepository.findAll();
    }
}
