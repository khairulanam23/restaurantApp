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

// Helper function to check if string is UUID
const isUUID = (id) => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    id
  );
};

// Get Table Details - Updated to accept both UUID and tableNumber
router.get(
  "/:id",
  authenticate,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    let table;
    if (isUUID(id)) {
      // Find by UUID
      table = await Table.findByPk(id, {
        include: [{ model: Order, as: "orders" }],
      });
    } else {
      // Find by tableNumber
      const tableNumber = parseInt(id);
      if (isNaN(tableNumber)) {
        throw new AppError("Invalid table identifier", 400, "INVALID_INPUT");
      }
      table = await Table.findOne({
        where: { tableNumber },
        include: [{ model: Order, as: "orders" }],
      });
    }

    if (!table) throw new AppError("Table not found", 404, "NOT_FOUND");

    res.json({ success: true, data: { table } });
  })
);

// Update Table - Accept both UUID and tableNumber
router.put(
  "/:id",
  authenticate,
  authorize("admin", "manager"),
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    let table;
    if (isUUID(id)) {
      table = await Table.findByPk(id);
    } else {
      const tableNumber = parseInt(id);
      if (isNaN(tableNumber)) {
        throw new AppError("Invalid table identifier", 400, "INVALID_INPUT");
      }
      table = await Table.findOne({ where: { tableNumber } });
    }

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

// Update Table Status - Accept both UUID and tableNumber
router.put(
  "/:id/status",
  authenticate,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    let table;
    if (isUUID(id)) {
      table = await Table.findByPk(id);
    } else {
      const tableNumber = parseInt(id);
      if (isNaN(tableNumber)) {
        throw new AppError("Invalid table identifier", 400, "INVALID_INPUT");
      }
      table = await Table.findOne({ where: { tableNumber } });
    }

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

// Select Table - Accept both UUID and tableNumber
router.put(
  "/:id/select",
  authenticate,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    let table;
    if (isUUID(id)) {
      table = await Table.findByPk(id);
    } else {
      const tableNumber = parseInt(id);
      if (isNaN(tableNumber)) {
        throw new AppError("Invalid table identifier", 400, "INVALID_INPUT");
      }
      table = await Table.findOne({ where: { tableNumber } });
    }

    if (!table) throw new AppError("Table not found", 404, "NOT_FOUND");

    // Store in session/cache (simplified - in production use Redis)
    req.session = req.session || {};
    req.session.selectedTableId = table.id; // Always store the UUID

    res.json({ success: true, data: { table, message: "Table selected" } });
  })
);

// Get Table Order History - Accept both UUID and tableNumber
router.get(
  "/:id/orders",
  authenticate,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    let table;
    if (isUUID(id)) {
      table = await Table.findByPk(id);
    } else {
      const tableNumber = parseInt(id);
      if (isNaN(tableNumber)) {
        throw new AppError("Invalid table identifier", 400, "INVALID_INPUT");
      }
      table = await Table.findOne({ where: { tableNumber } });
    }

    if (!table) throw new AppError("Table not found", 404, "NOT_FOUND");

    const orders = await Order.findAll({
      where: { tableId: table.id }, // Use the table's UUID
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

    const total = await Order.count({ where: { tableId: table.id } });

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

// Delete Table - Accept both UUID and tableNumber
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    let table;
    if (isUUID(id)) {
      table = await Table.findByPk(id);
    } else {
      const tableNumber = parseInt(id);
      if (isNaN(tableNumber)) {
        throw new AppError("Invalid table identifier", 400, "INVALID_INPUT");
      }
      table = await Table.findOne({ where: { tableNumber } });
    }

    if (!table) throw new AppError("Table not found", 404, "NOT_FOUND");

    await table.destroy();

    await AuditLog.create({
      action: "table.deleted",
      entityType: "Table",
      entityId: table.id,
      userId: req.user.id,
      userRole: req.user.role,
      severity: "warning",
    });

    logger.info("Table deleted", {
      tableId: table.id,
      deletedBy: req.user.id,
    });

    res.json({ success: true, message: "Table deleted successfully" });
  })
);

export default router;
