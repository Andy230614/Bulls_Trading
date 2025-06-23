package com.shub.controller;

import com.shub.model.Coin;
import com.shub.model.User;
import com.shub.model.WatchList;
import com.shub.service.CoinService;
import com.shub.service.UserService;
import com.shub.service.WatchListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/watchlist")
public class WatchListController {

    @Autowired
    private WatchListService watchListService;

    @Autowired
    private UserService userService;

    @Autowired
    private CoinService coinService;

    @GetMapping("/user")
    public ResponseEntity<WatchList> getUserWatchList(
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        User user=userService.findUserProfileByJwt(jwt);
        WatchList watchList=watchListService.findUserWatchList(user.getId());
        return ResponseEntity.ok(watchList);
    }

//    @PostMapping("/create")
//    public ResponseEntity<WatchList> createWatchList(
//            @RequestHeader("Authorization") String jwt
//    ) throws Exception {
//        User user=userService.findUserProfileByJwt(jwt);
//        WatchList createdWatchList=watchListService.createWatchList(user);
//        return ResponseEntity.status(HttpStatus.CREATED).body(createdWatchList);
//    }

    @GetMapping("/{watchlistId}")
    public ResponseEntity<WatchList> getWatchList(
            @PathVariable Long watchlistId
    ) throws Exception {
        WatchList watchList=watchListService.findUserWatchList(watchlistId);
        return ResponseEntity.ok(watchList);
    }

    @PatchMapping("/add/coin/{coinId}")
    public ResponseEntity<Coin> addItemToWatchList(
            @RequestHeader("Authorization") String jwt,
            @PathVariable String coinId
    ) throws Exception {
        User user=userService.findUserProfileByJwt(jwt);
        Coin coin =coinService.findById(coinId);
        Coin addCoin = watchListService.addItemToWatchList(coin, user);
        return ResponseEntity.ok(addCoin);
    }
}
