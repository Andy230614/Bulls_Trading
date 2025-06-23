package com.shub.service;

import com.razorpay.RazorpayException;
import com.shub.domain.PaymentMethod;
import com.shub.model.PaymentOrder;
import com.shub.model.User;
import com.shub.response.PaymentResponse;
import com.stripe.exception.StripeException;

public interface PaymentService {

    PaymentOrder creatOrder(User user, Long amount, PaymentMethod paymentMethod);

    PaymentOrder getPaymentOrderById(Long id) throws Exception;

    PaymentOrder getPaymentOrderByRazorpayOrderId(String razorpayOrderId) throws Exception;

    Boolean proceedPaymentOrder(PaymentOrder paymentOrder, String paymentId) throws RazorpayException;

    PaymentResponse creatRazorPayPaymentLink(User user, Long amount, Long orderId) throws Exception;

    PaymentResponse creatStripePaymentLink(User user, Long amount, Long orderId) throws StripeException;

}
