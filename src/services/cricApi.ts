const API_KEY = 'c45d162c-d61c-4f9e-86c9-e93ebf90482a';
const BASE_URL = 'https://api.cricapi.com/v1';

export const fetchCurrentMatches = async () => {
  try {
    const res = await fetch(`${BASE_URL}/currentMatches?apikey=${API_KEY}&offset=0`);
    return await res.json();
  } catch (error) {
    console.error('Error fetching current matches:', error);
    return null;
  }
};

export const fetchMatchInfo = async (id: string) => {
  try {
    const res = await fetch(`${BASE_URL}/match_info?apikey=${API_KEY}&id=${id}`);
    return await res.json();
  } catch (error) {
    console.error('Error fetching match info:', error);
    return null;
  }
};

export const fetchLiveScore = async () => {
  try {
    const res = await fetch(`${BASE_URL}/cricScore?apikey=${API_KEY}`);
    return await res.json();
  } catch (error) {
    console.error('Error fetching live score:', error);
    return null;
  }
};

export const fetchMatchPoints = async (id: string) => {
  try {
    const res = await fetch(`${BASE_URL}/match_points?apikey=${API_KEY}&id=${id}&ruleset=0`);
    return await res.json();
  } catch (error) {
    console.error('Error fetching match points:', error);
    return null;
  }
};
