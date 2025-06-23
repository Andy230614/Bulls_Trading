import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { forgotPassword } from "../../state/TwoFactorAuth/Action";
import "./auth.css";

const ForgotPasswordForm = () => {
  const dispatch = useDispatch();
  const methods = useForm({ defaultValues: { email: "" } });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = (data) => {
    dispatch(forgotPassword(data.email));
  };

  return (
    <>
      <h3 className="text-2xl font-semibold text-white mb-6 text-center">
        Forgot Your Password?
      </h3>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
          <div>
            <FormLabel className="text-white">Email</FormLabel>
            <FormControl>
              <Input
                type="email"
                className="inputField"
                placeholder="you@example.com"
                {...register("email", { required: "Email is required" })}
              />
            </FormControl>
            {errors.email && (
              <FormMessage>{errors.email.message}</FormMessage>
            )}
          </div>

          <Button type="submit" className="loginButton">
            Send Reset Link
          </Button>
        </form>
      </FormProvider>
    </>
  );
};

export default ForgotPasswordForm;
