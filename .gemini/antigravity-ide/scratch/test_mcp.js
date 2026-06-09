async function run() {
  const url = 'https://stitch.googleapis.com/mcp';
  const apiKey = 'AQ.Ab8RN6Jm5kB3YVYReqAzsUXcQNn37ig0OhrJui1Fft90Jht0Hw';

  const payload = {
    jsonrpc: '2.0',
    method: 'tools/call',
    params: {
      name: 'StitchMCP/get_project',
      arguments: {
        name: 'projects/9634750141184195814'
      }
    },
    id: 1
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    console.log('JSON Response:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

run();
