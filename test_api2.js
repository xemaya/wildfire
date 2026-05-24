const https = require('https');

const data = JSON.stringify({
  model: 'gemini-3.1-flash-image-preview',
  messages: [{ role: 'user', content: 'Generate an image of a cute cat' }]
});

const options = {
  hostname: 'api.cometapi.com',
  path: '/v1/chat/completions',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer '
  }
};

const req = https.request(options, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log(body));
});

req.on('error', e => console.error(e));
req.write(data);
req.end();
