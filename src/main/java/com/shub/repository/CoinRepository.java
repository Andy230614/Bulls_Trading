package com.shub.repository;

import com.shub.model.Coin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CoinRepository  extends JpaRepository<Coin, String> {
}
