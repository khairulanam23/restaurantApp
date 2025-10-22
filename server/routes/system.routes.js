import express from "express";
import { sequelize } from "../config/database.js";
import { AuditLog } from "../models/index.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { logger } from "../utils/logger.js";

const router = express.Router();

// Health Check
router.get(
  "/health",
  asyncHandler(async (req, res) => {
    try {
      await sequelize.authenticate();
      res.json({
        success: true,
        data: {
          status: "healthy",
          database: "connected",
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      res.status(503).json({
        success: false,
        error: {
          code: "SERVICE_UNAVAILABLE",
          message: "Database connection failed",
        },
      });
    }
  })
);

// System Info
router.get(
  "/info",
  authenticate,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    res.json({
      success: true,
      data: {
        version: "1.0.0",
        environment: process.env.NODE_ENV || "development",
        nodeVersion: process.version,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      },
    });
  })
);

// Get Audit Logs
router.get(
  "/logs",
  authenticate,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 50, action, severity } = req.query;
    const where = {};

    if (action) where.action = action;
    if (severity) where.severity = severity;

    const logs = await AuditLog.findAll({
      where,
      limit: Number.parseInt(limit),
      offset: (Number.parseInt(page) - 1) * Number.parseInt(limit),
      order: [["timestamp", "DESC"]],
    });

    const total = await AuditLog.count({ where });

    res.json({
      success: true,
      data: {
        logs,
        pagination: {
          page: Number.parseInt(page),
          limit: Number.parseInt(limit),
          total,
        },
      },
    });
  })
);

// Get System Settings
router.get(
  "/settings",
  authenticate,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    // In production, fetch from database
    const settings = {
      taxRate: 0.1,
      serviceChargePercentage: 0,
      currency: "USD",
      restaurantName: "Restaurant Name",
      restaurantAddress: "123 Main St",
      restaurantPhone: "+1-555-0000",
      businessHours: {
        monday: { open: "09:00", close: "22:00" },
        tuesday: { open: "09:00", close: "22:00" },
        wednesday: { open: "09:00", close: "22:00" },
        thursday: { open: "09:00", close: "22:00" },
        friday: { open: "09:00", close: "23:00" },
        saturday: { open: "10:00", close: "23:00" },
        sunday: { open: "10:00", close: "21:00" },
      },
    };

    res.json({ success: true, data: { settings } });
  })
);

// Update System Settings
router.put(
  "/settings",
  authenticate,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const { settings } = req.body;

    // In production, save to database
    await AuditLog.create({
      action: "system.settings_updated",
      entityType: "System",
      entityId: "settings",
      userId: req.user.id,
      userRole: req.user.role,
      newValues: settings,
      severity: "warning",
    });

    logger.info("System settings updated", { updatedBy: req.user.id });

    res.json({ success: true, data: { settings } });
  })
);

// Initiate Backup
router.post(
  "/backup",
  authenticate,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    // In production, implement actual backup logic
    const backupId = `backup-${Date.now()}`;

    await AuditLog.create({
      action: "system.backup_initiated",
      entityType: "System",
      entityId: backupId,
      userId: req.user.id,
      userRole: req.user.role,
      severity: "info",
    });

    logger.info("Backup initiated", { backupId, initiatedBy: req.user.id });

    res.json({
      success: true,
      data: {
        backupId,
        status: "in_progress",
        timestamp: new Date().toISOString(),
      },
    });
  })
);

// Restore from Backup
router.post(
  "/restore",
  authenticate,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const { backupId } = req.body;

    if (!backupId) {
      throw new Error("Backup ID required");
    }

    // In production, implement actual restore logic
    await AuditLog.create({
      action: "system.restore_initiated",
      entityType: "System",
      entityId: backupId,
      userId: req.user.id,
      userRole: req.user.role,
      severity: "critical",
    });

    logger.info("Restore initiated", { backupId, initiatedBy: req.user.id });

    res.json({
      success: true,
      data: {
        backupId,
        status: "in_progress",
        timestamp: new Date().toISOString(),
      },
    });
  })
);

export default router;
