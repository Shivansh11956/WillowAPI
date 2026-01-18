#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Content Moderation API...\n');

// Check if .env exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file from template...');
  fs.copyFileSync(path.join(__dirname, '.env.example'), envPath);
  console.log('✅ .env file created. Please add your API keys.\n');
} else {
  console.log('✅ .env file already exists.\n');
}

// Install dependencies
console.log('📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit', cwd: __dirname });
  console.log('✅ Dependencies installed.\n');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

console.log('🎉 Setup complete!\n');
console.log('Next steps:');
console.log('1. Add your API keys to .env file');
console.log('2. Start the server: npm run dev');
console.log('3. Generate an API key: node generate-api-key.js "My App"');
console.log('4. Test the API: node test-api.js');
console.log('\nAPI will be available at: http://localhost:5001');
console.log('Health check: http://localhost:5001/health');