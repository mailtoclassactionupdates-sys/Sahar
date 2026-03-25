import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../store/AppContext';
import { BannerAd } from '../components/BannerAd';
import { toast } from 'sonner';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Deposit: React.FC = () => {
  const [amount, setAmount] = useState<number | ''>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { addTransaction, user } = useAppContext();
  const navigate = useNavigate();

  const amounts = [100, 200, 300, 500, 1000, 5000, 10000];

  const handlePayment = async () => {
    if (!amount || Number(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Create order on our server
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: Number(amount) }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const order = await response.json();

      // 2. Initialize Razorpay Checkout
      const options = {
        key: 'rzp_live_SQzbtpm71U9ew3', // Enter the Key ID generated from the Dashboard
        amount: order.amount,
        currency: order.currency,
        name: 'Dream11 Clone',
        description: 'Wallet Deposit',
        order_id: order.id,
        handler: async function (response: any) {
          // Payment successful
          try {
            await addTransaction({
              type: 'deposit',
              amount: Number(amount),
              status: 'success', // Auto-success
              description: `Deposit via Razorpay (ID: ${response.razorpay_payment_id})`
            });
            toast.success('Payment successful! Funds added to your wallet.');
            navigate('/wallet');
          } catch (error) {
            toast.error('Payment successful but failed to update wallet. Please contact support.');
          }
        },
        prefill: {
          name: user?.name || '',
          contact: user?.mobile || '',
        },
        theme: {
          color: '#16a34a', // green-600
        },
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response: any) {
        toast.error(`Payment failed: ${response.error.description}`);
      });

      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Something went wrong. Please try again later.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-900 min-h-full flex flex-col items-center justify-center">
      <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">Add Funds</h2>
        
        {/* Progress Bar */}
        <div className="flex justify-between mb-8">
          <div className="w-full h-2 rounded-full mx-1 bg-green-500"></div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Amount</label>
          <div className="grid grid-cols-3 gap-2">
            {amounts.map((amt) => (
              <button
                key={amt}
                onClick={() => setAmount(amt)}
                className={`py-2 border rounded-lg font-bold ${
                  amount === amt ? 'bg-green-100 border-green-500 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-white border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
                }`}
              >
                ₹{amt}
              </button>
            ))}
          </div>
          <input
            type="number"
            placeholder="Enter Custom Amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="mt-4 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <button
            onClick={handlePayment}
            disabled={!amount || isProcessing}
            className="w-full py-3 bg-green-600 text-white font-bold rounded-lg disabled:opacity-50 mt-6 shadow-md hover:bg-green-700 transition-colors flex justify-center items-center"
          >
            {isProcessing ? (
              <span className="animate-pulse">Processing...</span>
            ) : (
              `Pay ₹${amount || 0} via Razorpay`
            )}
          </button>
        </div>
      </div>
      <div className="mt-6">
        <BannerAd />
      </div>
    </div>
  );
};

export default Deposit;
