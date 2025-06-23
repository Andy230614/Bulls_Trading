import React, { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { getPaymentDetails } from '../../state/PaymentDetails/Action';
import PaymentDetailsForm from './paymentdetailsform';

const PaymentDetails = () => {
  const dispatch = useDispatch();
  const { paymentDetails } = useSelector((state) => state.paymentDetails);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(getPaymentDetails());
  }, [dispatch]);

  const handleSuccess = () => {
    dispatch(getPaymentDetails());
    setDialogOpen(false);
  };

  return (
    <div className="px-4 sm:px-8 md:px-12 lg:px-24 py-10 max-w-4xl w-full text-left">
      <h1 className="text-3xl font-semibold tracking-tight mb-8">Payment Details</h1>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {paymentDetails ? (
          <Card className="rounded-2xl shadow-md border border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold text-gray-800">
                {paymentDetails.bankName}
              </CardTitle>
              <CardDescription className="text-gray-500 text-sm">
                A/C NO: ********{paymentDetails.accountNumber?.slice(-4)}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 py-4">
              <div className="flex items-start">
                <p className="w-32 font-medium text-gray-700">A/C Holder:</p>
                <p className="text-gray-600">{paymentDetails.accountHolderName}</p>
              </div>

              <div className="flex items-start">
                <p className="w-32 font-medium text-gray-700">IFSC:</p>
                <p className="text-gray-600">{paymentDetails.ifsc}</p>
              </div>

              <DialogTrigger asChild>
                <Button className="mt-4">Update Payment Details</Button>
              </DialogTrigger>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-6">
            <DialogTrigger asChild>
              <Button>Add Payment Details</Button>
            </DialogTrigger>
          </div>
        )}

        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>
              {paymentDetails ? 'Update Payment Details' : 'Add Payment Details'}
            </DialogTitle>
          </DialogHeader>
          <PaymentDetailsForm onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentDetails;
