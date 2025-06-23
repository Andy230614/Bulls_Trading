package com.shub.request;

import lombok.Data;

@Data
public class ResetPasswordRequest {

    private String token;
    private String otp;
    private String password;
    private String newPassword;
}
