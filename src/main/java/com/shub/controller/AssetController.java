package com.shub.controller;

import com.shub.model.Asset;
import com.shub.model.User;
import com.shub.model.Holding;
import com.shub.response.HoldingResponse;
import com.shub.service.AssetService;
import com.shub.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/asset")
public class AssetController {

    @Autowired
    private AssetService assetService;

    @Autowired
    private UserService userService;

//    @Autowired
//    public AssetController(AssetService assetService) {
//        this.assetService = assetService;
//    }

    @GetMapping("/{assetId}")
    public ResponseEntity<Asset> getAssetById(@PathVariable Long assetId) throws Exception {
        Asset asset = assetService.getAssetById(assetId);
        return ResponseEntity.ok().body(asset);
    }

    @GetMapping("/coin/{coinId}/user")
    public ResponseEntity<Asset> getAssetByUserIdAndCoinId(
            @PathVariable String coinId,
            @RequestHeader("Authorization") String jwt
    ) throws Exception{
        User user=userService.findUserProfileByJwt(jwt);
        Asset asset=assetService.findAssetByUserIdAndCoinId(user.getId(), coinId);
        return ResponseEntity.ok().body(asset);
    }

    @GetMapping()
    public ResponseEntity<List<Asset>> getAssetForUser(
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        User user= userService.findUserProfileByJwt(jwt);
        List<Asset> assets=assetService.getUsersAssets(user.getId());
        return ResponseEntity.ok().body(assets);
    }

    @GetMapping("/holdings")
public List<HoldingResponse> getUserHoldings(Principal principal) throws Exception {
    User user = userService.findUserByEmail(principal.getName());
    return assetService.getHoldingsByUser(user);
}

}
