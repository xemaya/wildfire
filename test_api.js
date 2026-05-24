const https = require('https');

function testModel(modelName) {
  return new Promise((resolve) => {
    const data = JSON.stringify({
      model: modelName,
      prompt: 'A cute cat'
    });
    
    const options = {
      hostname: 'api.cometapi.com',
      path: '/v1/images/generations',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '
      }
    };
    
    const req = https.request(options, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => resolve(`Model ${modelName}: ${body}`));
    });
    
    req.on('error', e => resolve(`Model ${modelName} error: ${e.message}`));
    req.write(data);
    req.end();
  });
}

async function run() {
  console.log(await testModel('imagen-3.0-generate-002'));
  console.log(await testModel('imagen-3.0'));
  console.log(await testModel('imagen-3.0-fast-generate-001'));
}

run();
