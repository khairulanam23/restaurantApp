import express from "express";
import jwt from "jsonwebtoken";
import { User, AuditLog } from "../models/index.js";
import { AppError, asyncHandler } from "../middleware/errorHandler.js";
import { authenticate } from "../middleware/auth.js";
import { validate, schemas } from "../middleware/validation.js";
import { logger } from "../utils/logger.js";

const router = express.Router();

// Register
router.post(
  "/register",
  validate(schemas.register),
  asyncHandler(async (req, res) => {
    const { username, email, password, role } = req.validatedData;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new AppError("Email already registered", 400, "EMAIL_EXISTS");
    }

    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      throw new AppError("Username already taken", 400, "USERNAME_EXISTS");
    }

    const user = await User.create({ username, email, password, role });

    await AuditLog.create({
      action: "user.registered",
      entityType: "User",
      entityId: user.id,
      userId: user.id,
      userRole: user.role,
      newValues: { username, email, role },
      severity: "info",
    });

    logger.info("User registered", { userId: user.id, email });

    res.status(201).json({
      success: true,
      data: { user: user.toJSON() },
    });
  })
);

// Login
router.post(
  "/login",
  validate(schemas.login),
  asyncHandler(async (req, res) => {
    const { email, password } = req.validatedData;

    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password))) {
      await AuditLog.create({
        action: "auth.login_failed",
        entityType: "User",
        entityId: email,
        severity: "warning",
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
      });
      throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
    }

    if (!user.isActive) {
      throw new AppError("User account is inactive", 403, "ACCOUNT_INACTIVE");
    }

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRY || "15m",
      }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRY || "7d",
      }
    );

    await user.update({ refreshToken, lastLogin: new Date() });

    await AuditLog.create({
      action: "auth.login_success",
      entityType: "User",
      entityId: user.id,
      userId: user.id,
      userRole: user.role,
      severity: "info",
      ipAddress: req.ip,
    });

    logger.info("User logged in", { userId: user.id });

    res.json({
      success: true,
      data: {
        user: user.toJSON(),
        accessToken,
        refreshToken,
      },
    });
  })
);

// Refresh Token
router.post(
  "/refresh-token",
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError(
        "Refresh token required",
        400,
        "MISSING_REFRESH_TOKEN"
      );
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await User.findByPk(decoded.id);

      if (!user || user.refreshToken !== refreshToken) {
        throw new AppError(
          "Invalid refresh token",
          401,
          "INVALID_REFRESH_TOKEN"
        );
      }

      const newAccessToken = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRY || "15m",
        }
      );

      res.json({
        success: true,
        data: { accessToken: newAccessToken },
      });
    } catch (error) {
      throw new AppError("Invalid refresh token", 401, "INVALID_REFRESH_TOKEN");
    }
  })
);

// Logout
router.post(
  "/logout",
  authenticate,
  asyncHandler(async (req, res) => {
    await req.user.update({ refreshToken: null });

    await AuditLog.create({
      action: "auth.logout",
      entityType: "User",
      entityId: req.user.id,
      userId: req.user.id,
      userRole: req.user.role,
      severity: "info",
    });

    logger.info("User logged out", { userId: req.user.id });
    res.json({ success: true, message: "Logged out successfully" });
  })
);

// Get Current User
router.get(
  "/me",
  authenticate,
  asyncHandler(async (req, res) => {
    res.json({
      success: true,
      data: { user: req.user.toJSON() },
    });
  })
);

// Update Current User Profile
router.put(
  "/me",
  authenticate,
  asyncHandler(async (req, res) => {
    const { username, email } = req.body;

    if (username && username !== req.user.username) {
      const existing = await User.findOne({ where: { username } });
      if (existing)
        throw new AppError("Username already taken", 400, "USERNAME_EXISTS");
    }

    if (email && email !== req.user.email) {
      const existing = await User.findOne({ where: { email } });
      if (existing)
        throw new AppError("Email already in use", 400, "EMAIL_EXISTS");
    }

    const oldValues = { username: req.user.username, email: req.user.email };
    await req.user.update({ username, email });

    await AuditLog.create({
      action: "user.profile_updated",
      entityType: "User",
      entityId: req.user.id,
      userId: req.user.id,
      userRole: req.user.role,
      oldValues,
      newValues: { username, email },
      severity: "info",
    });

    res.json({ success: true, data: { user: req.user.toJSON() } });
  })
);

// Change Password
router.post(
  "/change-password",
  authenticate,
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!(await req.user.comparePassword(currentPassword))) {
      throw new AppError(
        "Current password is incorrect",
        401,
        "INVALID_PASSWORD"
      );
    }

    await req.user.update({ password: newPassword });

    await AuditLog.create({
      action: "auth.password_changed",
      entityType: "User",
      entityId: req.user.id,
      userId: req.user.id,
      userRole: req.user.role,
      severity: "warning",
    });

    logger.info("Password changed", { userId: req.user.id });

    res.json({ success: true, message: "Password changed successfully" });
  })
);

// Forgot Password (initiate reset)
router.post(
  "/forgot-password",
  validate(schemas.forgotPassword),
  asyncHandler(async (req, res) => {
    const { email } = req.validatedData;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Don't reveal if email exists
      return res.json({
        success: true,
        message: "If email exists, reset link will be sent",
      });
    }

    // In production, generate token and send email
    const resetToken = jwt.sign(
      { id: user.id, type: "reset" },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    await AuditLog.create({
      action: "auth.password_reset_requested",
      entityType: "User",
      entityId: user.id,
      severity: "info",
    });

    logger.info("Password reset requested", { email });

    res.json({
      success: true,
      message: "If email exists, reset link will be sent",
    });
  })
);

// Reset Password
router.post(
  "/reset-password",
  asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      throw new AppError(
        "Token and new password required",
        400,
        "MISSING_FIELDS"
      );
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.type !== "reset") {
        throw new AppError("Invalid token", 401, "INVALID_TOKEN");
      }

      const user = await User.findByPk(decoded.id);
      if (!user) throw new AppError("User not found", 404, "NOT_FOUND");

      await user.update({ password: newPassword });

      await AuditLog.create({
        action: "auth.password_reset",
        entityType: "User",
        entityId: user.id,
        severity: "warning",
      });

      logger.info("Password reset completed", { userId: user.id });

      res.json({ success: true, message: "Password reset successfully" });
    } catch (error) {
      throw new AppError("Invalid or expired token", 401, "INVALID_TOKEN");
    }
  })
);

export default router;
