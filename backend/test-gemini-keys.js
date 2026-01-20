const axios = require('axios');
require('dotenv').config();

async function testGeminiKey(keyName, apiKey) {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        contents: [{
          parts: [{ text: "Say 'API key working' if you can read this." }]
        }]
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 15000
      }
    );
    
    console.log(`✅ ${keyName}: Working`);
    return true;
  } catch (error) {
    console.log(`❌ ${keyName}: Failed - ${error.response?.status || error.message}`);
    return false;
  }
}

async function testAllKeys() {
  console.log('Testing Gemini API Keys...\n');
  
  const keys = [];
  for (let i = 1; i <= 12; i++) {
    const key = process.env[`GEMINI_KEY_${i}`];
    if (key) {
      keys.push({ name: `GEMINI_KEY_${i}`, key });
    }
  }
  
  let workingKeys = 0;
  for (const { name, key } of keys) {
    const isWorking = await testGeminiKey(name, key);
    if (isWorking) workingKeys++;
    await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
  }
  
  console.log(`\nResult: ${workingKeys}/${keys.length} keys are working`);
}

testAllKeys();