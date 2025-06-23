import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

import { getUserWithdrawals } from "../../state/Withdrawal/Action";
import { getPaymentDetails } from "../../state/PaymentDetails/Action"; // Make sure this path is correct

const statusMap = {
  PENDING: { label: "Pending", color: "text-yellow-600" },
  SUCCESS: { label: "Success", color: "text-green-600" },
  DECLINE: { label: "Declined", color: "text-red-600" },
};

const Withdrawal = () => {
  const dispatch = useDispatch();
  const { withdrawals, loading, error } = useSelector((state) => state.withdrawal);
  console.log("withdrawals:", withdrawals);
  const { paymentDetails = [] } = useSelector((state) => state.paymentDetails);
  console.log("paymentDetails:", paymentDetails);

  useEffect(() => {
    dispatch(getUserWithdrawals());
    dispatch(getPaymentDetails());
  }, [dispatch]);

/*const getBankName = (userId) => {
  if (!Array.isArray(paymentDetails)) return "Unknown Bank";
  const detail = paymentDetails.find(p => p.user?.id === userId);
  return detail?.bankName || "Bank";
};*/

  return (
    <div className="p-2 lg:p-5">
      <h1 className="font-bold text-3xl pb-5">Withdrawal</h1>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : withdrawals.length === 0 ? (
        <p>No withdrawal history found.</p>
      ) : (
        <Table className="border">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px] text-left">Date</TableHead>
              <TableHead className="text-left">Bank</TableHead>
              <TableHead className="text-left">Amount</TableHead>
              <TableHead className="text-left">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {withdrawals.map((item, index) => {
              const status = statusMap[item.status] || { label: item.status || "-", color: "" };
              //const bankName = getBankName(paymentDetails.user?.id);

              return (
                <TableRow key={item.id || index}>
                  <TableCell className="text-left">
                    {item.date ? new Date(item.date).toLocaleDateString() : "-"}
                  </TableCell>
                  <TableCell className="text-left">{paymentDetails.bankName || "Unknown Bank"}</TableCell>
                  <TableCell className="text-left">${Number(item.amount).toFixed(2)}</TableCell>
                  <TableCell className={`text-left font-semibold ${status.color}`}>
                    {status.label}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default Withdrawal;
