import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import AccountVerificationForm from "../home/profile/AccountVerificationForm";
import "./auth.css";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [twoFactorSession, setTwoFactorSession] = useState(null);
  const [twoFactorEmail, setTwoFactorEmail] = useState(null);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("http://localhost:5455/auth/signin", data);

      if (res.data.twoFactorAuthEnabled) {
        setTwoFactorSession(res.data.session);
        setTwoFactorEmail(data.email);
      } else {
        localStorage.setItem("jwt", res.data.jwt);
        navigate("/");
      }
    } catch (err) {
      console.error("Login failed:", err.response?.data?.message || err.message);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  const handleVerified = () => {
    navigate("/");
  };

  if (twoFactorSession && twoFactorEmail) {
    return (
      <AccountVerificationForm
        email={twoFactorEmail}
        handleSubmit={handleVerified}
      />
    );
  }

  return (
    <>
      <h3 className="text-2xl font-semibold text-white mb-6 text-center">
        Sign In to Your Account
      </h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 w-full">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="you@example.com" className="inputField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="••••••••"
                    className="inputField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="loginButton">
            Sign In
          </Button>
        </form>
      </Form>
    </>
  );
};

export default SignIn;
