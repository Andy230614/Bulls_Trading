import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { addPaymentDetails } from '../../state/PaymentDetails/Action';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const PaymentDetailsForm = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const { loading, error, paymentDetails } = useSelector(
    (state) => state.paymentDetails
  );
  const [didSubmit, setDidSubmit] = useState(false);

  const form = useForm({
    defaultValues: {
      accountHolderName: '',
      ifsc: '',
      accountNumber: '',
      confirmAccountNumber: '',
      bankName: ''
    }
  });

  const onSubmit = async (data) => {
    if (data.accountNumber !== data.confirmAccountNumber) {
      alert('Account numbers do not match!');
      return;
    }

    const token = localStorage.getItem('jwt');
    const payload = {
      accountHolderName: data.accountHolderName,
      accountNumber: data.accountNumber,
      ifsc: data.ifsc,
      bankName: data.bankName
    };

    await dispatch(addPaymentDetails(payload, token));
    setDidSubmit(true);
  };

  useEffect(() => {
    if (didSubmit && paymentDetails) {
      if (onSuccess) onSuccess();
      form.reset();
      setDidSubmit(false);
    }
  }, [paymentDetails, didSubmit, onSuccess, form]);

  return (
    <div className="px-10 py-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="accountHolderName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Holder Name</FormLabel>
                <FormControl>
                  <Input className="border w-full border-gray-700 p-5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ifsc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IFSC Code</FormLabel>
                <FormControl>
                  <Input className="border w-full border-gray-700 p-5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accountNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Number</FormLabel>
                <FormControl>
                  <Input type="text" className="border w-full border-gray-700 p-5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmAccountNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Account Number</FormLabel>
                <FormControl>
                  <Input type="text" className="border w-full border-gray-700 p-5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bankName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bank Name</FormLabel>
                <FormControl>
                  <Input className="border w-full border-gray-700 p-5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full py-5" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </Button>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {paymentDetails && didSubmit && (
            <p className="text-green-600 text-sm mt-2">Details submitted successfully!</p>
          )}
        </form>
      </Form>
    </div>
  );
};

export default PaymentDetailsForm;
