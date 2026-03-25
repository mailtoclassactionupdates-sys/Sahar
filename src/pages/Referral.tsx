import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../store/AppContext';
import { Copy, Share2, ArrowLeft, Users } from 'lucide-react';
import { toast } from 'sonner';

const Referral: React.FC = () => {
  const { user, allUsers } = useAppContext();
  const navigate = useNavigate();

  if (!user) return null;

  const currentUser = allUsers.find(u => u.mobile === user.mobile);
  const referralCode = currentUser?.referralCode || user.referralCode || 'N/A';
  const referralLink = `${window.location.origin}/signup?ref=${referralCode}`;
  
  const referrals = currentUser?.referrals || [];
  const totalEarnings = referrals.filter(r => r.status === 'Joined').reduce((sum, r) => sum + r.reward, 0);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success('Referral code copied to clipboard!');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join me on Dream11 Clone',
          text: `Use my referral code ${referralCode} to get ₹20 bonus!`,
          url: referralLink,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(referralLink);
      toast.success('Referral link copied to clipboard!');
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-full pb-20">
      <div className="bg-red-600 text-white p-4 flex items-center shadow-md sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Refer & Earn</h1>
      </div>

      <div className="p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full mx-auto flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Invite Friends & Earn</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Get ₹50 for every friend who signs up using your code. Your friend gets ₹20!
          </p>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6 border border-dashed border-gray-300 dark:border-gray-600">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Your Referral Code</p>
            <div className="flex items-center justify-center space-x-4">
              <span className="text-2xl font-bold tracking-wider text-gray-800 dark:text-white">{referralCode}</span>
              <button onClick={handleCopy} className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors">
                <Copy className="w-5 h-5" />
              </button>
            </div>
          </div>

          <button
            onClick={handleShare}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <Share2 className="w-5 h-5" />
            <span>Share Referral Link</span>
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Your Referrals</h3>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Earnings</p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">₹{totalEarnings}</p>
            </div>
          </div>

          {referrals.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>You haven't referred anyone yet.</p>
              <p className="text-sm mt-2">Share your code to start earning!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {referrals.map((referral, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">{referral.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(referral.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${referral.status === 'Joined' ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                      {referral.status}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">+₹{referral.reward}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Referral;
