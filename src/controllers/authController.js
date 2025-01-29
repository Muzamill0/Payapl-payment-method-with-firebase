const conn = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(200).json({
      status: 'fail',
      message: 'Invalid email or password',
    });
  }

  try {
    const sql = `SELECT * FROM users WHERE email = ?`;
    const [rows] = await conn.query(sql, [email]);

    if (rows.length === 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid email or password',
      });
    }

    const user = rows[0];
    const storedHashedPassword = user.password;
    const isMatch = await bcrypt.compare(password, storedHashedPassword);

    if (isMatch) {
      const SECRET_KEY = process.env.JWT_SECRET;
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          name: user.name,
          type: user.type,
        },
        SECRET_KEY,
        { expiresIn: '1d' },
      );
      const tokenSql = `INSERT INTO tokens (user_id, token) VALUES (?, ?) ON DUPLICATE KEY UPDATE token = VALUES(token)`;
      const [insertResult] = await conn.query(tokenSql, [user.id, token]);
      if (insertResult.affectedRows > 0) {
          res.status(200).json({
          status: 'success',
          message: 'Login successful',
          token,
        });
      } else {
        res.status(500).json({
          status: 'fail',
          message: 'Failed to store token',
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: 'Internal server error',
    });
  }
};

module.exports = {
  login,
};
