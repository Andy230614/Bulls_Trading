package com.shub.request;

import lombok.Data;

@Data
public class TwoFactorToggleRequest {
    private Long userId;
    private boolean enabled;
}
