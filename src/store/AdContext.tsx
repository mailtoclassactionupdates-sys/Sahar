import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { X, PlayCircle } from 'lucide-react';
import { toast } from 'sonner';

interface AdContextType {
  showInterstitial: (onComplete: () => void) => void;
  showRewardAd: (onComplete: () => void) => void;
}

const AdContext = createContext<AdContextType | undefined>(undefined);

// Unity Ads Configuration
const UNITY_GAME_ID = '13469902148384';
const INTERSTITIAL_AD_ID = '6072910';
const REWARD_AD_ID = '6072911';

export const AdProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [interstitialState, setInterstitialState] = useState<{ show: boolean; onComplete?: () => void }>({ show: false });
  const [rewardState, setRewardState] = useState<{ show: boolean; onComplete?: () => void; timeLeft: number }>({ show: false, timeLeft: 5 });
  
  const isInitialized = useRef(false);
  const lastInterstitialTime = useRef(0);
  const INTERSTITIAL_COOLDOWN = 60000; // 60 seconds cooldown

  // Initialize Unity Ads (Simulation for Web / Bridge for Native)
  useEffect(() => {
    if (!isInitialized.current) {
      console.log(`[Unity Ads] Initializing with Game ID: ${UNITY_GAME_ID}`);
      
      // Simulate loading delay
      setTimeout(() => {
        console.log(`[Unity Ads] Initialized successfully.`);
        console.log(`[Unity Ads] Loaded Interstitial Ad: ${INTERSTITIAL_AD_ID}`);
        console.log(`[Unity Ads] Loaded Reward Ad: ${REWARD_AD_ID}`);
        isInitialized.current = true;
      }, 1000);
    }
  }, []);

  const showInterstitial = (onComplete: () => void) => {
    const now = Date.now();
    
    // Check cooldown to prevent showing ads too frequently
    if (now - lastInterstitialTime.current < INTERSTITIAL_COOLDOWN) {
      console.log('[Unity Ads] Interstitial ad skipped (cooldown active).');
      onComplete();
      return;
    }

    if (!isInitialized.current) {
      console.warn('[Unity Ads] Not initialized yet. Skipping ad.');
      onComplete();
      return;
    }

    console.log(`[Unity Ads] Showing Interstitial Ad: ${INTERSTITIAL_AD_ID}`);
    lastInterstitialTime.current = now;
    setInterstitialState({ show: true, onComplete });
  };

  const showRewardAd = (onComplete: () => void) => {
    if (!isInitialized.current) {
      console.warn('[Unity Ads] Not initialized yet. Skipping ad.');
      toast.error('Ad not ready yet. Please try again later.');
      return;
    }

    console.log(`[Unity Ads] Showing Reward Ad: ${REWARD_AD_ID}`);
    setRewardState({ show: true, onComplete, timeLeft: 5 });
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (rewardState.show && rewardState.timeLeft > 0) {
      interval = setInterval(() => {
        setRewardState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [rewardState.show, rewardState.timeLeft]);

  const closeInterstitial = () => {
    console.log(`[Unity Ads] Interstitial Ad closed.`);
    const { onComplete } = interstitialState;
    setInterstitialState({ show: false });
    if (onComplete) onComplete();
  };

  const closeReward = (completed: boolean) => {
    const { onComplete } = rewardState;
    setRewardState({ show: false, timeLeft: 5 });
    
    if (completed) {
      console.log(`[Unity Ads] Reward Ad completed. User earned reward.`);
      if (onComplete) onComplete();
    } else {
      console.log(`[Unity Ads] Reward Ad skipped. No reward given.`);
    }
  };

  return (
    <AdContext.Provider value={{ showInterstitial, showRewardAd }}>
      {children}
      
      {/* Interstitial Ad Modal (Fallback UI for Web) */}
      {interstitialState.show && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center">
          <button 
            onClick={closeInterstitial}
            className="absolute top-4 right-4 text-white bg-gray-800 rounded-full p-2 hover:bg-gray-700 transition-colors z-10"
          >
            <X size={24} />
          </button>
          
          <div className="w-full h-full flex flex-col items-center justify-center relative">
            <div className="absolute top-4 left-4 text-white/50 text-xs font-mono">
              Ad ID: {INTERSTITIAL_AD_ID}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Advertisement</h2>
            <div className="w-full max-w-md aspect-video bg-gray-800 rounded-lg flex items-center justify-center mb-8 shadow-2xl overflow-hidden relative">
              <video 
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" 
                autoPlay 
                loop
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              />
              <PlayCircle size={64} className="text-white relative z-10 opacity-50" />
            </div>
            <button 
              onClick={closeInterstitial}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold transition-colors shadow-lg"
            >
              Skip Ad
            </button>
          </div>
        </div>
      )}

      {/* Reward Ad Modal (Fallback UI for Web) */}
      {rewardState.show && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center">
          <div className="absolute top-4 left-4 text-white/50 text-xs font-mono z-10">
            Ad ID: {REWARD_AD_ID}
          </div>
          
          {rewardState.timeLeft <= 0 ? (
            <button 
              onClick={() => closeReward(true)}
              className="absolute top-4 right-4 text-white bg-gray-800 rounded-full p-2 hover:bg-gray-700 transition-colors z-10"
            >
              <X size={24} />
            </button>
          ) : (
            <div className="absolute top-4 right-4 text-white bg-gray-800 rounded-full px-4 py-2 font-bold z-10 flex items-center space-x-2">
              <span className="animate-pulse w-2 h-2 bg-red-500 rounded-full"></span>
              <span>Reward in {rewardState.timeLeft}s</span>
            </div>
          )}
          
          <div className="w-full h-full flex flex-col items-center justify-center relative">
            <h2 className="text-3xl font-bold text-white mb-4">Sponsored Content</h2>
            <p className="text-gray-400 mb-8">Watch this short video to earn your reward.</p>
            
            <div className="w-full max-w-md aspect-video bg-gray-800 rounded-lg flex items-center justify-center mb-8 shadow-2xl relative overflow-hidden">
              <video 
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" 
                autoPlay 
                loop
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              />
              <PlayCircle size={64} className={`text-white relative z-10 opacity-50 ${rewardState.timeLeft > 0 ? 'animate-pulse' : ''}`} />
              
              {rewardState.timeLeft > 0 && (
                <div 
                  className="absolute bottom-0 left-0 h-1.5 bg-green-500 transition-all duration-1000 ease-linear z-10"
                  style={{ width: `${((5 - rewardState.timeLeft) / 5) * 100}%` }}
                />
              )}
            </div>

            {rewardState.timeLeft <= 0 ? (
              <button 
                onClick={() => closeReward(true)}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold transition-colors shadow-lg animate-bounce"
              >
                Claim Reward
              </button>
            ) : (
              <button 
                onClick={() => closeReward(false)}
                className="px-8 py-3 bg-gray-800 text-gray-400 rounded-full font-medium hover:bg-gray-700 transition-colors"
              >
                Close Video (Lose Reward)
              </button>
            )}
          </div>
        </div>
      )}
    </AdContext.Provider>
  );
};

export const useAds = () => {
  const context = useContext(AdContext);
  if (context === undefined) {
    throw new Error('useAds must be used within an AdProvider');
  }
  return context;
};
