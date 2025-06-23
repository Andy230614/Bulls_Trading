// package: com.shub.request
package com.shub.request;

import lombok.Data;

@Data
public class UpdateUserProfileRequest {
    private String fullName;
    private String email;
    private String dateOfBirth;
    private String phone;
    private String address;
    private String state;
    private String pin;
    private String nationality;
}
