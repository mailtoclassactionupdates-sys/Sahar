const https = require('https');

const key = 'e2fb9007613e95b50de2e7e86b094c080bb4f57e6227f65e33ab064133ab17e4';

const urls = [
  `https://api.cricapi.com/v1/currentMatches?apikey=${key}&offset=0`,
  `https://api.cricapi.com/v1/matches?apikey=${key}&offset=0`,
  `https://api.cricketdata.org/v1/matches?apikey=${key}&offset=0`,
  `https://cricket.sportmonks.com/api/v2.0/fixtures?api_token=${key}`,
  `https://api.sportradar.com/cricket-t2/en/schedules/2023-10-05/schedule.json?api_key=${key}`
];

urls.forEach(url => {
  https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log(`URL: ${url}`);
      console.log(`Status: ${res.statusCode}`);
      console.log(`Data: ${data.substring(0, 100)}...\n`);
    });
  }).on('error', err => {
    console.log(`URL: ${url}`);
    console.log(`Error: ${err.message}\n`);
  });
});
