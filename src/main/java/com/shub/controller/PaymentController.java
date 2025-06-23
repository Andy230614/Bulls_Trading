package com.shub.controller;

//import com.razorpay.RazorpayException;
import com.shub.domain.PaymentMethod;
import com.shub.model.PaymentOrder;
import com.shub.model.User;
import com.shub.response.PaymentResponse;
import com.shub.service.PaymentService;
import com.shub.service.UserService;
//import com.stripe.exception.StripeException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class PaymentController {

    @Autowired
    private UserService userService;

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/api/payment/{paymentMethod}/amount/{amount}")
    public ResponseEntity<PaymentResponse> paymentHandler(
            @PathVariable PaymentMethod paymentMethod,
            @PathVariable Long amount,
            @RequestHeader("Authorization") String jwt
    ) throws Exception
//            RazorpayException,
//            StripeException
            {

        User user = userService.findUserProfileByJwt(jwt);

        PaymentResponse paymentResponse;
        PaymentOrder order = paymentService.creatOrder(user,amount,paymentMethod);

        if (paymentMethod.equals(PaymentMethod.RAZORPAY)){
            paymentResponse=paymentService.creatRazorPayPaymentLink(user,amount,order.getId());
        }
        else{
            paymentResponse=paymentService.creatStripePaymentLink(user,amount, order.getId());
        }
        return new ResponseEntity<>(paymentResponse, HttpStatus.CREATED);
    }

}
