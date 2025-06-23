package com.shub.response;

import lombok.Data;
import java.math.BigDecimal;

import java.time.LocalDate;

@Data
public class TransactionResponse {
    private Long id;
    private String type;
    private LocalDate date;
    private String transferId;
    private String purpose;
    private BigDecimal amount;

    private WalletInfo wallet;

    @Data
    public static class WalletInfo {
        private Long id;
        private BigDecimal balance;
        private UserInfo user;
    }

    @Data
    public static class UserInfo {
        private Long id;
        private String fullName;
        private String email;
        private Boolean twoFactorAuth;
        private String sendTo;
        private Boolean enabled;
        private String role;
    }
}
