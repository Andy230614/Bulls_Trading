package com.shub.controller;

import com.shub.model.Wallet;
import com.shub.model.Holding;
import com.shub.response.WalletResponse;

import java.util.List;
import java.util.stream.Collectors;

public class WalletMapper {

    public static WalletResponse mapToWalletResponse(Wallet wallet) {
        WalletResponse response = new WalletResponse();
        response.setId(wallet.getId());
        response.setBalance(wallet.getBalance());

        List<WalletResponse.HoldingResponse> holdingResponses = wallet.getHoldings()
            .stream()
            .map(h -> {
                WalletResponse.HoldingResponse hr = new WalletResponse.HoldingResponse();
                hr.setCoinId(h.getCoin().getId().toString()); // String type
                hr.setCoinSymbol(h.getCoin().getSymbol());
                hr.setQuantity(h.getQuantity()); // ✅ critical
                return hr;
            })
            .collect(Collectors.toList());

        response.setHoldings(holdingResponses);
        return response;
    }
}
