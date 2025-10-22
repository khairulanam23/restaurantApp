import express from "express";
import {
  Table,
  Order,
  OrderLine,
  MenuItem,
  AuditLog,
} from "../models/index.js";
import { AppError, asyncHandler } from "../middleware/errorHandler.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate, schemas } from "../middleware/validation.js";
import { logger } from "../utils/logger.js";
import { Op } from "sequelize";

const router = express.Router();

// List Tables
router.get(
  "/",
  authenticate,
  asyncHandler(async (req, res) => {
    const { status, location, page = 1, limit = 20 } = req.query;
    const where = { isActive: true };

    if (status) where.status = status;
    if (location) where.location = location;

    const tables = await Table.findAll({
      where,
      include: [
        {
          model: Order,
          as: "orders",
          limit: 1,
          order: [["createdAt", "DESC"]],
        },
      ],
      limit: Number.parseInt(limit),
      offset: (Number.parseInt(page) - 1) * Number.parseInt(limit),
      order: [["tableNumber", "ASC"]],
    });

    const total = await Table.count({ where });

    res.json({
      success: true,
      data: {
        tables,
        pagination: {
          page: Number.parseInt(page),
          limit: Number.parseInt(limit),
          total,
        },
      },
    });
  })
);

// Get Available Tables
router.get(
  "/available",
  authenticate,
  asyncHandler(async (req, res) => {
    const tables = await Table.findAll({
      where: { status: "free", isActive: true },
      order: [["tableNumber", "ASC"]],
    });

    res.json({ success: true, data: { tables } });
  })
);

// Get Occupied Tables
router.get(
  "/occupied",
  authenticate,
  asyncHandler(async (req, res) => {
    const tables = await Table.findAll({
      where: { status: "occupied", isActive: true },
      include: [
        {
          model: Order,
          as: "orders",
          limit: 1,
          order: [["createdAt", "DESC"]],
        },
      ],
      order: [["tableNumber", "ASC"]],
    });

    res.json({ success: true, data: { tables } });
  })
);

// Get Table Details
router.get(
  "/:id",
  authenticate,
  asyncHandler(async (req, res) => {
    const table = await Table.findByPk(req.params.id, {
      include: [{ model: Order, as: "orders" }],
    });

    if (!table) throw new AppError("Table not found", 404, "NOT_FOUND");

    res.json({ success: true, data: { table } });
  })
);

// Create Table
router.post(
  "/",
  authenticate,
  authorize("admin", "manager"),
  validate(schemas.createTable),
  asyncHandler(async (req, res) => {
    const { tableNumber } = req.validatedData;

    const existing = await Table.findOne({ where: { tableNumber } });
    if (existing) {
      throw new AppError("Table number already exists", 400, "DUPLICATE_TABLE");
    }

    const table = await Table.create(req.validatedData);

    await AuditLog.create({
      action: "table.created",
      entityType: "Table",
      entityId: table.id,
      userId: req.user.id,
      userRole: req.user.role,
      newValues: req.validatedData,
      severity: "info",
    });

    logger.info("Table created", { tableId: table.id, createdBy: req.user.id });

    res.status(201).json({ success: true, data: { table } });
  })
);

// Update Table
router.put(
  "/:id",
  authenticate,
  authorize("admin", "manager"),
  asyncHandler(async (req, res) => {
    const table = await Table.findByPk(req.params.id);
    if (!table) throw new AppError("Table not found", 404, "NOT_FOUND");

    const oldValues = { ...table.toJSON() };

    await table.update(req.body);

    await AuditLog.create({
      action: "table.updated",
      entityType: "Table",
      entityId: table.id,
      userId: req.user.id,
      userRole: req.user.role,
      oldValues,
      newValues: req.body,
      severity: "info",
    });

    logger.info("Table updated", { tableId: table.id, updatedBy: req.user.id });

    res.json({ success: true, data: { table } });
  })
);

