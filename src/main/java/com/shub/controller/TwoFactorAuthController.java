package com.shub.controller;

import com.shub.model.User;
import com.shub.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/2fa")
@RequiredArgsConstructor
public class TwoFactorAuthController {

    private final UserRepository userRepository;

    @PostMapping("/toggle")
    public ResponseEntity<?> toggleTwoFactor(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.badRequest().body("User not authenticated.");
        }

        User user = userRepository.findByEmail(userDetails.getUsername()).orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest().body("User not found.");
        }

        user.setTwoFactorEnabled(!user.isTwoFactorEnabled());
        userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Two-Factor Authentication " + (user.isTwoFactorEnabled() ? "enabled" : "disabled"));
        response.put("twoFactorEnabled", user.isTwoFactorEnabled());

        return ResponseEntity.ok(response);
    }
}
