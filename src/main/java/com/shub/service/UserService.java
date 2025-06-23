package com.shub.service;

import com.shub.domain.VerificationType;
import com.shub.request.UpdateUserProfileRequest;
import com.shub.model.User;

public interface UserService {

    public User findUserProfileByJwt(String jwt) throws Exception;
    public User findUserByEmail(String email) throws Exception;
    public User findUserById(Long UserId) throws Exception;

    public User enableTwoFactorAuthentication(
            VerificationType verificationType,
            String sendTo,
            User user);

    User updatePassword(User user,String newPassword);

    User updateUserProfile(User user, UpdateUserProfileRequest req);

}