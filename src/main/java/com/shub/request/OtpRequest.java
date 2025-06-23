package com.shub.request;

import lombok.Data;

@Data
public class OtpRequest {
    private String otp;
    private String sessionId; // corresponds to the OTP ID from your 2FA
}
