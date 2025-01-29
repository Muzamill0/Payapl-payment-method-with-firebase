const ApiError = require('../utils/ApiError');

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    console.error(err);
    return res.status(err.statusCode).json({
      status: "error",  
      message: err.message,
      errorDetails: err.isOperational ? err.details : {},
    });
  }
  
  return res.status(500).json({
    message: 'Internal Server Error',
  });
};

module.exports = errorHandler;