package com.shub.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.shub.domain.USER_ROLE;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

@Entity
@Data
@ToString(exclude = "wallet")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String fullName;

    @Column(unique = true)
    private String email;

    private String dateOfBirth;
    private String phone;
    private String address;
    private String state;
    private String pin;
    private String nationality;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "enabled", column = @Column(name = "two_factor_enabled")),
        @AttributeOverride(name = "secret", column = @Column(name = "two_factor_secret"))
    })
    private TwoFactorAuth twoFactorAuth = new TwoFactorAuth();

    @Column(name = "user_send_to")
    private String sendTo;

    private Boolean enabled = true;

    @Column(name = "is_verified", nullable = false)
    private Boolean isVerified = false;

    private USER_ROLE role = USER_ROLE.ROLE_CUSTOMER;

    public Boolean isEnabled() {
        return this.enabled;
    }

    public boolean isTwoFactorEnabled() {
        return this.twoFactorAuth != null && this.twoFactorAuth.isEnabled();
    }

    public void setTwoFactorEnabled(boolean enabled) {
        if (this.twoFactorAuth == null) {
            this.twoFactorAuth = new TwoFactorAuth();
        }
        this.twoFactorAuth.setEnabled(enabled);
    }
}
