package com.shub.repository;

import com.shub.model.Holding;
import com.shub.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HoldingRepository extends JpaRepository<Holding, Long> {

    // Fetch all holdings for a specific user (via wallet.user)
    List<Holding> findByWallet_User(User user);

    // Optional: Fetch holding of a specific coin for a user
    Holding findByWalletUserAndCoinSymbolIgnoreCase(User user, String symbol);
}
