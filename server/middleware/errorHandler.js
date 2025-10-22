import { logger } from "../utils/logger.js"

export class AppError extends Error {
  constructor(message, statusCode, code = "INTERNAL_ERROR", details = null) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.details = details
  }
}

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const code = err.code || "INTERNAL_ERROR"
  const message = err.message || "Internal server error"

  // Generate request ID if not present
  const requestId = req.id || `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  logger.error("Request error", {
    requestId,
    statusCode,
    code,
    message,
    path: req.path,
    method: req.method,
    userId: req.user?.id,
    userRole: req.user?.role,
    ip: req.ip,
    stack: err.stack,
  })

  const response = {
    success: false,
    error: {
      code,
      message,
      timestamp: new Date().toISOString(),
      requestId,
    },
  }

  if (err.details) {
    response.error.details = err.details
  }

  res.status(statusCode).json(response)
}
