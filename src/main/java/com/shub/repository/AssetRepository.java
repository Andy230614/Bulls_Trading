package com.shub.repository;

import com.shub.model.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AssetRepository extends JpaRepository<Asset, Long> {

    Optional<Asset> findByIdAndUserId(Long assetId, Long userId);

    List<Asset> findByUserId(Long userId);

    // Fix: Proper join on nested field
    @Query("SELECT a FROM Asset a WHERE a.user.id = :userId AND a.coin.id = :coinId AND a.quantity > 0")
    Asset findAssetByUserIdAndCoinId(@Param("userId") Long userId, @Param("coinId") String coinId);


    // Optional: If you prefer derived query
    // Asset findByUserIdAndCoin_Id(Long userId, String coinId);
}
