# Content Moderation API

AI-powered content moderation API with multi-provider fallback system and web dashboard.

## Features

- **Multi-Provider AI**: Gemini → Groq → Rule-based fallback
- **Smart Rewriting**: Preserves intent while removing toxicity
- **Web Dashboard**: Email OTP login, API key management, analytics
- **API Key Authentication**: Secure access control
- **Usage Analytics**: Track API usage and performance
- **Production Ready**: Robust error handling and logging

## Quick Start

### Environment Setup

```bash
# Required AI API Keys
GEMINI_KEY_1=your_gemini_key_1
GEMINI_KEY_2=your_gemini_key_2
GROQ_API_KEY=your_groq_key

# Database
MONGODB_URI=mongodb://localhost:27017/moderation-api

# Server
PORT=5001
NODE_ENV=development
```

### Installation

```bash
npm run install-deps
npm run dev          # Start both API and dashboard
```

### Access Points

- **API**: http://localhost:5001
- **Dashboard**: http://localhost:5173
- **Health Check**: http://localhost:5001/health

## Dashboard Features

### 🔐 Authentication
- Email-based OTP login (no passwords)
- Secure session management

### 📊 Dashboard
- Real-time API usage statistics
- Success rates and performance metrics
- System health monitoring

### 🔑 API Key Management
- Create/delete API keys
- Usage tracking per key
- Copy keys securely

### 📈 Analytics
- Daily request charts
- Model usage breakdown
- Moderation action statistics
- Response time metrics

### 📚 Documentation
- Interactive API documentation
- Code examples and SDKs
- Rate limits and guidelines

## API Usage

### Authentication

All requests require an API key in the Authorization header:

```bash
Authorization: Bearer your_api_key_here
```

### Moderate Content

```bash
POST /api/v1/moderate
Content-Type: application/json

{
  "text": "Your message to moderate",
  "userId": "optional_user_id",
  "conversationId": "optional_conversation_id"
}
```

### Response Format

**Safe Content:**
```json
{
  "blocked": false,
  "original": "Hello world",
  "moderated": "Hello world",
  "rewritten": false,
  "model": "gemini"
}
```

**Rewritten Content:**
```json
{
  "blocked": false,
  "original": "you are stupid",
  "moderated": "I disagree with you",
  "rewritten": true,
  "model": "gemini"
}
```

**Blocked Content:**
```json
{
  "blocked": true,
  "reason": "Content violates community guidelines",
  "original": "violent threat message"
}
```

## Health Check

```bash
GET /health
```

Returns service status and AI provider availability.

## Moderation Pipeline

1. **Gemini AI** (Primary) - Advanced content analysis
2. **Groq AI** (Fallback) - Secondary moderation
3. **Rule-based Filter** (Final fallback) - Keyword matching

## Rate Limits

- Gemini: 20 requests per key per day
- Groq: No built-in limits
- Automatic key rotation and fallback

## Logging

All moderation decisions are logged to MongoDB with:
- Original content
- Moderation decision
- AI model used
- Timestamps
- User/conversation context

## Production Deployment

The API is ready for deployment on:
- Railway
- Heroku  
- AWS
- Google Cloud
- Any Node.js hosting platform

Set environment variables and deploy the `backend` directory.