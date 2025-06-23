// src/components/auth/ResetPasswordForm.jsx

import React from "react";
import { useSearchParams } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import axios from "axios";
import "./auth.css";

const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const methods = useForm({
    defaultValues: {
      newPassword: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await axios.post("http://localhost:5455/auth/reset-password", {
        token,
        newPassword: data.newPassword,
      });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reset password.");
    }
  };

  if (!token) {
    return (
      <div className="text-red-600 text-center mt-10">
        Invalid or expired reset token.
      </div>
    );
  }

  return (
    <div className="authContainer">
      <div className="authCard">
        <h3 className="text-2xl font-semibold text-white mb-6 text-center">
          Reset Your Password
        </h3>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
            <div>
              <FormLabel className="text-white">New Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  className="inputField"
                  placeholder="Enter new password"
                  {...register("newPassword", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
              </FormControl>
              {errors.newPassword && (
                <FormMessage>{errors.newPassword.message}</FormMessage>
              )}
            </div>

            <Button type="submit" className="loginButton">
              Reset Password
            </Button>
          </form>
        </FormProvider>

        {isSubmitSuccessful && (
          <p className="text-green-500 text-center mt-4">
            Password updated successfully!
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordForm;
