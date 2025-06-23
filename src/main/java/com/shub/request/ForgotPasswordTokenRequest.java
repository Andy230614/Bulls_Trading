package com.shub.request;

import lombok.Data;
import com.shub.domain.VerificationType;

@Data
public class ForgotPasswordTokenRequest {
    private String sendTo;
    private VerificationType verificationType;
    private String token;
}
