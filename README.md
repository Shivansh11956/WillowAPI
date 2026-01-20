# Willow API - Content Moderation Platform

### AI-powered content moderation API with multi-provider fallback system and comprehensive web dashboard

A production version of this API is available at:

 **https://willowapi-lj3e.onrender.com/**

## Features

### **Multi-Provider AI Moderation**
- **Primary**: Gemini AI with advanced content analysis
- **Fallback**: Groq AI for secondary moderation
- **Final**: Rule-based keyword filtering
- **Smart Rewriting**: Preserves intent while removing toxicity

### **Web Dashboard**
- **Authentication**: Email OTP login (passwordless)
- **API Key Management**: Create, view, and delete API keys
- **Real-time Analytics**: Usage statistics and performance metrics
- **Interactive Documentation**: Built-in API explorer
- **Responsive Design**: Works on desktop and mobile

### **Security & Performance**
- **JWT Authentication**: Secure session management
- **Rate Limiting**: Built-in request throttling
- **Error Handling**: Robust fallback mechanisms
- **Logging**: Comprehensive request/response logging
- **Production Ready**: Optimized for deployment

## Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **MongoDB** Atlas account
- **API Keys**: Gemini AI, Groq, Brevo (email)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/willow-api.git
cd willow-api

# Install dependencies for both backend and frontend
npm run install-deps

# Set up environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with your API keys

# Start development servers
npm run dev
```

### Environment Setup

Create `backend/.env` with the following variables:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/WillowAPI

# Server Configuration
PORT=5001
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key

# AI API Keys
GEMINI_KEY_1=your_gemini_api_key_1
GEMINI_KEY_2=your_gemini_api_key_2
GROQ_API_KEY=your_groq_api_key

# Email Service (Brevo)
BREVO_API_KEY=your_brevo_api_key
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SMTP_FROM=your_email@domain.com

# Optional: Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Access Points

- **Live Demo**: https://willowapi-lj3e.onrender.com/
- **Dashboard**: http://localhost:5173 (local)
- **API**: http://localhost:5001 (local)
- **Health Check**: http://localhost:5001/health (local)

## API Documentation

### Authentication

All API requests require an API key in the Authorization header:

```bash
Authorization: Bearer your_api_key_here
```

### Moderate Content

**Endpoint**: `POST /api/v1/moderate`

```bash
curl -X POST http://localhost:5001/api/v1/moderate \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Your message to moderate",
    "userId": "optional_user_id",
    "conversationId": "optional_conversation_id"
  }'
```

### Response Examples

**Safe Content**
```json
{
  "blocked": false,
  "original": "Hello world",
  "moderated": "Hello world",
  "rewritten": false,
  "model": "gemini",
  "confidence": 0.95
}
```

**Rewritten Content**
```json
{
  "blocked": false,
  "original": "you are stupid",
  "moderated": "I disagree with you",
  "rewritten": true,
  "model": "gemini",
  "confidence": 0.87
}
```

**Blocked Content**
```json
{
  "blocked": true,
  "reason": "Content violates community guidelines",
  "original": "[REDACTED]",
  "model": "gemini",
  "confidence": 0.99
}
```

## Dashboard Features

### **Authentication**
- **Passwordless Login**: Email-based OTP system
- **Secure Sessions**: JWT token management
- **Auto-logout**: Session timeout protection

### **Analytics Dashboard**
- **Real-time Metrics**: Request counts, success rates
- **Performance Charts**: Response times, model usage
- **Usage Tracking**: Daily/weekly/monthly statistics
- **System Health**: AI provider status monitoring

### **API Key Management**
- **Create Keys**: Generate new API keys with custom names
- **Usage Tracking**: Monitor requests per key
- **Security**: One-time key display, secure storage
- **Key Rotation**: Easy deletion and regeneration

### **Documentation**
- **Interactive API Explorer**: Test endpoints directly
- **Code Examples**: Multiple programming languages
- **Rate Limits**: Clear usage guidelines
- **Best Practices**: Implementation recommendations

## Architecture

### Backend Stack
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens
- **Email**: Brevo SMTP service
- **AI Integration**: Gemini AI, Groq API

### Frontend Stack
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: Lucide React

### Moderation Pipeline

1. **Input Validation**: Text sanitization and preprocessing
2. **Gemini AI**: Primary content analysis and rewriting
3. **Groq Fallback**: Secondary moderation if Gemini fails
4. **Rule-based Filter**: Final keyword-based filtering
5. **Logging**: Store results for analytics and monitoring

## Deployment

### Railway Deployment

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway link
railway up
```

### Render Deployment

1. Connect your GitHub repository
2. Configure environment variables
3. Deploy using the included `render.yaml`

### Manual Deployment

```bash
# Build frontend
cd frontend
npm run build

# Deploy backend
cd ../backend
npm install --production
npm start

# Serve frontend dist folder as static files
```

### Environment Variables for Production

```env
NODE_ENV=production
PORT=${PORT:-5001}
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_secure_jwt_secret
# ... other production keys
```
## Development

### Project Structure

```
willow-api/
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── middleware/     # Auth, validation
│   └── .env               # Environment variables
├── frontend/               # React dashboard
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Route components
│   │   └── lib/           # Utilities, API client
│   └── dist/              # Built files
└── README.md
```

### Available Scripts

```bash
# Development
npm run dev          # Start both backend and frontend
npm run dev:backend  # Backend only
npm run dev:frontend # Frontend only

# Production
npm run build        # Build frontend
npm run start        # Start production server

# Utilities
npm run install-deps # Install all dependencies
npm run test         # Run tests
```

## Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## Support

- **Email**: support@willowapi.com
- **Issues**: [GitHub Issues](https://github.com/yourusername/willow-api/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/willow-api/discussions)

---

<div align="center">
  <strong>Built with love for safer online communities</strong>
</div>
