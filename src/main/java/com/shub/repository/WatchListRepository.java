package com.shub.repository;

import com.shub.model.WatchList;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WatchListRepository extends JpaRepository<WatchList,Long> {

    WatchList findByUserId(Long userId);
}