// Update Table Status
router.put(
  "/:id/status",
  authenticate,
  asyncHandler(async (req, res) => {
    const table = await Table.findByPk(req.params.id);
    if (!table) throw new AppError("Table not found", 404, "NOT_FOUND");

    const { status } = req.body;
    const oldStatus = table.status;

    await table.update({ status });

    await AuditLog.create({
      action: "table.status_updated",
      entityType: "Table",
      entityId: table.id,
      userId: req.user.id,
      userRole: req.user.role,
      oldValues: { status: oldStatus },
      newValues: { status },
      severity: "info",
    });

    logger.info("Table status updated", {
      tableId: table.id,
      status,
      updatedBy: req.user.id,
    });

    res.json({ success: true, data: { table } });
  })
);

// Select Table
router.put(
  "/:id/select",
  authenticate,
  asyncHandler(async (req, res) => {
    const table = await Table.findByPk(req.params.id);
    if (!table) throw new AppError("Table not found", 404, "NOT_FOUND");

    // Store in session/cache (simplified - in production use Redis)
    req.session = req.session || {};
    req.session.selectedTableId = req.params.id;

    res.json({ success: true, data: { table, message: "Table selected" } });
  })
);

// Release Table Selection
router.put(
  "/:id/release",
  authenticate,
  asyncHandler(async (req, res) => {
    if (req.session) {
      delete req.session.selectedTableId;
    }

    res.json({ success: true, message: "Table selection released" });
  })
);

// Get Currently Selected Table
router.get(
  "/selected/current",
  authenticate,
  asyncHandler(async (req, res) => {
    const selectedTableId = req.session?.selectedTableId;

    if (!selectedTableId) {
      return res.json({ success: true, data: { table: null } });
    }

    const table = await Table.findByPk(selectedTableId);

    res.json({ success: true, data: { table } });
  })
);

// Bulk Update Table Statuses
router.post(
  "/bulk-update",
  authenticate,
  authorize("admin", "manager"),
  asyncHandler(async (req, res) => {
    const { tableIds, status } = req.body;

    if (!Array.isArray(tableIds) || tableIds.length === 0) {
      throw new AppError("Table IDs required", 400, "INVALID_INPUT");
    }

    await Table.update({ status }, { where: { id: { [Op.in]: tableIds } } });

    await AuditLog.create({
      action: "table.bulk_status_updated",
      entityType: "Table",
      entityId: tableIds.join(","),
      userId: req.user.id,
      userRole: req.user.role,
      newValues: { status, count: tableIds.length },
      severity: "info",
    });

    res.json({ success: true, message: `${tableIds.length} tables updated` });
  })
);

// Get Table Order History
router.get(
  "/:id/orders",
  authenticate,
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const orders = await Order.findAll({
      where: { tableId: req.params.id },
      include: [
        {
          model: OrderLine,
          as: "lines",
          include: [{ model: MenuItem, as: "menuItem" }],
        },
      ],
      limit: Number.parseInt(limit),
      offset: (Number.parseInt(page) - 1) * Number.parseInt(limit),
      order: [["createdAt", "DESC"]],
    });

    const total = await Order.count({ where: { tableId: req.params.id } });

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: Number.parseInt(page),
          limit: Number.parseInt(limit),
          total,
        },
      },
    });
  })
);

// Delete Table
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const table = await Table.findByPk(req.params.id);
    if (!table) throw new AppError("Table not found", 404, "NOT_FOUND");

    await table.destroy();

    await AuditLog.create({
      action: "table.deleted",
      entityType: "Table",
      entityId: req.params.id,
      userId: req.user.id,
      userRole: req.user.role,
      severity: "warning",
    });

    logger.info("Table deleted", {
      tableId: req.params.id,
      deletedBy: req.user.id,
    });

    res.json({ success: true, message: "Table deleted successfully" });
  })
);

export default router;
