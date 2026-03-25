const https = require('https');

const key = 'e2fb9007613e95b50de2e7e86b094c080bb4f57e6227f65e33ab064133ab17e4';

const url = `https://api.cricketdata.org/v1/matches?apikey=${key}&offset=0`;

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Data: ${data.substring(0, 500)}`);
  });
}).on('error', err => {
  console.log(`Error: ${err.message}`);
});
