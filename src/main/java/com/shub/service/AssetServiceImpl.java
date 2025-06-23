    package com.shub.service;

    import com.shub.model.Asset;
    import com.shub.model.Coin;
    import com.shub.model.User;
    import com.shub.response.HoldingResponse;
    import com.shub.repository.AssetRepository;
    import com.shub.repository.HoldingRepository;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.stereotype.Service;

    import java.math.BigDecimal;
    import java.math.RoundingMode;
    import java.util.ArrayList;
    import java.util.List;

    @Service
    public class AssetServiceImpl implements AssetService {

        @Autowired
        private AssetRepository assetRepository;

        @Autowired
        private HoldingRepository holdingRepository;

        @Override
        public Asset creatAsset(User user, Coin coin, BigDecimal quantity) {
            Asset asset = new Asset();
            asset.setUser(user);
            asset.setCoin(coin);
            asset.setQuantity(quantity.setScale(8, RoundingMode.DOWN));
            asset.setBuyPrice(coin.getCurrentPrice());
            return assetRepository.save(asset);
        }

        @Override
        public Asset getAssetById(Long assetId) throws Exception {
            return assetRepository.findById(assetId)
                    .orElseThrow(() -> new Exception("Asset not found"));
        }

        @Override
        public Asset getAssetByUserIdAndId(Long userId, Long assetId) {
            return assetRepository.findByIdAndUserId(assetId, userId)
                    .orElse(null);
        }

        @Override
        public List<Asset> getUsersAssets(Long userId) {
            return assetRepository.findByUserId(userId);
        }

        @Override
        public Asset updateAsset(Long assetId, BigDecimal deltaQuantity) throws Exception {
            Asset asset = getAssetById(assetId);
            BigDecimal updatedQuantity = asset.getQuantity().add(deltaQuantity).setScale(8, RoundingMode.DOWN);

            if (updatedQuantity.compareTo(BigDecimal.ZERO) < 0) {
                throw new IllegalArgumentException("Asset quantity cannot be negative");
            }

            asset.setQuantity(updatedQuantity);
            return assetRepository.save(asset);
        }

        @Override
public Asset findAssetByUserIdAndCoinId(Long userId, String coinId) {
    System.out.println(">>> Finding asset for userId=" + userId + ", coinId=" + coinId);
    Asset asset = assetRepository.findAssetByUserIdAndCoinId(userId, coinId);
    System.out.println(">>> Asset found: " + asset);
    return asset;
}


        @Override
        public void deleteAsset(Long assetId) {
            assetRepository.deleteById(assetId);
        }

        @Override
        public List<HoldingResponse> getHoldingsByUser(User user) throws Exception {
            List<Asset> assets = assetRepository.findByUserId(user.getId());
            List<HoldingResponse> holdingResponses = new ArrayList<>();

            for (Asset asset : assets) {
                if (asset.getQuantity() != null && asset.getQuantity().compareTo(BigDecimal.ZERO) > 0) {
                    HoldingResponse hr = new HoldingResponse();
                    hr.setId(asset.getId());

                    Coin coin = asset.getCoin();
                    hr.setSymbol(coin.getSymbol());
                    hr.setName(coin.getName());
                    hr.setImage(coin.getImage());
                    hr.setQuantity(asset.getQuantity());

                    BigDecimal currentPrice = coin.getCurrentPrice();
                    BigDecimal value = currentPrice.multiply(asset.getQuantity()).setScale(2, RoundingMode.HALF_UP);
                    hr.setValue(value);

                    holdingResponses.add(hr);
                }
            }

            holdingResponses.sort((a, b) -> b.getValue().compareTo(a.getValue()));
            return holdingResponses;
        }
    }
