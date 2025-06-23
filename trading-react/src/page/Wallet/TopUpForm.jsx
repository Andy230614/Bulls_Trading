import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import api from "../../config/api";

const TopUpForm = () => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('RAZORPAY');
  const [loading, setLoading] = useState(false);

  const initiateTopUp = async (amount, method = 'RAZORPAY') => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      throw new Error('Invalid amount');
    }

    const token = localStorage.getItem('jwt');

    const response = await api.post(
      `/api/payment/${method}/amount/${amount}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.data.payment_url) {
      throw new Error('No payment URL received from server.');
    }

    return response.data.payment_url;
  };

  const handleTopUp = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    setLoading(true);
    try {
      const url = await initiateTopUp(amount, paymentMethod);
      window.location.href = url;
    } catch (error) {
      console.error('Top-up failed:', error);
      alert(error.message || 'Top-up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-6 space-y-6">
      <div>
        <label className="block pb-1 font-medium">Enter Amount</label>
        <Input
          type="number"
          onChange={(e) => setAmount(e.target.value)}
          value={amount}
          className="py-6 text-lg"
          placeholder="$99999"
        />
      </div>

      <div>
        <label className="block pb-1 font-medium">Select Payment Method</label>
        <RadioGroup onValueChange={setPaymentMethod} value={paymentMethod} className="flex gap-4">
          <RadioGroupItem value="RAZORPAY" id="razorpay" className="peer sr-only" />
          <label htmlFor="razorpay" className="flex items-center gap-2 cursor-pointer w-full">
            <div className="relative w-5 h-5 border border-gray-400 rounded-full peer-checked:border-blue-500">
              <div className="absolute inset-1 rounded-full bg-blue-500 scale-0 peer-checked:scale-100 transition" />
            </div>
            <img src="https://d6xcmfyh68wv8.cloudfront.net/assets/razorpay-logo.svg" alt="Razorpay" className="h-6" />
          </label>

          <RadioGroupItem value="STRIPE" id="stripe" className="peer sr-only" />
          <label htmlFor="stripe" className="flex items-center gap-2 cursor-pointer w-full">
            <div className="relative w-5 h-5 border border-gray-400 rounded-full peer-checked:border-blue-500">
              <div className="absolute inset-1 rounded-full bg-blue-500 scale-0 peer-checked:scale-100 transition" />
            </div>
            <img src="/assets/stripe-logo.png" alt="Stripe" className="h-6" />
          </label>
        </RadioGroup>
      </div>

      <Button onClick={handleTopUp} className="w-full py-7" disabled={loading}>
        {loading ? 'Processing...' : 'Submit'}
      </Button>
    </div>
  );
};

export default TopUpForm;
