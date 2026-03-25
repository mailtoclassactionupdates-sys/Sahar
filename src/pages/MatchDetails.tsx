import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../store/AppContext';
import { useAds } from '../store/AdContext';
import { fetchLiveScore } from '../services/cricApi';

const MatchDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { balance, addTransaction, matches } = useAppContext();
  const { showInterstitial } = useAds();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [liveScore, setLiveScore] = useState<any>(null);

  const match = matches.find(m => m.id === id);

  useEffect(() => {
    const getScore = async () => {
      if (!id) return;
      try {
        const scoreData = await fetchLiveScore();
        if (scoreData && scoreData.data) {
          // Find the score for this specific match
          const matchScore = scoreData.data.find((s: any) => s.id === id);
          if (matchScore) {
            setLiveScore(matchScore);
          }
        }
      } catch (error) {
        console.error("Failed to fetch live score", error);
      }
    };

    getScore();
    // Refresh score every 30 seconds
    const interval = setInterval(getScore, 30000);
    return () => clearInterval(interval);
  }, [id]);

  if (!match) return <div>Match not found</div>;

  const handleJoin = () => {
    showInterstitial(() => {
      if (balance >= match.fee) {
        addTransaction({
          type: 'join_contest',
          amount: match.fee,
          status: 'success',
          description: `Joined ${match.team1} vs ${match.team2}`
        });
        setModalMessage('Congratulations! Contest Joined');
        setShowModal(true);
      } else {
        setModalMessage('Insufficient Balance. Please add funds.');
        setShowModal(true);
      }
    });
  };

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-900 min-h-full">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-center mb-2 text-gray-800 dark:text-white">
          {match.team1} vs {match.team2}
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-4">{match.time}</p>
        
        {liveScore && (
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 mb-6 text-center border border-blue-100 dark:border-blue-800">
            <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-2">Live Score</h3>
            <p className="text-lg font-semibold text-gray-800 dark:text-white">{liveScore.t1} vs {liveScore.t2}</p>
            <p className="text-md text-gray-700 dark:text-gray-300 mt-1">{liveScore.t1s} - {liveScore.t2s}</p>
            <p className="text-sm text-red-600 dark:text-red-400 mt-2 font-medium">{liveScore.status}</p>
          </div>
        )}

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
          <h3 className="font-bold text-gray-800 dark:text-white mb-4">Prize Distribution</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">1st Prize</span>
              <span className="font-bold text-green-600 dark:text-green-400">₹1500</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">2nd Prize</span>
              <span className="font-bold text-green-600 dark:text-green-400">₹1000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">3rd Prize</span>
              <span className="font-bold text-green-600 dark:text-green-400">₹500</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <span className="text-gray-600 dark:text-gray-300">Entry Fee</span>
          <span className="font-bold text-xl text-gray-800 dark:text-white">₹{match.fee}</span>
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={() => navigate(`/create-team/${match.id}`)}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
          >
            CREATE TEAM
          </button>
          <button
            onClick={handleJoin}
            className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors"
          >
            JOIN CONTEST
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-sm text-center">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Notice</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{modalMessage}</p>
            <button
              onClick={() => {
                setShowModal(false);
                if (modalMessage.includes('Congratulations')) {
                  navigate('/');
                } else {
                  navigate('/wallet');
                }
              }}
              className="w-full py-2 bg-red-600 text-white font-bold rounded-lg"
            >
              {modalMessage.includes('Congratulations') ? 'OK' : 'Go to Wallet'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchDetails;
