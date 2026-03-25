import React, { useState, useEffect } from 'react';
import { BannerAd } from '../components/BannerAd';
import { fetchMatchPoints } from '../services/cricApi';

const Leaderboard: React.FC = () => {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLeaderboard = async () => {
      try {
        // Using the specific match ID provided by the user for demonstration
        const matchId = 'ea479cff-ddbe-48e0-9e4a-528f61a8a175';
        const pointsData = await fetchMatchPoints(matchId);
        
        if (pointsData && pointsData.data && pointsData.data.length > 0) {
          let allPlayers: any[] = [];
          pointsData.data.forEach((team: any) => {
            if (team.players) {
              allPlayers = [...allPlayers, ...team.players];
            }
          });
          
          // Sort players by points descending
          allPlayers.sort((a, b) => (b.points || 0) - (a.points || 0));
          
          // Map to leaderboard format
          const formattedLeaders = allPlayers.slice(0, 20).map((p, index) => ({
            rank: index + 1,
            name: p.name,
            points: p.points || 0,
            prize: index === 0 ? '₹10,000' : index === 1 ? '₹5,000' : index === 2 ? '₹2,500' : index < 5 ? '₹1,000' : '₹500'
          }));
          
          setLeaders(formattedLeaders);
        } else {
          // Fallback if API doesn't return data for this specific match yet
          setLeaders([
            { rank: 1, name: 'Rahul Sharma', points: 1250, prize: '₹10,000' },
            { rank: 2, name: 'Amit Kumar', points: 1120, prize: '₹5,000' },
            { rank: 3, name: 'Priya Singh', points: 1080, prize: '₹2,500' },
            { rank: 4, name: 'Vikram Patel', points: 950, prize: '₹1,000' },
            { rank: 5, name: 'Neha Gupta', points: 890, prize: '₹500' },
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard", error);
      } finally {
        setLoading(false);
      }
    };

    getLeaderboard();
  }, []);

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-900 min-h-full">
      <BannerAd />
      <h2 className="text-2xl font-bold text-center mb-6 mt-4 text-gray-800 dark:text-white">Leaderboard</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="bg-red-600 text-white p-4 flex justify-between font-bold">
          <span>Rank</span>
          <span>Player</span>
          <span>Points</span>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {loading ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading live player points...</div>
          ) : (
            leaders.map((leader) => (
              <div key={leader.rank} className="p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center space-x-4">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                    leader.rank === 1 ? 'bg-yellow-400' :
                    leader.rank === 2 ? 'bg-gray-400' :
                    leader.rank === 3 ? 'bg-yellow-600' : 'bg-blue-500'
                  }`}>
                    {leader.rank}
                  </span>
                  <div>
                    <p className="font-bold text-gray-800 dark:text-white">{leader.name}</p>
                    <p className="text-xs text-green-600 dark:text-green-400 font-semibold">{leader.prize}</p>
                  </div>
                </div>
                <span className="font-bold text-gray-800 dark:text-white">{leader.points}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
