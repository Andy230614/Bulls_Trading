import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { useDispatch, useSelector } from 'react-redux';
import { withdrawalMoney } from '../../state/Wallet/Action';

const WithdrawalForm = () => {
  const [amount, setAmount] = React.useState('');
  const dispatch = useDispatch();
  const { wallet } = useSelector((state) => state.wallet);

  const handleChange = (e) => setAmount(e.target.value);

  const handleSubmit = () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    dispatch(withdrawalMoney(Number(amount)));
  };

  return (
    <div className="pt-10 space-y-6">
      {/* Balance Display */}
      <div className="flex justify-between items-center rounded-xl bg-slate-900 text-white text-xl font-semibold px-6 py-4 shadow">
        <p>Available Balance</p>
        <p>${wallet?.balance || '0.00'}</p>
      </div>

      {/* Withdrawal Input */}
      <div className="flex flex-col items-center space-y-3">
        <h1 className="text-xl font-semibold">Enter Withdrawal Amount</h1>
        <Input
          onChange={handleChange}
          value={amount}
          className="py-6 px-4 text-2xl text-center border rounded-lg w-full max-w-xs"
          placeholder="$2000"
          type="number"
        />
      </div>

      {/* Bank Details */}
      <div className="space-y-2">
        <p className="font-medium">Transfer to</p>
        <div className="flex items-center gap-4 border px-4 py-3 rounded-lg shadow-sm">
          <img
            className="h-6 w-6 object-contain"
            src="./src/assets/finance-7731978_1280.png"
            alt="bank"
          />
          <div>
            <p className="text-base font-semibold">YesBank</p>
            <p className="text-sm text-gray-500">***********1154</p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <DialogClose asChild>
        <Button onClick={handleSubmit} className="w-full py-6 text-lg mt-4">
          Withdraw
        </Button>
      </DialogClose>
    </div>
  );
};

export default WithdrawalForm;
