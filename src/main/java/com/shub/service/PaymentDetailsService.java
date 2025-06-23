package com.shub.service;

import com.shub.model.PaymentDetails;
import com.shub.model.User;

public interface PaymentDetailsService {

    public PaymentDetails addPaymentDetails(String accountNumber, String accountHolder,
                                            String ifsc, String bankName,
                                            User user);

    public PaymentDetails getUsersPaymentDetails(User user);
}
