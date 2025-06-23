package com.shub.service;

import com.shub.model.PaymentDetails;
import com.shub.model.User;
import com.shub.repository.PaymentDetailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PaymentDetailsServiceImpl implements PaymentDetailsService{

    @Autowired
    private PaymentDetailsRepository paymentDetailsRepository;

@Override
public PaymentDetails addPaymentDetails(String accountNumber, String accountHolder,
                                        String ifsc, String bankName, User user) {
    PaymentDetails existing = paymentDetailsRepository.findByUserId(user.getId());
    if (existing != null) {
        // Update instead of insert
        existing.setAccountNumber(accountNumber);
        existing.setAccountHolderName(accountHolder);
        existing.setIfsc(ifsc);
        existing.setBankName(bankName);
        return paymentDetailsRepository.save(existing);
    }

    // Otherwise create new
    PaymentDetails paymentDetails = new PaymentDetails();
    paymentDetails.setAccountNumber(accountNumber);
    paymentDetails.setAccountHolderName(accountHolder);
    paymentDetails.setIfsc(ifsc);
    paymentDetails.setBankName(bankName);
    paymentDetails.setUser(user);
    return paymentDetailsRepository.save(paymentDetails);
}


    @Override
    public PaymentDetails getUsersPaymentDetails(User user) {
        return paymentDetailsRepository.findByUserId(user.getId());
    }
}
