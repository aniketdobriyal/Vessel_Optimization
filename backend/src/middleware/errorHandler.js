/**
 * Global Express Error Handler Middleware
 */
export default function errorHandler(err, req, res, next) {
  console.error('API Error: ', err.stack || err);
  
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: statusCode,
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred on the API server.'
  });
}
