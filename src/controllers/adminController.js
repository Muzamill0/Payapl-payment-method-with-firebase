const conn = require('../config/db');

const getUsers = async (req, res) => {
  try {
    res.status(200).json({
      message: 'Data fetched successfully',
      data: req.user,
    });
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred',
      error: error.message,
    });
  }
};

const getPayments = async (req, res) => {
  try {
    const [payments] = await conn.query('SELECT * FROM payments');

    res.status(200).json({
      message: 'Payments fetched successfully',
      data: payments,
    });
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred',
      error: error.message,
    });
  }
};

module.exports = {
  getUsers,
  getPayments,
};
