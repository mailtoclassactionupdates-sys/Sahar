import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../store/AppContext';
import { LogOut, Settings, Shield, Moon, Sun, Users } from 'lucide-react';
import { BannerAd } from '../components/BannerAd';

const Profile: React.FC = () => {
  const { user, logout, isDarkMode, toggleDarkMode } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-900 min-h-full pb-20">
      <BannerAd />
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 mt-4 text-center">
        <div className="w-24 h-24 bg-red-100 dark:bg-red-900 rounded-full mx-auto flex items-center justify-center mb-4">
          <span className="text-4xl font-bold text-red-600 dark:text-red-400">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{user.name}</h2>
        <p className="text-gray-500 dark:text-gray-400">{user.mobile}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          <button
            onClick={() => navigate('/referral')}
            className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Users className="w-5 h-5 text-red-500 dark:text-red-400" />
            <span className="font-medium text-gray-800 dark:text-white">Refer & Earn</span>
          </button>

          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center space-x-3">
              {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-500" />}
              <span className="font-medium text-gray-800 dark:text-white">Dark Mode</span>
            </div>
            <div className={`w-10 h-6 rounded-full flex items-center p-1 ${isDarkMode ? 'bg-green-500 justify-end' : 'bg-gray-300 justify-start'}`}>
              <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
            </div>
          </button>

          <button className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Shield className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <span className="font-medium text-gray-800 dark:text-white">Privacy Policy</span>
          </button>

          <button className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Settings className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <span className="font-medium text-gray-800 dark:text-white">Settings</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-red-600 dark:text-red-500"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
