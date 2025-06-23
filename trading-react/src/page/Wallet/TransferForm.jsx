import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { useDispatch } from 'react-redux';
import { transferMoney } from '../../state/Wallet/Action';

const TransferForm = () => {
  const [formData, setFormData] = React.useState({
    amount: '',
    walletid: '',
    purpose: '',
  });
  const dispatch = useDispatch();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    dispatch(
      transferMoney(formData.walletid, Number(formData.amount), formData.purpose, localStorage.getItem('jwt'))
    );
  };

  return (
    <div className='pt-10 space-y-5'>
      <Input name="amount" onChange={handleChange} value={formData.amount} className="py-7" placeholder="$9999" />
      <Input name="walletid" onChange={handleChange} value={formData.walletid} className="py-7" placeholder="#ADER455" />
      <Input name="purpose" onChange={handleChange} value={formData.purpose} className="py-7" placeholder="Purpose..." />
      <DialogClose className="w-full" asChild>
        <Button onClick={handleSubmit} className="w-full py-7">Submit</Button>
      </DialogClose>
    </div>
  );
};

export default TransferForm;
