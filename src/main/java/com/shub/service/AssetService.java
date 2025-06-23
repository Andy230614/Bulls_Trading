package com.shub.service;

import com.shub.model.Asset;
import com.shub.model.Coin;
import com.shub.model.User;
import com.shub.model.Holding;
import com.shub.response.HoldingResponse;


import java.util.List;
import java.math.BigDecimal;

public interface AssetService {

    Asset creatAsset(User user, Coin coin, BigDecimal quantity);

    Asset getAssetById(Long assetId) throws Exception;

    Asset getAssetByUserIdAndId(Long userId, Long assetId);
            
    List<Asset> getUsersAssets(Long userId);

    Asset updateAsset(Long assetId, BigDecimal quantity) throws Exception;

    Asset findAssetByUserIdAndCoinId(Long userId,String coinId);

    void deleteAsset(Long assetId);

    List<HoldingResponse> getHoldingsByUser(User user) throws Exception;


}
