package com.shub.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Entity
@Data
public class PaymentDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotBlank(message = "Account name is required")
    private String accountNumber;

    @NotBlank(message = "Account Holder name is required")
    private String accountHolderName;

    @NotBlank(message = "IFSC code required")
    private String ifsc;

    @NotBlank(message = "Bank name is required")
    private String bankName;

    @OneToOne
//    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @JsonIgnore
    private User user;

}
