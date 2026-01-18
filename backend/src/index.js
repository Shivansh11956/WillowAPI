const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./lib/db.js');
const moderationRoutes = require('./routes/moderation.route.js');
const authRoutes = require('./routes/auth.route.js');
const keysRoutes = require('./routes/keys.route.js');
const analyticsRoutes = require('./routes/analytics.route.js');

const app = express();

dotenv.config();

const PORT = parseInt(process.env.PORT) || 5001;

app.use(express.json({ limit: '10mb' }));
app.use(cors());

// Health check endpoint
app.get('/health', (req, res) => {
  const geminiKeys = Object.keys(process.env).filter(k => k.startsWith('GEMINI_KEY_')).length;
  const groqKey = process.env.GROQ_API_KEY ? 1 : 0;
  
  res.status(200).json({
    status: 'OK',
    service: 'Content Moderation API',
    timestamp: new Date().toISOString(),
    moderation: {
      gemini_keys: geminiKeys > 0 ? `${geminiKeys} configured` : 'missing',
      groq_key: groqKey > 0 ? 'configured' : 'missing',
      fallback_filter: 'active'
    }
  });
});

app.use('/api/v1', moderationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/keys', keysRoutes);
app.use('/api/analytics', analyticsRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
  });
}

// API documentation endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Content Moderation API',
    version: '1.0.0',
    endpoints: {
      'POST /api/v1/moderate': 'Moderate text content',
      'GET /health': 'Service health check'
    },
    documentation: 'https://docs.example.com'
  });
});

app.listen(PORT, () => {
  console.log(`Content Moderation API running on PORT: ${PORT}`);
  connectDB();
});