const ModerationLog = require('../models/moderationLog.model');
const ApiKey = require('../models/apiKey.model');

const getStats = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    const userKeys = await ApiKey.find({ userId, isActive: true }).select('keyId');
    const keyIds = userKeys.map(k => k.keyId);
    
    const totalRequests = await ModerationLog.countDocuments({ apiKeyId: { $in: keyIds } });
    const activeKeys = userKeys.length;
    const blockedContent = await ModerationLog.countDocuments({ apiKeyId: { $in: keyIds }, action: 'blocked' });
    const allowedContent = await ModerationLog.countDocuments({ apiKeyId: { $in: keyIds }, action: 'allowed' });
    
    const successRate = totalRequests > 0 ? Math.round((allowedContent / totalRequests) * 100) : 0;

    res.json({
      totalRequests,
      activeKeys,
      successRate,
      blockedContent
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

const getUsage = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    const userKeys = await ApiKey.find({ userId, isActive: true }).select('keyId name requestCount');
    const keyIds = userKeys.map(k => k.keyId);
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyUsage = await ModerationLog.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo }, apiKeyId: { $in: keyIds } } },
      {
        $group: {
          _id: { 
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            keyId: "$apiKeyId"
          },
          requests: { $sum: 1 }
        }
      },
      { $sort: { "_id.date": 1 } }
    ]);

    const dailyMap = {};
    dailyUsage.forEach(item => {
      const date = item._id.date;
      const keyId = item._id.keyId || 'unknown';
      
      if (!dailyMap[date]) {
        dailyMap[date] = { date, requests: 0, byKey: {} };
      }
      dailyMap[date].requests += item.requests;
      dailyMap[date].byKey[keyId] = item.requests;
    });

    const daily = Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date));

    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const hourlyUsage = await ModerationLog.aggregate([
      { $match: { createdAt: { $gte: twentyFourHoursAgo }, apiKeyId: { $in: keyIds } } },
      {
        $group: {
          _id: { 
            hour: { $dateToString: { format: "%Y-%m-%d %H:00", date: "$createdAt" } },
            keyId: "$apiKeyId"
          },
          requests: { $sum: 1 }
        }
      },
      { $sort: { "_id.hour": 1 } }
    ]);

    const hourlyMap = {};
    hourlyUsage.forEach(item => {
      const hour = item._id.hour;
      const keyId = item._id.keyId || 'unknown';
      
      if (!hourlyMap[hour]) {
        hourlyMap[hour] = { hour, requests: 0, byKey: {} };
      }
      hourlyMap[hour].requests += item.requests;
      hourlyMap[hour].byKey[keyId] = item.requests;
    });

    const hourly = Object.values(hourlyMap).sort((a, b) => a.hour.localeCompare(b.hour));

    const modelUsage = await ModerationLog.aggregate([
      { $match: { apiKeyId: { $in: keyIds } } },
      {
        $group: {
          _id: "$model",
          count: { $sum: 1 }
        }
      }
    ]);

    const actionUsage = await ModerationLog.aggregate([
      { $match: { apiKeyId: { $in: keyIds } } },
      {
        $group: {
          _id: "$action",
          count: { $sum: 1 }
        }
      }
    ]);

    const models = {};
    modelUsage.forEach(item => {
      models[item._id || 'unknown'] = item.count;
    });

    const actions = {};
    actionUsage.forEach(item => {
      actions[item._id] = item.count;
    });

    res.json({
      daily,
      hourly,
      models,
      actions,
      apiKeys: userKeys
    });
  } catch (error) {
    console.error('Get usage error:', error);
    res.status(500).json({ error: 'Failed to fetch usage data' });
  }
};

module.exports = { getStats, getUsage };