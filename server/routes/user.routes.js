import express from "express";
import { User, AuditLog } from "../models/index.js";
import { AppError, asyncHandler } from "../middleware/errorHandler.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { logger } from "../utils/logger.js";

const router = express.Router();

// List Users
router.get(
  "/",
  authenticate,
  authorize("admin", "manager"),
  asyncHandler(async (req, res) => {
    const { role, isActive, page = 1, limit = 20 } = req.query;
    const where = {};

    if (role) where.role = role;
    if (isActive !== undefined) where.isActive = isActive === "true";

    const users = await User.findAll({
      where,
      limit: Number.parseInt(limit),
      offset: (Number.parseInt(page) - 1) * Number.parseInt(limit),
      attributes: { exclude: ["password", "refreshToken"] },
      order: [["createdAt", "DESC"]],
    });

    const total = await User.count({ where });

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: Number.parseInt(page),
          limit: Number.parseInt(limit),
          total,
        },
      },
    });
  })
);

// Get User
router.get(
  "/:id",
  authenticate,
  asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password", "refreshToken"] },
    });
    if (!user) throw new AppError("User not found", 404, "NOT_FOUND");

    res.json({ success: true, data: { user: user.toJSON() } });
  })
);

// Update User
router.put(
  "/:id",
  authenticate,
  authorize("admin", "manager"),
  asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (!user) throw new AppError("User not found", 404, "NOT_FOUND");

    const { username, email, role } = req.body;
    const oldValues = {
      username: user.username,
      email: user.email,
      role: user.role,
    };

    // Check for duplicate username
    if (username && username !== user.username) {
      const existing = await User.findOne({ where: { username } });
      if (existing)
        throw new AppError("Username already taken", 400, "USERNAME_EXISTS");
    }

    // Check for duplicate email
    if (email && email !== user.email) {
      const existing = await User.findOne({ where: { email } });
      if (existing)
        throw new AppError("Email already in use", 400, "EMAIL_EXISTS");
    }

    await user.update({ username, email, role });

    await AuditLog.create({
      action: "user.updated",
      entityType: "User",
      entityId: user.id,
      userId: req.user.id,
      userRole: req.user.role,
      oldValues,
      newValues: { username, email, role },
      severity: "info",
    });

    logger.info("User updated", { userId: user.id, updatedBy: req.user.id });

    res.json({ success: true, data: { user: user.toJSON() } });
  })
);

// Update User Status
router.put(
  "/:id/status",
  authenticate,
  authorize("admin", "manager"),
  asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (!user) throw new AppError("User not found", 404, "NOT_FOUND");

    const { isActive } = req.body;
    const oldValue = user.isActive;

    await user.update({ isActive });

    await AuditLog.create({
      action: "user.status_updated",
      entityType: "User",
      entityId: user.id,
      userId: req.user.id,
      userRole: req.user.role,
      oldValues: { isActive: oldValue },
      newValues: { isActive },
      severity: "info",
    });

    logger.info("User status updated", {
      userId: user.id,
      isActive,
      updatedBy: req.user.id,
    });

    res.json({ success: true, data: { user: user.toJSON() } });
  })
);

// Delete User
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (!user) throw new AppError("User not found", 404, "NOT_FOUND");

    await user.destroy();

    await AuditLog.create({
      action: "user.deleted",
      entityType: "User",
      entityId: req.params.id,
      userId: req.user.id,
      userRole: req.user.role,
      severity: "warning",
    });

    logger.info("User deleted", {
      userId: req.params.id,
      deletedBy: req.user.id,
    });

    res.json({ success: true, message: "User deleted successfully" });
  })
);

export default router;
