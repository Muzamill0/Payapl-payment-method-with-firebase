const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dayjs = require('dayjs');
require('dotenv').config();
const { User, Token }  = require('../models');

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userData = await User.findOne({
      attributes: ['user_id', 'user_email', 'user_password', 'user_name', 'user_type', 'user_status'],
      where: { user_email: email },
    });

    if (!userData) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid email or password',
      });
    };
    if (userData.user_status === 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'User against this email is blocked',
      });
    };

    const storedHashedPassword = userData.user_password;
    const isMatch = await bcrypt.compare(password, storedHashedPassword);

    if (isMatch) {
      const SECRET_KEY = process.env.JWT_SECRET;
      const token = jwt.sign(
        {
          userId: userData.user_id,
          email: userData.user_email,
          name: userData.user_name,
          type: userData.user_type,
        },
        SECRET_KEY,
        { expiresIn: '1d' },
      );

      await Token.upsert({
        user_id: userData.user_id,
        token: token,
        updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      });

      res.status(200).json({
        status: 'success',
        message: 'Login successful',
        token,
      });
    } else {
      return res.status(400).json({
        status: 'fail',
        message: 'Something went wrong',
      });
    }

  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: 'Something went wrong',
    });
  }
};
const register = async (req, res) => {
  const { userName, userEmail, userPassword, userMobile, userAddress } = req.body;
  const userIP = req.ip;

  try {
    const existingUser = await User.findOne({
      attributes:['user_email'],
      where: {
        user_email: userEmail
      }
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'Email already registered!'
      });
    }

    const hashedPassword = await bcrypt.hash(userPassword, 10);

    const newUser = await User.create({
      user_name: userName,
      user_email: userEmail,
      user_password: hashedPassword,
      user_mobile: userMobile,
      user_address: userAddress,
      user_ip: userIP
    });
    res.status(201).json({
      status: 'success',
      message: 'User registered successfully!',
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error registering user',
      error: error.message,
    });
  }
};

const logout = async (req, res) => {
  const token = req.headers['authorization'].split(' ')[1];
  try {
    await Token.destroy({
      where: { token: token }
    });

    res.status(200).json({
      status: 'success',
      message: 'Logout successful',
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: 'Error logging out',
    });
  }
};

module.exports = {
  login,
  register,
  logout,
};
