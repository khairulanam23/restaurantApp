import express from "express";
import {
  Order,
  OrderLine,
  Table,
  MenuItem,
  User,
  AuditLog,
} from "../models/index.js";
import { AppError, asyncHandler } from "../middleware/errorHandler.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate, schemas } from "../middleware/validation.js";
import { logger } from "../utils/logger.js";
import { Op } from "sequelize";

const router = express.Router();

// Generate Order Number
const generateOrderNumber = async () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const count = await Order.count({
    where: {
      createdAt: {
        [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    },
  });
  return `ORD-${date}-${String(count + 1).padStart(3, "0")}`;
};

// List Orders with pagination and filters
router.get(
  "/",
  authenticate,
  asyncHandler(async (req, res) => {
    const { status, tableId, page = 1, limit = 20 } = req.query;
    const where = {};

    if (status) where.status = status;
    if (tableId) where.tableId = tableId;

    const orders = await Order.findAll({
      where,
      include: [
        { model: Table, as: "table" },
        { model: User, as: "server", attributes: ["id", "username", "email"] },
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

    const total = await Order.count({ where });

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

// Get Active Orders
router.get(
  "/active",
  authenticate,
  asyncHandler(async (req, res) => {
    const orders = await Order.findAll({
      where: {
        status: { [Op.in]: ["open", "confirmed", "in_kitchen", "ready"] },
      },
      include: [
        { model: Table, as: "table" },
        {
          model: OrderLine,
          as: "lines",
          include: [{ model: MenuItem, as: "menuItem" }],
        },
      ],
      order: [
        ["priority", "DESC"],
        ["createdAt", "ASC"],
      ],
    });

    res.json({ success: true, data: { orders } });
  })
);

// Get Kitchen Display Orders
router.get(
  "/kitchen",
  authenticate,
  authorize("kitchen_staff", "manager"),
  asyncHandler(async (req, res) => {
    const orders = await Order.findAll({
      where: { status: { [Op.in]: ["confirmed", "in_kitchen"] } },
      include: [
        { model: Table, as: "table" },
        {
          model: OrderLine,
          as: "lines",
          include: [{ model: MenuItem, as: "menuItem" }],
        },
      ],
      order: [
        ["priority", "DESC"],
        ["createdAt", "ASC"],
      ],
    });

    res.json({ success: true, data: { orders } });
  })
);

// Get Today's Orders
router.get(
  "/today",
  authenticate,
  asyncHandler(async (req, res) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const orders = await Order.findAll({
      where: { createdAt: { [Op.gte]: startOfDay } },
      include: [
        { model: Table, as: "table" },
        {
          model: OrderLine,
          as: "lines",
          include: [{ model: MenuItem, as: "menuItem" }],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({ success: true, data: { orders } });
  })
);

// Get Order Details
router.get(
  "/:id",
  authenticate,
  asyncHandler(async (req, res) => {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: Table, as: "table" },
        { model: User, as: "server" },
        {
          model: OrderLine,
          as: "lines",
          include: [{ model: MenuItem, as: "menuItem" }],
        },
      ],
    });

    if (!order) throw new AppError("Order not found", 404, "NOT_FOUND");

    res.json({ success: true, data: { order } });
  })
);

// Create Order
router.post(
  "/",
  authenticate,
  validate(schemas.createOrder),
  asyncHandler(async (req, res) => {
    const { tableId, customerCount, type } = req.validatedData;

    const table = await Table.findByPk(tableId);
    if (!table) throw new AppError("Table not found", 404, "NOT_FOUND");

    const orderNumber = await generateOrderNumber();

    const order = await Order.create({
      orderNumber,
      tableId,
      customerCount,
      type,
      serverId: req.user.id,
      status: "draft",
    });

    await table.update({ status: "occupied", currentOrderId: order.id });

    await AuditLog.create({
      action: "order.created",
      entityType: "Order",
      entityId: order.id,
      userId: req.user.id,
      userRole: req.user.role,
      newValues: { orderNumber, tableId, customerCount, type },
      severity: "info",
    });

    logger.info("Order created", {
      orderId: order.id,
      tableId,
      createdBy: req.user.id,
    });

    res.status(201).json({ success: true, data: { order } });
  })
);

// Get or Create Open Order for Table
router.post(
  "/:tableId/open",
  authenticate,
  asyncHandler(async (req, res) => {
    const table = await Table.findByPk(req.params.tableId);
    if (!table) throw new AppError("Table not found", 404, "NOT_FOUND");

    let order = await Order.findOne({
      where: {
        tableId: req.params.tableId,
        status: { [Op.in]: ["draft", "open"] },
      },
    });

    if (!order) {
      const orderNumber = await generateOrderNumber();
      order = await Order.create({
        orderNumber,
        tableId: req.params.tableId,
        serverId: req.user.id,
        status: "open",
      });
    }

    res.json({ success: true, data: { order } });
  })
);

// Add Item to Order
router.post(
  "/:id/items",
  authenticate,
  validate(schemas.addOrderItem),
  asyncHandler(async (req, res) => {
    const order = await Order.findByPk(req.params.id);
    if (!order) throw new AppError("Order not found", 404, "NOT_FOUND");

    if (order.status === "paid" || order.status === "cancelled") {
      throw new AppError(
        "Cannot add items to completed order",
        400,
        "ORDER_COMPLETED"
      );
    }

    const { menuItemId, quantity, specialInstructions, customization } =
      req.validatedData;

    const menuItem = await MenuItem.findByPk(menuItemId);
    if (!menuItem) throw new AppError("Menu item not found", 404, "NOT_FOUND");

    if (!menuItem.isAvailable) {
      throw new AppError("Menu item is not available", 400, "ITEM_UNAVAILABLE");
    }

    const customizationPrice = customization
      ? Object.values(customization).reduce(
          (sum, item) => sum + (item.price || 0),
          0
        )
      : 0;

    const lineTotal =
      (Number.parseFloat(menuItem.price) + customizationPrice) * quantity;

    const orderLine = await OrderLine.create({
      orderId: order.id,
      menuItemId,
      quantity,
      unitPrice: menuItem.price,
      lineTotal,
      specialInstructions,
      customization: customization || {},
    });

    // Update order totals
    const lines = await OrderLine.findAll({ where: { orderId: order.id } });
    const subtotal = lines.reduce(
      (sum, line) => sum + Number.parseFloat(line.lineTotal),
      0
    );
    const taxAmount = subtotal * Number.parseFloat(order.taxRate);
    const grandTotal =
      subtotal +
      taxAmount +
      Number.parseFloat(order.serviceCharge) -
      Number.parseFloat(order.discountAmount);

    await order.update({ subtotal, taxAmount, grandTotal, status: "open" });

    await AuditLog.create({
      action: "order.item_added",
      entityType: "OrderLine",
      entityId: orderLine.id,
      userId: req.user.id,
      userRole: req.user.role,
      newValues: { menuItemId, quantity, lineTotal },
      severity: "info",
    });

    logger.info("Item added to order", {
      orderId: order.id,
      itemId: menuItemId,
      quantity,
    });

    res.status(201).json({ success: true, data: { orderLine } });
  })
);

// Update Order Line
router.put(
  "/:id/items/:lineId",
  authenticate,
  asyncHandler(async (req, res) => {
    const order = await Order.findByPk(req.params.id);
    if (!order) throw new AppError("Order not found", 404, "NOT_FOUND");

    const orderLine = await OrderLine.findByPk(req.params.lineId);
    if (!orderLine)
      throw new AppError("Order line not found", 404, "NOT_FOUND");

    const { quantity, specialInstructions } = req.body;

    const oldValues = {
      quantity: orderLine.quantity,
      specialInstructions: orderLine.specialInstructions,
    };

    await orderLine.update({ quantity, specialInstructions });

    // Recalculate line total
    const lineTotal = Number.parseFloat(orderLine.unitPrice) * quantity;
    await orderLine.update({ lineTotal });

    // Update order totals
    const lines = await OrderLine.findAll({ where: { orderId: order.id } });
    const subtotal = lines.reduce(
      (sum, line) => sum + Number.parseFloat(line.lineTotal),
      0
    );
    const taxAmount = subtotal * Number.parseFloat(order.taxRate);
    const grandTotal =
      subtotal +
      taxAmount +
      Number.parseFloat(order.serviceCharge) -
      Number.parseFloat(order.discountAmount);

    await order.update({ subtotal, taxAmount, grandTotal });

    await AuditLog.create({
      action: "order.item_updated",
      entityType: "OrderLine",
      entityId: orderLine.id,
      userId: req.user.id,
      userRole: req.user.role,
      oldValues,
      newValues: { quantity, specialInstructions },
      severity: "info",
    });

    res.json({ success: true, data: { orderLine } });
  })
);

// Remove Item from Order
router.delete(
  "/:id/items/:lineId",
  authenticate,
  asyncHandler(async (req, res) => {
    const order = await Order.findByPk(req.params.id);
    if (!order) throw new AppError("Order not found", 404, "NOT_FOUND");

    const orderLine = await OrderLine.findByPk(req.params.lineId);
    if (!orderLine)
      throw new AppError("Order line not found", 404, "NOT_FOUND");

    const lineTotal = orderLine.lineTotal;

    await orderLine.destroy();

    // Update order totals
    const lines = await OrderLine.findAll({ where: { orderId: order.id } });
    const subtotal = lines.reduce(
      (sum, line) => sum + Number.parseFloat(line.lineTotal),
      0
    );
    const taxAmount = subtotal * Number.parseFloat(order.taxRate);
    const grandTotal =
      subtotal +
      taxAmount +
      Number.parseFloat(order.serviceCharge) -
      Number.parseFloat(order.discountAmount);

    await order.update({ subtotal, taxAmount, grandTotal });

    await AuditLog.create({
      action: "order.item_removed",
      entityType: "OrderLine",
      entityId: req.params.lineId,
      userId: req.user.id,
      userRole: req.user.role,
      oldValues: { lineTotal },
      severity: "info",
    });

    res.json({ success: true, message: "Item removed from order" });
  })
);

// Update Order Line Status
router.put(
  "/:id/items/:lineId/status",
  authenticate,
  authorize("kitchen_staff", "manager"),
  asyncHandler(async (req, res) => {
    const orderLine = await OrderLine.findByPk(req.params.lineId);
    if (!orderLine)
      throw new AppError("Order line not found", 404, "NOT_FOUND");

    const { status } = req.body;
    const oldStatus = orderLine.status;

    const updateData = { status };

    if (status === "preparing") {
      updateData.startedAt = new Date();
      updateData.preparedBy = req.user.id;
    } else if (status === "ready") {
      updateData.completedAt = new Date();
    } else if (status === "served") {
      updateData.servedAt = new Date();
    }

    await orderLine.update(updateData);

    await AuditLog.create({
      action: "order.line_status_updated",
      entityType: "OrderLine",
      entityId: orderLine.id,
      userId: req.user.id,
      userRole: req.user.role,
      oldValues: { status: oldStatus },
      newValues: { status },
      severity: "info",
    });

    res.json({ success: true, data: { orderLine } });
  })
);

// Update Order Status
router.put(
  "/:id/status",
  authenticate,
  asyncHandler(async (req, res) => {
    const order = await Order.findByPk(req.params.id);
    if (!order) throw new AppError("Order not found", 404, "NOT_FOUND");

    const { status } = req.body;
    const oldStatus = order.status;

    await order.update({ status });

    if (status === "served") {
      await order.update({ servedAt: new Date() });
    }

    await AuditLog.create({
      action: "order.status_updated",
      entityType: "Order",
      entityId: order.id,
      userId: req.user.id,
      userRole: req.user.role,
      oldValues: { status: oldStatus },
      newValues: { status },
      severity: "info",
    });

    logger.info("Order status updated", {
      orderId: order.id,
      status,
      updatedBy: req.user.id,
    });

    res.json({ success: true, data: { order } });
  })
);

// Update Order Priority
router.put(
  "/:id/priority",
  authenticate,
  authorize("manager", "kitchen_staff"),
  asyncHandler(async (req, res) => {
    const order = await Order.findByPk(req.params.id);
    if (!order) throw new AppError("Order not found", 404, "NOT_FOUND");

    const { priority } = req.body;
    await order.update({ priority });

    await AuditLog.create({
      action: "order.priority_updated",
      entityType: "Order",
      entityId: order.id,
      userId: req.user.id,
      userRole: req.user.role,
      newValues: { priority },
      severity: "info",
    });

    res.json({ success: true, data: { order } });
  })
);

// Confirm Order (send to kitchen)
router.post(
  "/:id/confirm",
  authenticate,
  asyncHandler(async (req, res) => {
    const order = await Order.findByPk(req.params.id, {
      include: [{ model: OrderLine, as: "lines" }],
    });

    if (!order) throw new AppError("Order not found", 404, "NOT_FOUND");

    if (order.lines.length === 0) {
      throw new AppError("Cannot confirm order without items", 400, "NO_ITEMS");
    }

    await order.update({ status: "confirmed" });

    // Update all lines to confirmed
    await OrderLine.update(
      { status: "confirmed" },
      { where: { orderId: order.id } }
    );

    await AuditLog.create({
      action: "order.confirmed",
      entityType: "Order",
      entityId: order.id,
      userId: req.user.id,
      userRole: req.user.role,
      severity: "info",
    });

    logger.info("Order confirmed", {
      orderId: order.id,
      confirmedBy: req.user.id,
    });

    res.json({ success: true, data: { order } });
  })
);

// Cancel Order
router.post(
  "/:id/cancel",
  authenticate,
  asyncHandler(async (req, res) => {
    const order = await Order.findByPk(req.params.id);
    if (!order) throw new AppError("Order not found", 404, "NOT_FOUND");

    if (order.status === "paid") {
      throw new AppError("Cannot cancel paid order", 400, "ORDER_PAID");
    }

    const { reason } = req.body;
    await order.update({ status: "cancelled", kitchenNotes: reason });

    const table = await Table.findByPk(order.tableId);
    if (table) {
      await table.update({ status: "free", currentOrderId: null });
    }

    await AuditLog.create({
      action: "order.cancelled",
      entityType: "Order",
      entityId: order.id,
      userId: req.user.id,
      userRole: req.user.role,
      newValues: { reason },
      severity: "warning",
    });

    logger.info("Order cancelled", {
      orderId: order.id,
      reason,
      cancelledBy: req.user.id,
    });

    res.json({ success: true, message: "Order cancelled successfully" });
  })
);

// Duplicate Order (for split bills)
router.post(
  "/:id/duplicate",
  authenticate,
  asyncHandler(async (req, res) => {
    const originalOrder = await Order.findByPk(req.params.id, {
      include: [{ model: OrderLine, as: "lines" }],
    });

    if (!originalOrder) throw new AppError("Order not found", 404, "NOT_FOUND");

    const orderNumber = await generateOrderNumber();

    const newOrder = await Order.create({
      orderNumber,
      tableId: originalOrder.tableId,
      customerCount: originalOrder.customerCount,
      type: originalOrder.type,
      serverId: req.user.id,
      status: "draft",
      taxRate: originalOrder.taxRate,
    });

    // Duplicate all lines
    for (const line of originalOrder.lines) {
      await OrderLine.create({
        orderId: newOrder.id,
        menuItemId: line.menuItemId,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        lineTotal: line.lineTotal,
        specialInstructions: line.specialInstructions,
        customization: line.customization,
      });
    }

    // Update totals
    const subtotal = originalOrder.subtotal;
    const taxAmount = subtotal * Number.parseFloat(newOrder.taxRate);
    const grandTotal = subtotal + taxAmount;

    await newOrder.update({ subtotal, taxAmount, grandTotal });

    await AuditLog.create({
      action: "order.duplicated",
      entityType: "Order",
      entityId: newOrder.id,
      userId: req.user.id,
      userRole: req.user.role,
      newValues: { sourceOrderId: originalOrder.id },
      severity: "info",
    });

    res.status(201).json({ success: true, data: { order: newOrder } });
  })
);

// Get Order Timeline
router.get(
  "/:id/timeline",
  authenticate,
  asyncHandler(async (req, res) => {
    const logs = await AuditLog.findAll({
      where: { entityId: req.params.id, entityType: "Order" },
      order: [["timestamp", "ASC"]],
    });

    res.json({ success: true, data: { timeline: logs } });
  })
);

export default router;
