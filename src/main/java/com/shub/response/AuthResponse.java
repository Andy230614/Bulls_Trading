package com.shub.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private boolean status;
    private String jwt;
    private String message;
    private boolean twoFactorAuthEnabled;
    private String session;

    // Constructor for status, jwt, message
    public AuthResponse(boolean status, String jwt, String message) {
        this.status = status;
        this.jwt = jwt;
        this.message = message;
    }

    // Constructor for status, null jwt, and message (e.g., failed login)
    public AuthResponse(boolean status, String message) {
        this.status = status;
        this.message = message;
    }
}
