const crypto = require('crypto');
const mongoose = require('mongoose');
const { connectDB } = require('./src/lib/db');
const ApiKey = require('./src/models/apiKey.model');

async function generateApiKey(name, userId = 'demo-user') {
  try {
    await connectDB();
    
    // Generate random API key
    const apiKey = 'mk_' + crypto.randomBytes(32).toString('hex');
    const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex');
    const keyId = crypto.randomBytes(8).toString('hex');
    
    // Save to database
    const keyRecord = new ApiKey({
      keyId,
      hashedKey,
      name,
      userId,
      isActive: true
    });
    
    await keyRecord.save();
    
    console.log('✅ API Key Generated:');
    console.log('   Name:', name);
    console.log('   Key ID:', keyId);
    console.log('   API Key:', apiKey);
    console.log('   User ID:', userId);
    console.log('\n💡 Use this key in Authorization header:');
    console.log(`   Authorization: Bearer ${apiKey}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error generating API key:', error.message);
    process.exit(1);
  }
}

// Command line usage
if (require.main === module) {
  const name = process.argv[2] || 'Test Key';
  const userId = process.argv[3] || 'demo-user';
  generateApiKey(name, userId);
}

module.exports = { generateApiKey };