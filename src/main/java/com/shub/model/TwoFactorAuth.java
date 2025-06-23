package com.shub.model;

import com.shub.domain.VerificationType;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;

@Data
@Embeddable
public class TwoFactorAuth {

    private boolean enabled = false;

    private String secret; // Optional for future TOTP support

    @Enumerated(EnumType.STRING)
    private VerificationType sendTo;  // Add this field
}
