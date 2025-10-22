import jwt from "jsonwebtoken"
import { AppError, asyncHandler } from "./errorHandler.js"
import { User, AuditLog } from "../models/index.js"

export const authenticate = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]

  if (!token) {
    await AuditLog.create({
      action: "auth.unauthorized_access",
      entityType: "Auth",
      entityId: "unknown",
      severity: "warning",
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    })
    throw new AppError("No token provided", 401, "UNAUTHORIZED")
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findByPk(decoded.id)

    if (!user || !user.isActive) {
      await AuditLog.create({
        action: "auth.inactive_user_access",
        entityType: "User",
        entityId: decoded.id,
        severity: "warning",
        ipAddress: req.ip,
      })
      throw new AppError("User not found or inactive", 401, "UNAUTHORIZED")
    }

    req.user = user
    next()
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError("Token expired", 401, "TOKEN_EXPIRED")
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError("Invalid token", 401, "UNAUTHORIZED")
    }
    throw error
  }
})

export const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      AuditLog.create({
        action: "auth.forbidden_access",
        entityType: "User",
        entityId: req.user.id,
        userId: req.user.id,
        userRole: req.user.role,
        severity: "warning",
        ipAddress: req.ip,
      }).catch(() => {}) // Don't block on audit log failure

      throw new AppError("Insufficient permissions", 403, "FORBIDDEN")
    }
    next()
  }
