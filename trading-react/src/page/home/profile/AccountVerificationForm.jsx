import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { sendOtp, verifyOtp } from '../../../state/TwoFactorAuth/Action';

const AccountVerificationForm = ({ email = "test@example.com", handleSubmit: onVerified }) => {
  const dispatch = useDispatch();
  const [otpValue, setOtpValue] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const { loading, success, error, session, jwt, message } = useSelector((state) => state.otp);

  const handleSendOtp = () => {
    dispatch(sendOtp({ email }));
    setOtpSent(true);
  };

  const handleSubmit = () => {
    if (!session) {
      alert('No OTP session found. Please resend OTP.');
      return;
    }
    dispatch(verifyOtp(otpValue, session));
  };

  const handleDialogClose = () => {
    setOtpValue('');
    setOtpSent(false);
  };

  useEffect(() => {
  if (success && jwt && onVerified) {
    localStorage.setItem("jwt", jwt); // store final JWT after OTP
    onVerified(); // Notify parent
  }
}, [success, jwt, onVerified]);


  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md mt-10 space-y-6">
        <div className="flex justify-between items-center bg-gray-50 p-5 rounded-xl shadow-md">
          <div>
            <p className="text-sm font-medium text-gray-700">Email</p>
            <p className="text-gray-600">{email}</p>
          </div>

          <Dialog onOpenChange={(open) => !open && handleDialogClose()}>
            <DialogTrigger asChild>
              <Button variant="default" onClick={handleSendOtp}>
                {otpSent ? "Resend OTP" : "Send OTP"}
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Enter OTP</DialogTitle>
              </DialogHeader>

              <div className="py-6 flex flex-col gap-6 items-center">
                <InputOTP
                  value={otpValue}
                  onChange={(val) => setOtpValue(val)}
                  maxLength={6}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>

                {error && <p className="text-red-500 text-sm">{error}</p>}
                {success && jwt && <p className="text-green-600 text-sm">Verified successfully!</p>}

                <DialogClose asChild>
                  <Button
                    className="w-full"
                    disabled={loading || otpValue.length !== 6}
                    onClick={handleSubmit}
                  >
                    {loading ? 'Verifying...' : 'Submit'}
                  </Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default AccountVerificationForm;
