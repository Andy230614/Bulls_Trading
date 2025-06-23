package com.shub.controller;

import com.shub.model.PaymentDetails;
import com.shub.model.User;
import com.shub.service.PaymentDetailsService;
import com.shub.service.UserService;
import jdk.jshell.spi.ExecutionControl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class PaymentDetailsController {

    @Autowired
    private UserService userService;

    @Autowired
    private PaymentDetailsService paymentDetailsService;

    @PostMapping("/payment-details")
public ResponseEntity<PaymentDetails> addPaymentDetails(
        @Valid @RequestBody PaymentDetails paymentDetailsRequest,
        @RequestHeader("Authorization") String jwt
) throws Exception {
    User user = userService.findUserProfileByJwt(jwt);
    System.out.println("Received PaymentDetails: " + paymentDetailsRequest);
    System.out.println("User: " + user.getId());

    PaymentDetails paymentDetails = paymentDetailsService.addPaymentDetails(
            paymentDetailsRequest.getAccountNumber(),
            paymentDetailsRequest.getAccountHolderName(),
            paymentDetailsRequest.getIfsc(),
            paymentDetailsRequest.getBankName(),
            user
    );

    System.out.println("Saved PaymentDetails: " + paymentDetails);
    return new ResponseEntity<>(paymentDetails, HttpStatus.CREATED);
}


    @GetMapping("/user/payment-details")
    public ResponseEntity<PaymentDetails> getUserPaymentDetails(
            @RequestHeader("Authorization") String jwt
    ) throws Exception{
        User user = userService.findUserProfileByJwt(jwt);

        PaymentDetails paymentDetails=paymentDetailsService.getUsersPaymentDetails(user);
        return new ResponseEntity<>(paymentDetails, HttpStatus.CREATED);
    }

}
