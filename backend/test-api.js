const axios = require('axios');

const API_BASE = 'http://localhost:5001';

async function testModerationAPI() {
  console.log('🧪 Testing Content Moderation API\n');

  // Test health endpoint
  try {
    const health = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health Check:', health.data.status);
    console.log('   Moderation Services:', health.data.moderation);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    return;
  }

  // Test cases (without API key for demo)
  const testCases = [
    { text: 'Hello world', expected: 'SAFE' },
    { text: 'you are stupid', expected: 'REWRITE' },
    { text: 'I will kill you', expected: 'BLOCK' }
  ];

  console.log('\n📝 Test Cases (Note: Requires valid API key):');
  testCases.forEach((test, i) => {
    console.log(`${i + 1}. "${test.text}" → Expected: ${test.expected}`);
  });

  console.log('\n💡 To test with API key:');
  console.log('curl -X POST http://localhost:5001/api/v1/moderate \\');
  console.log('  -H "Authorization: Bearer YOUR_API_KEY" \\');
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -d \'{"text":"Hello world"}\'');
}

if (require.main === module) {
  testModerationAPI().catch(console.error);
}

module.exports = { testModerationAPI };