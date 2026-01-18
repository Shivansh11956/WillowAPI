const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // In production, verify JWT token
    // For now, decode user from localStorage token
    const userData = req.headers['x-user-data'];
    if (userData) {
      req.user = JSON.parse(userData);
    }
    
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Invalid authentication' });
  }
};

module.exports = { authenticateUser };