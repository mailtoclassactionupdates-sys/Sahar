import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../store/AppContext';
import AdBanner from '../components/AdBanner';
import { BannerAd } from '../components/BannerAd';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { matches } = useAppContext();

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-900 min-h-full">
      <BannerAd />
      <AdBanner />
      
      <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Upcoming Matches</h2>
      
      <div className="space-y-4">
        {matches.map((match) => (
          <div key={match.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-500 dark:text-gray-400">{match.time}</span>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-800">
                  {match.team1}
                </div>
                <span className="font-bold text-gray-800 dark:text-white">vs</span>
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center font-bold text-yellow-800">
                  {match.team2}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-lg mb-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Prize Pool</p>
                <p className="font-bold text-gray-800 dark:text-white">₹{match.prize}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Entry</p>
                <p className="font-bold text-gray-800 dark:text-white">₹{match.fee}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Spots</p>
                <p className="font-bold text-gray-800 dark:text-white">{match.spots}</p>
              </div>
            </div>
            
            <button
              onClick={() => navigate(`/match/${match.id}`)}
              className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors"
            >
              JOIN
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
