import React, { useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import {
  Wallet as WalletIcon,
  Copy as CopyIcon,
  RefreshCw as ReloadIcon,
  Upload as UploadIcon,
  DollarSign as DollarSignIcon,
  Shuffle as ShuffleIcon,
  History as UpdateIcon,
} from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import TopUpForm from './TopUpForm';
import TransferForm from './TransferForm';
import WithdrawalForm from './WithdrawalFrom';
import { useDispatch, useSelector } from 'react-redux';
import {
  getWallet,
  getWalletTransactionHistory,
  finalizeDeposit,
} from '../../state/Wallet/Action';
import { useLocation } from 'react-router-dom';

// ...All existing imports remain unchanged...

const Wallet = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { wallet, transactions } = useSelector((state) => state.wallet);
  console.log("wallet:", wallet);
  console.log("transcations:", transactions );

  const handleFetchUserWallet = () => {
    const jwt = localStorage.getItem('jwt');
    dispatch(getWallet(jwt));
    dispatch(getWalletTransactionHistory(jwt));
  };

  useEffect(() => {
    handleFetchUserWallet();
    const query = new URLSearchParams(location.search);
    const orderId = query.get('order_id');
    const paymentId = query.get('razorpay_payment_id');

    if (orderId && paymentId) {
      dispatch(finalizeDeposit(orderId, paymentId)).then(() => {
        window.history.replaceState({}, document.title, '/wallet');
        handleFetchUserWallet();
      });
    }
  }, [location.search, dispatch]);

  return (
    <div className="flex flex-col items-center">
      <div className="pt-10 w-full px-4 lg:px-0 max-w-3xl">
        {/* Wallet Overview Card */}
        <Card className="bg-white dark:bg-zinc-900">
          <CardHeader className="pb-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4 text-zinc-700 dark:text-white">
                <WalletIcon size={30} />
                <div>
                  <CardTitle className="text-2xl">My Wallet</CardTitle>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {wallet?.id ? `#${wallet.id}` : '#----'}
                    </p>
                    <CopyIcon
                      size={15}
                      onClick={() =>
                        navigator.clipboard.writeText(wallet?.id)
                      }
                      className="cursor-pointer hover:text-zinc-400 dark:hover:text-zinc-300"
                    />
                  </div>
                </div>
              </div>
              <ReloadIcon
                onClick={handleFetchUserWallet}
                className="w-6 h-6 cursor-pointer text-zinc-500 dark:text-zinc-300 hover:text-zinc-700 dark:hover:text-white"
              />
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-2 text-2xl font-semibold text-zinc-700 dark:text-white">
              <DollarSignIcon size={24} />
              <span>{wallet?.balance != null ? wallet.balance : '000.00'}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-5 mt-7 justify-center sm:justify-start">
              {/* Top Up */}
              <Dialog>
                <DialogTrigger asChild>
                  <div className="h-24 w-24 bg-white dark:bg-zinc-800 border hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer flex flex-col items-center justify-center rounded-md shadow-md transition">
                    <UploadIcon />
                    <span className="text-sm mt-2">Add Money</span>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Top Up Your Wallet</DialogTitle>
                  </DialogHeader>
                  <TopUpForm />
                </DialogContent>
              </Dialog>

              {/* Withdrawal */}
              <Dialog>
                <DialogTrigger asChild>
                  <div className="h-24 w-24 bg-white dark:bg-zinc-800 border hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer flex flex-col items-center justify-center rounded-md shadow-md transition">
                    <UploadIcon />
                    <span className="text-sm mt-2">Withdraw</span>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Withdraw Funds</DialogTitle>
                  </DialogHeader>
                  <WithdrawalForm />
                </DialogContent>
              </Dialog>

              {/* Transfer */}
              <Dialog>
                <DialogTrigger asChild>
                  <div className="h-24 w-24 bg-white dark:bg-zinc-800 border hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer flex flex-col items-center justify-center rounded-md shadow-md transition">
                    <ShuffleIcon />
                    <span className="text-sm mt-2">Transfer</span>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Transfer to Another User</DialogTitle>
                  </DialogHeader>
                  <TransferForm />
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-zinc-700 dark:text-white flex items-center gap-2 mb-4">
            <UpdateIcon size={18} />
            Transaction History
          </h2>
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-md shadow-md space-y-4">
            {transactions
              ?.slice()
              .reverse()
              .map((tx, index) => {
                const isCredit = tx.type === 'DEPOSIT';
                const isDebit =
                  tx.type === 'WITHDRAWAL' || tx.type === 'TRANSFER';

                return (
                  <div
                    key={index}
                    className="flex justify-between border-b border-gray-200 dark:border-zinc-700 pb-2 last:border-b-0"
                  >
                    <div className="flex flex-col text-sm text-zinc-700 dark:text-white">
                      <span className="font-medium">{tx.type}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(tx.date).toLocaleString()}
                      </span>
                    </div>

                    <div
                      className={`text-sm font-semibold ${
                        isCredit
                          ? 'text-green-500'
                          : isDebit
                          ? 'text-red-500'
                          : 'text-zinc-700 dark:text-white'
                      }`}
                    >
                      {isCredit ? '+' : isDebit ? '-' : ''}
                      ${parseFloat(tx.amount).toFixed(2)}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
