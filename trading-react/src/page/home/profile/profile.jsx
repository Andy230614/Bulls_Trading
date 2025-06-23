import React, { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CheckCircle2 } from 'lucide-react';
import ProfileForm from './ProfileForm';
import { useSelector, useDispatch } from 'react-redux';
import { getUser, toggleTwoFactor } from '../../../state/Auth/Action';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loaded } = useSelector((state) => state.auth);
  const [openProfileForm, setOpenProfileForm] = useState(false);

  useEffect(() => {
    if (!loaded) {
      dispatch(getUser());
    }
  }, [dispatch, loaded]);

  const isTwoStepEnabled = user?.twoFactorEnabled === true;
  const isProfileIncomplete =
    !user?.fullName || !user?.email || !user?.phone || !user?.dateOfBirth;

  const VerificationIcon = () => <CheckCircle2 className="w-4 h-4 mr-1" />;

  return (
    <div className="flex flex-col items-center px-4 mb-10">
      <div className="w-full pt-10 lg:w-[60%] space-y-6">
        {isProfileIncomplete ? (
          <Card className="rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 text-center bg-white dark:bg-gray-900">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-100 mb-4">
              Your profile seems incomplete.
            </h2>
            <Dialog open={openProfileForm} onOpenChange={setOpenProfileForm}>
              <DialogTrigger asChild>
                <Button>Complete Your Profile</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Fill Your Profile</DialogTitle>
                </DialogHeader>
                <ProfileForm
                  onSuccess={() => {
                    dispatch(getUser());
                    setOpenProfileForm(false);
                  }}
                />
              </DialogContent>
            </Dialog>
          </Card>
        ) : (
          <Card className="rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                  Your Information
                </CardTitle>
                <Dialog open={openProfileForm} onOpenChange={setOpenProfileForm}>
                  <DialogTrigger asChild>
                    <Button size="sm">Update Profile</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Update Your Profile</DialogTitle>
                    </DialogHeader>
                    <ProfileForm
                      onSuccess={() => {
                        dispatch(getUser());
                        setOpenProfileForm(false);
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row justify-between gap-10">
                <div className="space-y-4">
                  <InfoRow label="Email" value={user?.email} />
                  <InfoRow label="Full Name" value={user?.fullName} />
                  <InfoRow label="Date of Birth" value={user?.dateOfBirth || 'N/A'} />
                  <InfoRow label="Nationality" value={user?.nationality || 'Indian'} />
                </div>
                <div className="space-y-4 mt-6 lg:mt-0">
                  <InfoRow label="Phone" value={user?.phone} />
                  <InfoRow label="Address" value={user?.address || 'N/A'} />
                  <InfoRow label="State" value={user?.state || 'N/A'} />
                  <InfoRow label="PIN" value={user?.pin || 'N/A'} />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ✅ Two Step Verification Card */}
        <Card className="rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <CardTitle className="dark:text-gray-100">Two Step Verification</CardTitle>
              {isTwoStepEnabled ? (
                <Badge className="bg-green-600 text-white flex items-center space-x-1">
                  <VerificationIcon />
                  <span>Enabled</span>
                </Badge>
              ) : (
                <Badge className="bg-orange-500 text-white">Disabled</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Button
              variant="default"
              onClick={() => dispatch(toggleTwoFactor())}
            >
              {isTwoStepEnabled ? 'Disable Two Step Verification' : 'Enable Two Step Verification'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex">
    <p className="w-[9rem] font-medium text-gray-700 dark:text-gray-300">{label}:</p>
    <p className="text-gray-600 dark:text-gray-400">{value || 'N/A'}</p>
  </div>
);

export default Profile;
