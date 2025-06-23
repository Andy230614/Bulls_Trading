package com.shub.service;

import com.shub.domain.VerificationType;
import com.shub.model.User;
import com.shub.model.VerificationCode;

public interface VerificationCodeService {

    VerificationCode sendVerificationCode(User user, VerificationType verificationType);

    VerificationCode getVerificationCodeById(Long id) throws Exception;

    VerificationCode getVerificationCodeByUser(Long userId);

    void deleteVerificationCOdeById(VerificationCode verificationCode);
}
