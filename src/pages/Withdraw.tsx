import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../store/AppContext';
import { BannerAd } from '../components/BannerAd';

const Withdraw: React.FC = () => {
  const { balance, withdrawLimit, withdrawalsToday, addTransaction, upgradeWithdrawLimit, incrementWithdrawalsToday } = useAppContext();
  const navigate = useNavigate();
  const [amount, setAmount] = useState<number | ''>('');
  const [method, setMethod] = useState<'bank' | 'upi' | 'paytm'>('bank');
  
  // Bank Details
  const [bankName, setBankName] = useState('');
  const [accNo, setAccNo] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [mobile, setMobile] = useState('');
  
  // UPI / Paytm
  const [upiId, setUpiId] = useState('');
  const [paytmNo, setPaytmNo] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(amount);
    
    if (amt < 100) {
      alert('Minimum withdrawal amount is ₹100');
      return;
    }
    if (amt > balance) {
      alert('Insufficient balance');
      return;
    }
    if (withdrawalsToday >= withdrawLimit) {
      alert(`Daily limit reached (${withdrawLimit}/${withdrawLimit}). Upgrade to premium for more.`);
      return;
    }

    try {
      await addTransaction({
        type: 'withdraw',
        amount: amt,
        status: 'pending',
        description: `Withdrawal via ${method.toUpperCase()}`
      });
      
      incrementWithdrawalsToday();
      
      alert('Withdrawal Request Submitted. Pending Admin Approval.');
      navigate('/wallet');
    } catch (error) {
      alert('Failed to submit withdrawal request.');
    }
  };

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-900 min-h-full pb-20">
      <BannerAd />
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 mt-4">
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-800 dark:text-white">Withdraw Funds</h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-6">Available Balance: <span className="font-bold text-gray-800 dark:text-white">₹{balance}</span></p>
        
        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg mb-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">Daily Limit: {withdrawalsToday}/{withdrawLimit}</p>
            {withdrawLimit === 3 && (
              <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">Pay ₹100 to increase limit to 5/day</p>
            )}
          </div>
          {withdrawLimit === 3 && (
            <button
              onClick={upgradeWithdrawLimit}
              className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded"
            >
              Upgrade
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount (Min ₹100)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Withdraw Method</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMethod('bank')}
                className={`py-2 border rounded-lg font-bold text-sm ${method === 'bank' ? 'bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'bg-white border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'}`}
              >
                Bank
              </button>
              <button
                type="button"
                onClick={() => setMethod('upi')}
                className={`py-2 border rounded-lg font-bold text-sm ${method === 'upi' ? 'bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'bg-white border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'}`}
              >
                UPI
              </button>
              <button
                type="button"
                onClick={() => setMethod('paytm')}
                className={`py-2 border rounded-lg font-bold text-sm ${method === 'paytm' ? 'bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'bg-white border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'}`}
              >
                Paytm
              </button>
            </div>
          </div>

          {method === 'bank' && (
            <div className="space-y-4">
              <input type="text" placeholder="Full Name" value={bankName} onChange={e => setBankName(e.target.value)} required className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              <input type="text" placeholder="Bank Account Number" value={accNo} onChange={e => setAccNo(e.target.value)} required className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              <input type="text" placeholder="IFSC Code" value={ifsc} onChange={e => setIfsc(e.target.value)} required className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              <input type="tel" placeholder="Mobile Number" value={mobile} onChange={e => setMobile(e.target.value)} required className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
          )}

          {method === 'upi' && (
            <input type="text" placeholder="UPI ID" value={upiId} onChange={e => setUpiId(e.target.value)} required className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          )}

          {method === 'paytm' && (
            <input type="tel" placeholder="Paytm Number" value={paytmNo} onChange={e => setPaytmNo(e.target.value)} required className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          )}

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors mt-6"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default Withdraw;
