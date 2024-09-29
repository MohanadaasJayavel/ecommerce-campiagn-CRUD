const bcrypt = require('bcrypt');
const db = require('../database/database');

exports.createUser = (req, res) => {
  const { username, password, email } = req.body;

  // Check if all required fields are provided
  if (!username || !password || !email) {
    return res.status(400).json({ message: 'All fields (username, password, email) are required' });
  }

  // Check if user already exists
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ message: 'Error hashing password' });
      }

      // Insert the new user into the database
      db.run(
        `INSERT INTO users (username, password, email) VALUES (?, ?, ?)`,
        [username, hashedPassword, email],
        function (err) {
          if (err) {
            return res.status(500).json({ message: 'Error creating user' });
          }
          res.status(201).json({ message: 'User created successfully', userId: this.lastID });
        }
      );
    });
  });
};
exports.getUserById = (req, res) => {
  const { id } = req.params;

  // Fetch user details from the database
  db.get('SELECT id, username, email FROM users WHERE id = ?', [id], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching user details' });
    }
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ data: user, message: "User data fetched successfully" });
  });
};

exports.getUsers = (req, res) => {
  const { id } = req.params;
  db.all('SELECT id, username, email FROM users', [], (err, users) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching user details' });
    }
    if (!users) {
      return res.status(404).json({ message: 'No Users Found' });
    }
    res.status(200).json({ data: users, message: "Users data fetched successfully" });
  });
};

exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;
  db.get('SELECT * FROM users WHERE id = ?', [id], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching user' });
    }
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const updatedUsername = username || user.username;
    const updatedEmail = email || user.email;

    if (password) {
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({ message: 'Error hashing password' });
        }

        db.run(
          `UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?`,
          [updatedUsername, updatedEmail, hashedPassword, id],
          (err) => {
            if (err) {
              return res.status(500).json({ message: 'Error updating user' });
            }
            res.status(200).json({ message: 'User updated successfully' });
          }
        );
      });
    } else {
      db.run(
        `UPDATE users SET username = ?, email = ? WHERE id = ?`,
        [updatedUsername, updatedEmail, id],
        (err) => {
          if (err) {
            return res.status(500).json({ message: 'Error updating user' });
          }
          res.status(200).json({ message: 'User updated successfully' });
        }
      );
    }
  });
};

exports.deleteUser = (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM users WHERE id = ?', [id], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching user' });
    }
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    db.run('DELETE FROM users WHERE id = ?', [id], (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error deleting user' });
      }
      res.status(200).json({ message: 'User deleted successfully' });
    });
  });
};
