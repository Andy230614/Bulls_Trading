package com.shub.service;

import com.shub.model.Coin;
import com.shub.model.User;
import com.shub.model.WatchList;

public interface WatchListService {

    WatchList findUserWatchList(Long userId) throws Exception;

    WatchList createWatchList(User user);

    WatchList findById(Long Id) throws Exception;

    Coin addItemToWatchList(Coin coin, User user) throws Exception;

}
