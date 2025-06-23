import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../../state/Auth/Action';

const ProfileForm = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    dateOfBirth: '',
    nationality: 'Indian',
    phone: '',
    address: '',
    state: '',
    pin: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        dateOfBirth: user.dateOfBirth || '',
        nationality: user.nationality || 'Indian',
        phone: user.phone || '',
        address: user.address || '',
        state: user.state || '',
        pin: user.pin || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateProfile(formData));
    if (onSuccess) onSuccess();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Profile Details</h2>

      <Input name="fullName" value={formData.fullName} placeholder="Full Name" onChange={handleChange} required />
      <Input name="email" type="email" value={formData.email} placeholder="Email" onChange={handleChange} required />
      <Input name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} required />
      <Input name="phone" value={formData.phone} placeholder="Phone Number" onChange={handleChange} required />
      <Input name="address" value={formData.address} placeholder="Address" onChange={handleChange} />
      <Input name="state" value={formData.state} placeholder="State" onChange={handleChange} />
      <Input name="pin" value={formData.pin} placeholder="PIN Code" onChange={handleChange} />

      <Button type="submit" className="w-full">
        Submit
      </Button>
    </form>
  );
};

export default ProfileForm;
