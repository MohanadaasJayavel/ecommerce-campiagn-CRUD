const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database/database');

exports.login = (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err || !user) {
      return res.status(400).json({ message: 'Invalid username' });
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
      } else {
        res.status(401).json({ message: 'Invalid password' });
      }
    });
  });
};
