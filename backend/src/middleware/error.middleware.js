export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorMiddleware(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  // Handle SQLite constraint violations dynamically if not caught in services
  if (err.code === 'SQLITE_CONSTRAINT') {
    if (err.message && err.message.includes('User.username')) {
      statusCode = 409;
      message = 'Username already exists';
    } else if (err.message && (err.message.includes('User.email') || err.message.includes('email'))) {
      statusCode = 409;
      message = 'Email already exists';
    } else {
      statusCode = 409;
      message = 'Database constraint violation';
    }
  }

  // Print to console in dev/test (optional, let's disable in test to keep logs clean unless wanted)
  if (process.env.NODE_ENV !== 'test') {
    console.error(`[Error] ${statusCode} | ${req.method} ${req.path} - ${message}`);
    console.error(err.stack || err);
  }

  // Prepare standard error response format:
  // {
  //   "error": "Error message",
  //   "status": 400,
  //   "timestamp": "2026-06-08T10:00:00Z"
  // }
  res.status(statusCode).json({
    error: message,
    status: statusCode,
    timestamp: new Date().toISOString()
  });
}
