package com.shub.exception;

public class InsufficientBalanceException extends RuntimeException {

    public InsufficientBalanceException() {
        super("Insufficient balance to complete the transaction.");
    }

    public InsufficientBalanceException(String message) {
        super(message);
    }
}
