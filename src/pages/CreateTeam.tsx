import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../store/AppContext';
import { fetchMatchInfo, fetchMatchPoints } from '../services/cricApi';

type Player = {
  id: string;
  name: string;
  role: string;
  credits: number;
  team: string;
  points?: number;
};

const CreateTeam: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { matches } = useAppContext();
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  const match = matches.find(m => m.id === id);

  useEffect(() => {
    const loadPlayers = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // Try getting players from match_points first (most reliable for players if match has started)
        const pointsData = await fetchMatchPoints(id);
        let loadedPlayers: Player[] = [];
        
        if (pointsData && pointsData.data && pointsData.data.length > 0) {
          pointsData.data.forEach((team: any) => {
            if (team.players) {
              team.players.forEach((p: any) => {
                loadedPlayers.push({
                  id: p.id || Math.random().toString(),
                  name: p.name,
                  role: p.role || 'Player',
                  credits: 8.5, // Default credit
                  team: team.teamName,
                  points: p.points || 0
                });
              });
            }
          });
        }
        
        // If no players found in match_points, try match_info
        if (loadedPlayers.length === 0) {
          const infoData = await fetchMatchInfo(id);
          if (infoData && infoData.data && infoData.data.players) {
            // Sometimes players is an array of objects or strings
            loadedPlayers = infoData.data.players.map((p: any, index: number) => {
              const name = typeof p === 'string' ? p : p.name;
              return {
                id: (typeof p === 'string' ? index.toString() : p.id) || index.toString(),
                name: name,
                role: 'Player',
                credits: 8.5,
                team: 'Unknown'
              };
            });
          }
        }

        // Fallback if API fails or returns empty
        if (loadedPlayers.length === 0) {
          loadedPlayers = Array.from({ length: 22 }, (_, i) => ({
            id: (i + 1).toString(),
            name: `Player ${i + 1}`,
            role: i < 5 ? 'BAT' : i < 10 ? 'BOWL' : i < 15 ? 'AR' : 'WK',
            credits: 8 + Math.floor(Math.random() * 3),
            team: i < 11 ? (match?.team1 || 'Team 1') : (match?.team2 || 'Team 2')
          }));
        }

        setPlayers(loadedPlayers);
      } catch (error) {
        console.error("Failed to load players", error);
      } finally {
        setLoading(false);
      }
    };

    loadPlayers();
  }, [id, match]);

  if (!match) return <div>Match not found</div>;

  const togglePlayer = (playerId: string) => {
    if (selectedPlayers.includes(playerId)) {
      setSelectedPlayers(selectedPlayers.filter(id => id !== playerId));
    } else {
      if (selectedPlayers.length < 11) {
        setSelectedPlayers([...selectedPlayers, playerId]);
      } else {
        alert('You can only select 11 players');
      }
    }
  };

  const handleCreateTeam = () => {
    if (selectedPlayers.length === 11) {
      setShowModal(true);
    } else {
      alert(`Please select 11 players. You have selected ${selectedPlayers.length}.`);
    }
  };

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-900 min-h-full pb-24">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-4 sticky top-0 z-10">
        <h2 className="text-lg font-bold text-center text-gray-800 dark:text-white">
          {match.team1} vs {match.team2}
        </h2>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">{match.time}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="font-bold text-gray-800 dark:text-white">Players: {selectedPlayers.length}/11</span>
          <button
            onClick={handleCreateTeam}
            className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg disabled:opacity-50"
            disabled={selectedPlayers.length !== 11}
          >
            CREATE TEAM
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {loading ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">Loading real players...</div>
        ) : (
          players.map(player => (
            <div
              key={player.id}
              onClick={() => togglePlayer(player.id)}
              className={`p-3 rounded-lg flex justify-between items-center cursor-pointer transition-colors ${
                selectedPlayers.includes(player.id)
                  ? 'bg-green-100 dark:bg-green-900 border-2 border-green-500'
                  : 'bg-white dark:bg-gray-800 border-2 border-transparent'
              }`}
            >
              <div>
                <p className="font-bold text-gray-800 dark:text-white">{player.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{player.team} • {player.role}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-800 dark:text-white">{player.credits} Cr</p>
                {player.points !== undefined && (
                  <p className="text-xs text-blue-600 dark:text-blue-400">{player.points} pts</p>
                )}
                {selectedPlayers.includes(player.id) && (
                  <span className="text-xs text-green-600 dark:text-green-400 font-bold">Selected</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-sm text-center">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Success!</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-2">Congratulations! Your Team Created Successfully</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Match Time: {match.time}</p>
            <button
              onClick={() => {
                setShowModal(false);
                navigate(`/match/${match.id}`);
              }}
              className="w-full py-2 bg-green-600 text-white font-bold rounded-lg"
            >
              Go to Match
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateTeam;
