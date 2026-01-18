const { moderateWithGemini } = require('../services/geminiPoolService');
const { moderateWithGroq } = require('../services/groqService');
const { analyzeFallback } = require('../lib/fallbackFilter');
const ModerationLog = require('../models/moderationLog.model');

const moderateContent = async (req, res) => {
  try {
    const { text, userId, conversationId } = req.body;
    
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required and must be a string' });
    }

    const trimmedText = text.trim();
    if (!trimmedText) {
      return res.status(400).json({ error: 'Text cannot be empty' });
    }

    // Try Gemini first
    const geminiResult = await moderateWithGemini(trimmedText);
    
    if (geminiResult.ok) {
      const isBlocked = geminiResult.text === '<<BLOCK>>';
      const isRewritten = geminiResult.text !== trimmedText && !isBlocked;
      
      // Log the moderation
      await ModerationLog.create({
        conversationId: conversationId || 'api-request',
        userId: userId || 'anonymous',
        apiKeyId: req.apiKey?.keyId,
        originalMessage: trimmedText,
        action: isBlocked ? 'blocked' : 'allowed',
        reason: isBlocked ? 'Blocked by AI moderation' : null,
        suggestedAlternative: isRewritten ? geminiResult.text : null,
        model: 'gemini'
      });

      if (isBlocked) {
        return res.json({
          blocked: true,
          reason: 'Content violates community guidelines',
          original: trimmedText,
          model: 'gemini'
        });
      }

      return res.json({
        blocked: false,
        original: trimmedText,
        moderated: geminiResult.text,
        rewritten: isRewritten,
        model: 'gemini'
      });
    }

    // Fallback to Groq
    const groqResult = await moderateWithGroq(trimmedText);
    
    if (groqResult.ok) {
      const isBlocked = groqResult.text === '<<BLOCK>>';
      const isRewritten = groqResult.text !== trimmedText && !isBlocked;
      
      await ModerationLog.create({
        conversationId: conversationId || 'api-request',
        userId: userId || 'anonymous',
        apiKeyId: req.apiKey?.keyId,
        originalMessage: trimmedText,
        action: isBlocked ? 'blocked' : 'allowed',
        reason: isBlocked ? 'Blocked by AI moderation' : null,
        suggestedAlternative: isRewritten ? groqResult.text : null,
        model: 'groq'
      });

      if (isBlocked) {
        return res.json({
          blocked: true,
          reason: 'Content violates community guidelines',
          original: trimmedText,
          model: 'groq'
        });
      }

      return res.json({
        blocked: false,
        original: trimmedText,
        moderated: groqResult.text,
        rewritten: isRewritten,
        model: 'groq'
      });
    }

    // Final fallback to rule-based filter
    const fallbackResult = analyzeFallback(trimmedText);
    
    await ModerationLog.create({
      conversationId: conversationId || 'api-request',
      userId: userId || 'anonymous',
      apiKeyId: req.apiKey?.keyId,
      originalMessage: trimmedText,
      action: fallbackResult.isToxic ? 'flagged' : 'allowed',
      reason: fallbackResult.isToxic ? `Rule-based filter: ${fallbackResult.reasons.join(', ')}` : null,
      suggestedAlternative: fallbackResult.isToxic ? fallbackResult.sanitized : null,
      model: 'fallback'
    });

    if (fallbackResult.isToxic) {
      return res.json({
        blocked: true,
        reason: 'Content flagged by safety filters',
        original: trimmedText,
        suggestion: fallbackResult.sanitized,
        model: 'fallback'
      });
    }

    // All systems failed, allow content
    return res.json({
      blocked: false,
      original: trimmedText,
      moderated: trimmedText,
      rewritten: false,
      model: 'passthrough'
    });

  } catch (error) {
    console.error('Moderation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { moderateContent };