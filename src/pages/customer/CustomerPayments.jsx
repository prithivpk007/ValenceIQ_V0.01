import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { PageHeader } from "../../components/layout/PageHeader";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { paymentService } from "../../services/paymentService";
import { CreditCard, CheckCircle2 } from "lucide-react";

export const CustomerPayments = () => {
  const { user } = useAuth();
  const customerId = user?.customerId || "cust_1";
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      const res = await paymentService.getAll({ customerId });
      setPayments(res.data);
    };
    fetchPayments();
  }, [customerId]);

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val || 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment History & Receipts"
        description="Historical log of all electronic transactions, card settlements, and banking reconciliations."
      />

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="p-3.5 pl-5">Receipt Ref</th>
                <th className="p-3.5">Invoice #</th>
                <th className="p-3.5">Payment Method</th>
                <th className="p-3.5">Transaction ID</th>
                <th className="p-3.5">Settlement Date</th>
                <th className="p-3.5">Amount Paid</th>
                <th className="p-3.5 pr-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 pl-5 font-semibold text-slate-900">{p.paymentNumber}</td>
                  <td className="p-3.5 font-medium text-blue-700">{p.invoiceNumber}</td>
                  <td className="p-3.5">{p.paymentMethod}</td>
                  <td className="p-3.5 font-mono text-2xs text-slate-500">{p.reference}</td>
                  <td className="p-3.5 text-slate-500">{p.paymentDate}</td>
                  <td className="p-3.5 font-bold text-slate-900">{formatCurrency(p.amount)}</td>
                  <td className="p-3.5 pr-5">
                    <Badge status={p.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
