package com.shub.service;

import com.shub.model.TwoFactorOTP;
import com.shub.model.User;
import com.shub.repository.TwoFactorOtpRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class TwoFactorOtpServiceImpl implements TwoFactorOtpService{

    @Autowired
    private TwoFactorOtpRepository twoFactorOtpRepository;

    @Override
    public TwoFactorOTP createTwoFactorOtp(User user, String otp, String jwt) {
        UUID uuid = UUID.randomUUID();

        String id=uuid.toString();

        TwoFactorOTP twoFactorOTP = new TwoFactorOTP();

        twoFactorOTP.setOtp(otp);
        twoFactorOTP.setJwt(jwt);
        twoFactorOTP.setId(id);
        twoFactorOTP.setUser(user);
        twoFactorOTP.setExpiryTime(LocalDateTime.now().plusMinutes(5)); // OTP valid for 5 minutes

        return twoFactorOtpRepository.save(twoFactorOTP);
    }

    @Override
    public TwoFactorOTP findByUser(Long userId) {
        return twoFactorOtpRepository.findByUserId(userId);
    }

    @Override
    public TwoFactorOTP findById(String Id) {
        Optional<TwoFactorOTP> opt=twoFactorOtpRepository.findById(Id);

        return opt.orElse(null);
    }

    @Override
public boolean verifyTwoFactorOtp(TwoFactorOTP twoFactorOTP, String otp) {
    return twoFactorOTP.getOtp().equals(otp) &&
           twoFactorOTP.getExpiryTime().isAfter(LocalDateTime.now());
}

    @Override
    public void deleteTwoFactorOtp(TwoFactorOTP twoFactorOTP) {

        twoFactorOtpRepository.delete(twoFactorOTP);

    }
}
