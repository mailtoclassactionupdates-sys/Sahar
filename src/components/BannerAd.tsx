import React from 'react';

export const BannerAd: React.FC = () => {
  return (
    <div className="w-full h-[50px] bg-gray-100 dark:bg-gray-800 flex items-center justify-center border-y border-gray-200 dark:border-gray-700 my-2 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Advertisement (Start.io)</span>
    </div>
  );
};
