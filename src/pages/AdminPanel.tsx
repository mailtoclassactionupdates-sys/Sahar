import React, { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAppContext, Match } from '../store/AppContext';
import { Users, DollarSign, Activity, List, Settings, LogOut, ShieldAlert, FileText, Bell, Image as ImageIcon, Check, X } from 'lucide-react';

const AdminPanel: React.FC = () => {
  const { user, logout, allUsers, allTransactions, updateTransactionStatus, toggleUserStatus, editUserBalance, matches } = useAppContext();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingBalance, setEditingBalance] = useState<{mobile: string, balance: number} | null>(null);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [transactionFilter, setTransactionFilter] = useState<string>('');
  const [confirmDepositId, setConfirmDepositId] = useState<string | null>(null);
  const { addMatch, editMatch, deleteMatch, syncLiveMatches } = useAppContext();
  const prevTransactionsLength = useRef(allTransactions.length);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncMatches = async () => {
    setIsSyncing(true);
    const success = await syncLiveMatches();
    setIsSyncing(false);
    if (success) {
      toast.success('Live matches synced successfully!');
    } else {
      toast.error('Failed to sync live matches. Please check the API key or try again later.');
    }
  };

  const handleUpdateTransactionStatus = async (id: string, status: 'success' | 'failed') => {
    try {
      await updateTransactionStatus(id, status);
      toast.success(`Transaction marked as ${status}`);
    } catch (error) {
      toast.error('Failed to update transaction status');
    }
  };

  useEffect(() => {
    if (allTransactions.length > prevTransactionsLength.current) {
      const newTransactions = allTransactions.slice(0, allTransactions.length - prevTransactionsLength.current);
      
      newTransactions.forEach(t => {
        if (t.status === 'pending') {
          if (t.type === 'deposit') {
            toast.info(`New Deposit Request: ₹${t.amount} from ${t.userName}`);
          } else if (t.type === 'withdraw') {
            toast.info(`New Withdrawal Request: ₹${t.amount} from ${t.userName}`);
          }
        }
      });
    }
    prevTransactionsLength.current = allTransactions.length;
  }, [allTransactions]);

  if (!user?.isAdmin) {
    return <Navigate to="/" />;
  }

  const deposits = allTransactions.filter(t => t.type === 'deposit');
  const withdraws = allTransactions.filter(t => t.type === 'withdraw');
  
  const totalDeposit = deposits.filter(t => t.status === 'success').reduce((sum, t) => sum + t.amount, 0);
  const totalWithdraw = withdraws.filter(t => t.status === 'success').reduce((sum, t) => sum + t.amount, 0);
  const profit = totalDeposit - totalWithdraw;

  const handleLogout = () => {
    logout();
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{allUsers.length}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-300">
              <Users size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Deposits</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">₹{totalDeposit}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full text-green-600 dark:text-green-300">
              <DollarSign size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Withdraws</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">₹{totalWithdraw}</p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full text-red-600 dark:text-red-300">
              <Activity size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Profit</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">₹{profit}</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full text-purple-600 dark:text-purple-300">
              <DollarSign size={24} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const handleSaveBalance = (mobile: string) => {
    if (editingBalance) {
      editUserBalance(mobile, editingBalance.balance);
      setEditingBalance(null);
    }
  };

  const renderUsers = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">User Management</h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Name</th>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Mobile</th>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Balance</th>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Deposits</th>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Withdraws</th>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map((u, i) => (
                <tr key={i} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="p-4 text-sm text-gray-800 dark:text-gray-200">{u.name}</td>
                  <td className="p-4 text-sm text-gray-800 dark:text-gray-200">{u.mobile}</td>
                  <td className="p-4 text-sm font-medium text-green-600 dark:text-green-400">
                    {editingBalance?.mobile === u.mobile ? (
                      <div className="flex items-center space-x-2">
                        <input 
                          type="number" 
                          value={editingBalance.balance}
                          onChange={(e) => setEditingBalance({ mobile: u.mobile, balance: Number(e.target.value) })}
                          className="w-20 px-2 py-1 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        <button onClick={() => handleSaveBalance(u.mobile)} className="text-green-600 hover:text-green-800">Save</button>
                        <button onClick={() => setEditingBalance(null)} className="text-gray-500 hover:text-gray-700">Cancel</button>
                      </div>
                    ) : (
                      `₹${u.balance}`
                    )}
                  </td>
                  <td className="p-4 text-sm text-gray-800 dark:text-gray-200">₹{u.totalDeposit}</td>
                  <td className="p-4 text-sm text-gray-800 dark:text-gray-200">₹{u.totalWithdraw}</td>
                  <td className="p-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm space-x-2">
                    <button 
                      onClick={() => setEditingBalance({ mobile: u.mobile, balance: u.balance })}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => toggleUserStatus(u.mobile)}
                      className={`${u.status === 'Active' ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}
                    >
                      {u.status === 'Active' ? 'Block' : 'Unblock'}
                    </button>
                    <button 
                      onClick={() => {
                        setTransactionFilter(u.mobile);
                        setActiveTab('transactions');
                      }}
                      className="text-purple-600 hover:text-purple-800"
                    >
                      History
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderDeposits = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Deposit Requests</h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">User</th>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Amount</th>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Txn ID</th>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Date</th>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deposits.map((t, i) => (
                <tr key={i} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="p-4 text-sm text-gray-800 dark:text-gray-200">{t.userName} ({t.userId})</td>
                  <td className="p-4 text-sm font-medium text-green-600 dark:text-green-400">₹{t.amount}</td>
                  <td className="p-4 text-sm text-gray-500 font-mono">{t.id}</td>
                  <td className="p-4 text-sm text-gray-500">{new Date(t.date).toLocaleString()}</td>
                  <td className="p-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      t.status === 'success' ? 'bg-green-100 text-green-800' : 
                      t.status === 'failed' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {t.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-sm space-x-2">
                    {t.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button onClick={() => setConfirmDepositId(t.id)} className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50" title="Approve">
                          <Check size={18} />
                        </button>
                        <button onClick={() => handleUpdateTransactionStatus(t.id, 'failed')} className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50" title="Reject">
                          <X size={18} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {deposits.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">No deposit requests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderWithdraws = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Withdraw Requests</h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">User</th>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Amount</th>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Details</th>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Date</th>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {withdraws.map((t, i) => (
                <tr key={i} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="p-4 text-sm text-gray-800 dark:text-gray-200">{t.userName} ({t.userId})</td>
                  <td className="p-4 text-sm font-medium text-red-600 dark:text-red-400">₹{t.amount}</td>
                  <td className="p-4 text-sm text-gray-500">{t.description}</td>
                  <td className="p-4 text-sm text-gray-500">{new Date(t.date).toLocaleString()}</td>
                  <td className="p-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      t.status === 'success' ? 'bg-green-100 text-green-800' : 
                      t.status === 'failed' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {t.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-sm space-x-2">
                    {t.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button onClick={() => handleUpdateTransactionStatus(t.id, 'success')} className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50" title="Approve">
                          <Check size={18} />
                        </button>
                        <button onClick={() => handleUpdateTransactionStatus(t.id, 'failed')} className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50" title="Reject">
                          <X size={18} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {withdraws.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">No withdraw requests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTransactions = () => {
    const filteredTransactions = transactionFilter 
      ? allTransactions.filter(t => t.userId === transactionFilter)
      : allTransactions;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {transactionFilter ? `Transactions for ${transactionFilter}` : 'All Transactions'}
          </h2>
          {transactionFilter && (
            <button 
              onClick={() => setTransactionFilter('')}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Clear Filter
            </button>
          )}
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Txn ID</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">User</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Type</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Amount</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((t, i) => (
                  <tr key={i} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="p-4 text-sm text-gray-500 font-mono">{t.id}</td>
                    <td className="p-4 text-sm text-gray-800 dark:text-gray-200">{t.userName} ({t.userId})</td>
                    <td className="p-4 text-sm text-gray-800 dark:text-gray-200 capitalize">{t.type.replace('_', ' ')}</td>
                    <td className={`p-4 text-sm font-medium ${t.type === 'deposit' || t.type === 'bonus' || t.type === 'referral_bonus' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {t.type === 'deposit' || t.type === 'bonus' || t.type === 'referral_bonus' ? '+' : '-'}₹{t.amount}
                    </td>
                    <td className="p-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        t.status === 'success' ? 'bg-green-100 text-green-800' : 
                        t.status === 'failed' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {t.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500">{new Date(t.date).toLocaleString()}</td>
                  </tr>
                ))}
                {filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">No transactions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const handleSaveMatch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const matchData = {
      team1: formData.get('team1') as string,
      team2: formData.get('team2') as string,
      time: formData.get('time') as string,
      fee: Number(formData.get('fee')),
      spots: Number(formData.get('spots')),
      prize: Number(formData.get('prize')),
    };

    if (editingMatch) {
      editMatch(editingMatch.id, matchData);
    } else {
      addMatch(matchData);
    }
    setShowMatchModal(false);
    setEditingMatch(null);
  };

  const renderMatches = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Match Management</h2>
        <div className="flex gap-2">
          <button 
            onClick={handleSyncMatches}
            disabled={isSyncing}
            className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 ${isSyncing ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSyncing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Syncing...
              </>
            ) : (
              <>
                <Activity className="w-4 h-4" />
                Sync Live Matches
              </>
            )}
          </button>
          <button 
            onClick={() => { setEditingMatch(null); setShowMatchModal(true); }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
          >
            Add New Match
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {matches.map((match) => (
          <div key={match.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-500 dark:text-gray-400">{match.time}</span>
              <div className="space-x-2">
                <button 
                  onClick={() => { setEditingMatch(match); setShowMatchModal(true); }}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Edit
                </button>
                <button 
                  onClick={() => deleteMatch(match.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </div>
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
            <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Prize Pool</p>
                <p className="font-bold text-gray-800 dark:text-white">₹{match.prize}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Entry</p>
                <p className="font-bold text-gray-800 dark:text-white">₹{match.fee}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showMatchModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              {editingMatch ? 'Edit Match' : 'Add New Match'}
            </h3>
            <form onSubmit={handleSaveMatch} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Team 1</label>
                  <input name="team1" defaultValue={editingMatch?.team1} required className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Team 2</label>
                  <input name="team2" defaultValue={editingMatch?.team2} required className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time</label>
                <input name="time" defaultValue={editingMatch?.time} required className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fee (₹)</label>
                  <input type="number" name="fee" defaultValue={editingMatch?.fee} required className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Spots</label>
                  <input type="number" name="spots" defaultValue={editingMatch?.spots} required className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prize (₹)</label>
                  <input type="number" name="prize" defaultValue={editingMatch?.prize} required className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setShowMatchModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderPlaceholder = (title: string) => (
    <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
      <Settings size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
      <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-400">{title} Module</h2>
      <p className="text-gray-500 dark:text-gray-500 mt-2">This section is under development.</p>
    </div>
  );

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'deposits', label: 'Deposits', icon: DollarSign },
    { id: 'withdraws', label: 'Withdraws', icon: DollarSign },
    { id: 'matches', label: 'Matches', icon: List },
    { id: 'transactions', label: 'Transactions', icon: FileText },
    { id: 'fraud', label: 'Fraud Detection', icon: ShieldAlert },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'ads', label: 'Ads', icon: ImageIcon },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-500">Admin Panel</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Fantasy Cricket App</p>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id 
                      ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon size={18} className="mr-3" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
          >
            <LogOut size={18} className="mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'deposits' && renderDeposits()}
        {activeTab === 'withdraws' && renderWithdraws()}
        {activeTab === 'transactions' && renderTransactions()}
        {activeTab === 'matches' && renderMatches()}
        {['fraud', 'notifications', 'ads', 'settings'].includes(activeTab) && renderPlaceholder(tabs.find(t => t.id === activeTab)?.label || '')}
      </div>

      {/* Confirmation Modal */}
      {confirmDepositId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-sm w-full p-6 text-center">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Confirm Approval</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Are you sure you want to approve this deposit?</p>
            <div className="flex space-x-3">
              <button 
                onClick={() => setConfirmDepositId(null)} 
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  handleUpdateTransactionStatus(confirmDepositId, 'success');
                  setConfirmDepositId(null);
                }} 
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
