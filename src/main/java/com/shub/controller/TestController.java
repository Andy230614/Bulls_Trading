package com.shub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/test")
public class TestController {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/verify-password")
    public String verifyPasswordGet(@RequestParam String raw, @RequestParam String hashed) {
        boolean matches = passwordEncoder.matches(raw, hashed);
        return matches ? "✅ Password matches!" : "❌ Password does not match!";
    }
}
