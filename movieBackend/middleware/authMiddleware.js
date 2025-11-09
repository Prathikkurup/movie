const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const protect = (req, res, next) => {
  let token;

  // --- FIX: Move the token check to the top ---
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the DB and attach to the request object
      pool.query('SELECT id, email FROM users WHERE id = $1', [decoded.id])
        .then(result => {
          if (result.rows.length > 0) {
            req.user = result.rows[0]; // Attach full user object
            next();
          } else {
            res.status(401).json({ message: 'Not authorized, user not found' });
          }
        }).catch(() => res.status(401).json({ message: 'Not authorized, token failed' }));
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

};

module.exports = { protect };