import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../store/AppContext';
import { useAds } from '../store/AdContext';
import AdBanner from '../components/AdBanner';
import { BannerAd } from '../components/BannerAd';
import { PlayCircle } from 'lucide-react';

const Wallet: React.FC = () => {
  const { balance, transactions, addTransaction } = useAppContext();
  const navigate = useNavigate();
  const { showRewardAd } = useAds();

  const handleWatchAndEarn = () => {
    showRewardAd(() => {
      addTransaction({
        type: 'bonus',
        amount: 1,
        status: 'success',
        description: 'Watch & Earn Reward'
      });
    });
  };

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-900 min-h-full pb-20">
      <BannerAd />
      <AdBanner />
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 text-center">
        <h2 className="text-gray-500 dark:text-gray-400 mb-2">Total Balance</h2>
        <p className="text-4xl font-bold text-gray-800 dark:text-white mb-6">₹{balance}</p>
        
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => navigate('/deposit')}
            className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors"
          >
            ADD FUNDS
          </button>
          <button
            onClick={() => navigate('/withdraw')}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
          >
            WITHDRAW
          </button>
        </div>

        <button
          onClick={handleWatchAndEarn}
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <PlayCircle size={20} />
          <span>Watch & Earn ₹1</span>
        </button>
      </div>

      <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Recent Transactions</h3>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        {transactions.length === 0 ? (
          <p className="text-center p-6 text-gray-500 dark:text-gray-400">No transactions yet.</p>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {transactions.map((tx) => (
              <div key={tx.id} className="p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div>
                  <p className="font-bold text-gray-800 dark:text-white">{tx.description}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(tx.date).toLocaleDateString()}</p>
                  {tx.status === 'pending' && (
                    <span className="text-xs text-yellow-600 dark:text-yellow-400 font-bold">Pending Approval</span>
                  )}
                </div>
                <div className="text-right">
                  <p className={`font-bold ${
                    tx.type === 'deposit' || tx.type === 'bonus' || tx.type === 'referral_bonus' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {tx.type === 'deposit' || tx.type === 'bonus' || tx.type === 'referral_bonus' ? '+' : '-'}₹{tx.amount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;
