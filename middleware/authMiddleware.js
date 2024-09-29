const jwt = require('jsonwebtoken');

exports.authenticateJWT = (req, res, next) => {
  const token = req.headers['authorization'].split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: 'Token is required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};