package com.shub.controller;

import com.shub.request.ForgotPasswordTokenRequest;
import com.shub.domain.VerificationType;
import com.shub.model.ForgotPasswordToken;
import com.shub.model.TwoFactorAuth;
import com.shub.model.User;
import com.shub.model.VerificationCode;
import com.shub.request.ResetPasswordRequest;
import com.shub.response.ApiResponse;
import com.shub.response.AuthResponse;
import com.shub.repository.UserRepository;
import com.shub.service.EmailService;
import com.shub.service.ForgotPasswordService;
import com.shub.service.UserService;
import com.shub.service.VerificationCodeService;
import com.shub.utils.OtpUtils;
import com.shub.request.UpdateUserProfileRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private VerificationCodeService verificationCodeService;

    @Autowired
    private ForgotPasswordService forgotPasswordService;

    @GetMapping("/api/users/profile")
    public ResponseEntity<User> getUserProfile(@RequestHeader("Authorization") String jwt) throws Exception {
       User user=userService.findUserProfileByJwt(jwt);
       return new ResponseEntity<User>(user, HttpStatus.OK);
    }

    /*@PutMapping("/user/two-factor")
public ResponseEntity<?> toggleTwoFactor(@RequestBody Map<String, Object> body) {
    try {
        Long userId = Long.valueOf(body.get("userId").toString());
        boolean enable = Boolean.parseBoolean(body.get("enable").toString());

        User user = userService.findUserById(userId);
        user.setTwoFactorEnabled(enable);

        userRepository.save(user);

        return ResponseEntity.ok("Two-Factor setting updated.");
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
    }
}*/


    @PostMapping("/api/users/verification/{verificationType}/send-otp")
    public ResponseEntity<String> sendVerificationOtp(
            @RequestHeader("Authorization") String jwt,
            @PathVariable VerificationType verificationType)
            throws Exception {

        User user=userService.findUserProfileByJwt(jwt);

        VerificationCode verificationCode = verificationCodeService.getVerificationCodeByUser(user.getId());

        if (verificationCode==null){
            verificationCode=verificationCodeService.sendVerificationCode(user, verificationType);
        }

        if (verificationType.equals(VerificationType.EMAIL)){
            emailService.sendVerificationOtpEmail(user.getEmail(),verificationCode.getOtp());
        }



        return new ResponseEntity<>("verification otp sent successfully", HttpStatus.OK);
    }

    @PutMapping("/user/two-factor")
public ResponseEntity<?> toggleTwoFactor(
        @RequestHeader("Authorization") String jwt,
        @RequestBody Map<String, Object> body
) {
    try {
        if (!body.containsKey("enable")) {
            return ResponseEntity.badRequest().body("Missing 'enable' field.");
        }

        // ✅ Parse the enable value
        boolean enable = Boolean.parseBoolean(body.get("enable").toString());

        // ✅ Get user from token
        User user = userService.findUserProfileByJwt(jwt);

        // ✅ Update 2FA status
        user.setTwoFactorEnabled(enable);
        userRepository.save(user);

        // ✅ Return updated status
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Two-Factor setting updated.");
        response.put("twoFactorEnabled", enable);

        return ResponseEntity.ok(response);

    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                             .body("Error toggling 2FA: " + e.getMessage());
    }
}

    @PatchMapping("/api/users/enable-two-factor/verify-otp/{otp}")
    public ResponseEntity<User> enableTwoFactorAuthentication(
            @PathVariable String otp,
            @RequestHeader("Authorization") String jwt) throws Exception {
        User user=userService.findUserProfileByJwt(jwt);

        VerificationCode verificationCode= verificationCodeService.getVerificationCodeByUser(user.getId());
        String sendTo=verificationCode.getVerificationType().equals(VerificationType.EMAIL)?
                verificationCode.getEmail():verificationCode.getMobile();

        boolean isVerified=verificationCode.getOtp().equals(otp);

        if(isVerified){
            User updatedUser= userService.enableTwoFactorAuthentication(verificationCode.getVerificationType(),sendTo,user);
            verificationCodeService.deleteVerificationCOdeById(verificationCode);
            return new ResponseEntity<User>(user, HttpStatus.OK);
        }

        throw new Exception("wrong otp");
    }

    @PostMapping("/api/users/reset-password/send-otp")
    public ResponseEntity<AuthResponse> sendForgotPasswordOtp(
            @RequestBody ForgotPasswordTokenRequest req)
            throws Exception {

        User user= userService.findUserByEmail(req.getSendTo());
        String otp= OtpUtils.generateOtp();
        UUID uuid= UUID.randomUUID();
        String id=uuid.toString();

        ForgotPasswordToken token= forgotPasswordService.findByUser(user.getId());

        if(token==null){
            token=forgotPasswordService.createToken(user,id,otp,req.getVerificationType(), req.getSendTo());
        }

        if(req.getVerificationType().equals(VerificationType.EMAIL)){
            emailService.sendVerificationOtpEmail(user.getEmail(),token.getOtp());
        }

        AuthResponse response= new AuthResponse();
        response.setSession(token.getId());
        response.setMessage("Password reset otp sent successfully");

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/auth/user/reset-password/verify-otp")
    public ResponseEntity<ApiResponse> resetPassword(
            @RequestParam String id,
            @RequestBody ResetPasswordRequest req,
            @RequestHeader("Authorization") String jwt) throws Exception {

        ForgotPasswordToken forgotPasswordToken= forgotPasswordService.findById(id);

        boolean isVerified=forgotPasswordToken.getOtp().equals(req.getOtp());

        if(isVerified){
            userService.updatePassword(forgotPasswordToken.getUser(),req.getPassword());
            ApiResponse res = new ApiResponse();
            res.setMessage("Password update successfully");
            return new ResponseEntity<>(res,HttpStatus.ACCEPTED);
        }
        throw new Exception("wrong otp");
    }

    @PatchMapping("/api/users/profile")
public ResponseEntity<User> updateUserProfile(
        @RequestHeader("Authorization") String jwt,
        @RequestBody UpdateUserProfileRequest req
) throws Exception {
    User user = userService.findUserProfileByJwt(jwt);
    User updatedUser = userService.updateUserProfile(user, req);
    return new ResponseEntity<>(updatedUser, HttpStatus.OK);
}

}
