package com.shub.service;

import com.shub.config.JwtProvider;
import com.shub.domain.VerificationType;
import com.shub.model.TwoFactorAuth;
import com.shub.model.User;
import com.shub.repository.UserRepository;
import io.jsonwebtoken.ExpiredJwtException;
import com.shub.request.UpdateUserProfileRequest;
import io.jsonwebtoken.JwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public User findUserProfileByJwt(String jwt) throws Exception {
        try {
            if (jwt.startsWith("Bearer ")) {
                jwt = jwt.substring(7);
            }
            String email = jwtProvider.getEmailFromToken(jwt);
            return userRepository.findByEmail(email)
                    .orElseThrow(() -> new Exception("User not found"));
        } catch (ExpiredJwtException e) {
            throw new Exception("Token expired");
        } catch (JwtException e) {
            throw new Exception("Invalid token: " + e.getMessage());
        } catch (Exception e) {
            throw new Exception("Token processing failed: " + e.getMessage());
        }
    }

    @Override
    public User findUserByEmail(String email) throws Exception {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new Exception("User not found"));
    }

    @Override
    public User findUserById(Long userId) throws Exception {
        return userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User not found"));
    }

    @Override
    public User enableTwoFactorAuthentication(VerificationType verificationType, String sendTo, User user) {
        TwoFactorAuth twoFactorAuth = new TwoFactorAuth();
        twoFactorAuth.setEnabled(true);
        twoFactorAuth.setSendTo(verificationType);
        user.setTwoFactorAuth(twoFactorAuth);
        return userRepository.save(user);
    }

    @Override
    public User updatePassword(User user, String newPassword) {
        // Securely encode the new password
        String hashedPassword = passwordEncoder.encode(newPassword);
        user.setPassword(hashedPassword);
        return userRepository.save(user);
    }

    public boolean validateUserCredentials(String email, String rawPassword) throws Exception {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new Exception("Invalid email or password"));

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new Exception("Invalid email or password");
        }

        return true;
    }

    @Override
public User updateUserProfile(User user, UpdateUserProfileRequest req) {
    if (req.getFullName() != null) user.setFullName(req.getFullName());
    if (req.getEmail() != null) user.setEmail(req.getEmail());
    if (req.getDateOfBirth() != null) user.setDateOfBirth(req.getDateOfBirth());
    if (req.getPhone() != null) user.setPhone(req.getPhone());
    if (req.getAddress() != null) user.setAddress(req.getAddress());
    if (req.getState() != null) user.setState(req.getState());
    if (req.getPin() != null) user.setPin(req.getPin());
    if (req.getNationality() != null) user.setNationality(req.getNationality());

    return userRepository.save(user);
}

}
