#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Content Moderation API Platform...\n');

// Setup backend
console.log('📦 Setting up backend...');
const backendEnvPath = path.join(__dirname, 'backend', '.env');
if (!fs.existsSync(backendEnvPath)) {
  console.log('📝 Creating backend .env file...');
  fs.copyFileSync(
    path.join(__dirname, 'backend', '.env.example'), 
    backendEnvPath
  );
  console.log('✅ Backend .env created\n');
} else {
  console.log('✅ Backend .env already exists\n');
}

// Install dependencies
console.log('📦 Installing dependencies...');
try {
  execSync('npm run install-deps', { stdio: 'inherit', cwd: __dirname });
  console.log('✅ Dependencies installed\n');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

console.log('🎉 Setup complete!\n');
console.log('📋 Next steps:');
console.log('1. Add your AI API keys to backend/.env file');
console.log('2. Start development: npm run dev');
console.log('3. Access dashboard: http://localhost:5173');
console.log('4. API endpoint: http://localhost:5001');
console.log('\n🔑 To create API keys:');
console.log('   cd backend && node generate-api-key.js "My App"');
console.log('\n📧 For OTP login, check console for OTP codes during development');