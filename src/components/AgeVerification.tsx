import React, { useState, useEffect } from 'react';
import { useAppContext } from '../store/AppContext';

export const AgeVerification: React.FC = () => {
  const { user, confirmAge, isAuthReady } = useAppContext();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!isAuthReady) return;

    if (user) {
      if (!user.isAdult) {
        setShowPopup(true);
      } else {
        setShowPopup(false);
      }
    } else {
      const localConfirmed = localStorage.getItem('isAdultConfirmed');
      if (!localConfirmed) {
        setShowPopup(true);
      } else {
        setShowPopup(false);
      }
    }
  }, [user, isAuthReady]);

  const handleConfirm = async () => {
    if (user) {
      await confirmAge();
    } else {
      localStorage.setItem('isAdultConfirmed', 'true');
    }
    setShowPopup(false);
  };

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center transform transition-all">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl font-bold text-red-600 dark:text-red-500">18+</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Age Verification</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          You must be 18 years or older to use this app. Please confirm your age to continue.
        </p>
        <button
          onClick={handleConfirm}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg shadow-red-600/20"
        >
          I am 18+
        </button>
      </div>
    </div>
  );
};
