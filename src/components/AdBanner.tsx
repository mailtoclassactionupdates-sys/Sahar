import React from 'react';

const AdBanner: React.FC = () => {
  return (
    <div className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 text-center font-bold text-sm rounded-lg shadow-md my-4">
      <p>🎉 Mega Contest Live! Win ₹1 Crore Today! 🎉</p>
      <p className="text-xs font-normal mt-1">Join now and get 100% bonus usage.</p>
    </div>
  );
};

export default AdBanner;
