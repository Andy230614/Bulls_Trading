package com.shub.controller;

import com.shub.config.JwtProvider;
import com.shub.model.PasswordResetToken;
import com.shub.model.TwoFactorOTP;
import com.shub.model.User;
import com.shub.repository.PasswordResetTokenRepository;
import com.shub.repository.UserRepository;
import com.shub.request.ResetPasswordRequest;
import com.shub.request.OtpRequest;
import com.shub.request.ForgotPasswordRequest;
import com.shub.response.AuthResponse;
import com.shub.service.CustomUserDetailsService;
import com.shub.service.EmailService;
import com.shub.service.TwoFactorOtpService;
import com.shub.service.WatchListService;
import com.shub.utils.OtpUtils;

import java.time.LocalDateTime;
import java.util.*;

import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private TwoFactorOtpService twoFactorOtpService;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private WatchListService watchListService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private JwtProvider jwtProvider;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> register(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return new ResponseEntity<>(new AuthResponse(false, "Email already registered"), HttpStatus.BAD_REQUEST);
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        watchListService.createWatchList(savedUser);

        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(savedUser.getEmail(), user.getPassword());
        SecurityContextHolder.getContext().setAuthentication(auth);

        String jwt = jwtProvider.generateToken(auth);
        return new ResponseEntity<>(new AuthResponse(true, jwt, "Registration successful"), HttpStatus.CREATED);
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> login(@RequestBody User user) {
        try {
            String email = user.getEmail();
            String password = user.getPassword();

            UsernamePasswordAuthenticationToken auth = authenticate(email, password);
            SecurityContextHolder.getContext().setAuthentication(auth);

            User dbUser = userRepository.findByEmail(email).orElseThrow(() -> new BadCredentialsException("User not found"));
            String jwt = jwtProvider.generateToken(auth);

            if (dbUser.getTwoFactorAuth() != null && dbUser.getTwoFactorAuth().isEnabled()) {
                String otp = OtpUtils.generateOtp();

                TwoFactorOTP oldOtp = twoFactorOtpService.findByUser(dbUser.getId());
                if (oldOtp != null) {
                    twoFactorOtpService.deleteTwoFactorOtp(oldOtp);
                }

                TwoFactorOTP newOtp = twoFactorOtpService.createTwoFactorOtp(dbUser, otp, jwt);

                try {
                    emailService.sendVerificationOtpEmail(email, otp);
                } catch (MessagingException e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                         .body(new AuthResponse(false, "Failed to send OTP email"));
                }

                AuthResponse res = new AuthResponse();
                res.setMessage("Two-factor authentication enabled. OTP sent to email.");
                res.setTwoFactorAuthEnabled(true);
                res.setSession(newOtp.getId());
                return new ResponseEntity<>(res, HttpStatus.ACCEPTED);
            }

            return new ResponseEntity<>(new AuthResponse(true, jwt, "Login successful"), HttpStatus.OK);

        } catch (BadCredentialsException ex) {
            return new ResponseEntity<>(new AuthResponse(false, ex.getMessage()), HttpStatus.UNAUTHORIZED);
        } catch (Exception ex) {
            return new ResponseEntity<>(new AuthResponse(false, "Login failed: " + ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtpToEmail(@RequestBody Map<String, String> body) {
        String email = body.get("email");

        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        User user = optionalUser.get();

        if (user.getTwoFactorAuth() != null && user.getTwoFactorAuth().isEnabled()) {
            String jwt = jwtProvider.generateTokenWithEmail(email);
            String otp = OtpUtils.generateOtp();

            TwoFactorOTP oldOtp = twoFactorOtpService.findByUser(user.getId());
            if (oldOtp != null) {
                twoFactorOtpService.deleteTwoFactorOtp(oldOtp);
            }

            TwoFactorOTP newOtp = twoFactorOtpService.createTwoFactorOtp(user, otp, jwt);

            try {
                emailService.sendVerificationOtpEmail(email, otp);
            } catch (MessagingException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send OTP email");
            }

            AuthResponse res = new AuthResponse();
            res.setMessage("OTP sent to email");
            res.setTwoFactorAuthEnabled(true);
            res.setSession(newOtp.getId());

            return new ResponseEntity<>(res, HttpStatus.OK);
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("2FA is not enabled for this user.");
    }

    @PostMapping("/two-factor/verify")
    public ResponseEntity<AuthResponse> verifySigninOtp(@RequestBody OtpRequest request) {
        try {
            TwoFactorOTP twoFactorOTP = twoFactorOtpService.findById(request.getSessionId());
            if (twoFactorOTP == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                     .body(new AuthResponse(false, "OTP session not found"));
            }

            if (twoFactorOtpService.verifyTwoFactorOtp(twoFactorOTP, request.getOtp())) {
                twoFactorOtpService.deleteTwoFactorOtp(twoFactorOTP);
                AuthResponse res = new AuthResponse();
                res.setMessage("Two-factor authentication verified");
                res.setTwoFactorAuthEnabled(true);
                res.setJwt(twoFactorOTP.getJwt());
                return new ResponseEntity<>(res, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(new AuthResponse(false, "Invalid or expired OTP"), HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(new AuthResponse(false, "OTP verification failed: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());
        if (optionalUser.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User user = optionalUser.get();
        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryDate(LocalDateTime.now().plusHours(1));
        tokenRepository.save(resetToken);

        String resetLink = "http://localhost:5173/reset-password?token=" + token;
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Reset Your Password");
        message.setText("Click the link to reset your password: " + resetLink);
        mailSender.send(message);

        return ResponseEntity.ok("Password reset email sent");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        PasswordResetToken token = tokenRepository.findByToken(request.getToken())
            .orElseThrow(() -> new RuntimeException("Invalid or expired token"));

        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Token expired");
        }

        User user = token.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        tokenRepository.delete(token);

        return ResponseEntity.ok("Password successfully reset");
    }

    private UsernamePasswordAuthenticationToken authenticate(String username, String password) {
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }
        return new UsernamePasswordAuthenticationToken(userDetails, password, userDetails.getAuthorities());
    }
}
